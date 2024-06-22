import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector , useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { handleLogout } from '../lib/utils';
import { clearCurrentUser } from '../redux/user/userSlice';
import "./update-maintenance.scss"


export default function UpdateMaintenance() {
  const { currentUser, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    type: '',
    property: '',
    status: '',
    description: '',
    city: '',
    address: '',
    size: '',
    maintenanceCharge: 0,
    furnished: false,
    parking: false,
    latitude: '',
    longitude: '',
    yearBuilt: '',
    lastRenovationDate: '',
    materialsUsed: '',
    estimatedValue: '',
    condition: '',
    maintenanceSchedule: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaintenance = async () => {
      const maintenanceId = params.maintenanceId;
      const res = await fetch(`/api/maintenance/get/${maintenanceId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchMaintenance();
  }, [params.maintenanceId]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError('You must upload at least one image');
        return;
      }
  
      setLoading(true);
      setError(false);
  
      const res = await fetch(`/api/maintenance/update/${params.maintenanceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Using token for authorization
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update maintenance');
      }
  
      // Redirect to the updated maintenance page using the returned id
      navigate(`/maintenance/${data.id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  const onLogOut = () => handleLogout(navigate, dispatch, clearCurrentUser);

  return (
    <div className='flex bg-white '>
       <Sidebar onLogout={onLogOut} />
    <main className='bg-gray-100  w-full flex flex-col items-center justify-center  mainsection'>
        <div className='flex flex-col gap-4'>
      <h1 className='text-3xl font-semibold text-center my-7 text-gray-800'>
        Update Maintenance
      </h1>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
        <span> Name</span>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg text-gray-800'
            id='name'
            required
            onChange={handleChange}
            value={formData.name}
          />
             <span>Type</span>
          <input
            type='text'
            placeholder='Type'
            className='border p-3 rounded-lg text-gray-800'
            id='type'
            required
            onChange={handleChange}
            value={formData.type}
          />
            <span>Property</span>
          <input
            type='text'
            placeholder='Property'
            className='border p-3 rounded-lg text-gray-800'
            id='property'
            required
            onChange={handleChange}
            value={formData.property}
          />
           <span>Status</span>
          <input
            type='text'
            placeholder='Status'
            className='border p-3 rounded-lg text-gray-800'
            id='status'
            required
            onChange={handleChange}
            value={formData.status}
          />
           <span>Description</span>
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg text-gray-800'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
           <span>city/location</span>
          <input
            type='text'
            placeholder='City'
            className='border p-3 rounded-lg text-gray-800'
            id='city'
            required
            onChange={handleChange}
            value={formData.city}
          />
           <span>Address</span>
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg text-gray-800'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
           <span>Size</span>
          <input
            type='number'
            placeholder='Size'
            className='border p-3 rounded-lg text-gray-800'
            id='size'
            onChange={handleChange}
            value={formData.size}
          />
           <span>Maintenance Charge</span>
          <input
            type='number'
            placeholder='Maintenance Charge'
            className='border p-3 rounded-lg text-gray-800'
            id='maintenanceCharge'
            required
            onChange={handleChange}
            value={formData.maintenanceCharge}
          />
           <span>Latitude</span>
          <input
            type='number'
            placeholder='Latitude'
            className='border p-3 rounded-lg text-gray-800'
            id='latitude'
            onChange={handleChange}
            value={formData.latitude}
          />
           <span>Longitude</span>
          <input
            type='number'
            placeholder='Longitude'
            className='border p-3 rounded-lg text-gray-800'
            id='longitude'
            onChange={handleChange}
            value={formData.longitude}
          />

           <span>Year Built</span>
          <input
            type='number'
            placeholder='Year Built'
            className='border p-3 rounded-lg text-gray-800'
            id='yearBuilt'
            onChange={handleChange}
            value={formData.yearBuilt}
          />
           
           <span>Materials Used</span>
          <input
            type='text'
            placeholder='Materials Used'
            className='border p-3 rounded-lg text-gray-800'
            id='materialsUsed'
            required
            onChange={handleChange}
            value={formData.materialsUsed}
          />
           <span>Estimated Value</span>
          <input
            type='number'
            placeholder='Estimated Value'
            className='border p-3 rounded-lg text-gray-800'
            id='estimatedValue'
            onChange={handleChange}
            value={formData.estimatedValue}
          />
           <span>Condition</span>
          <input
            type='text'
            placeholder='Condition'
            className='border p-3 rounded-lg text-gray-800'
            id='condition'
            required
            onChange={handleChange}
            value={formData.condition}
          />
           <span>Maintenance Schedule</span>
          <input
            type='text'
            placeholder='Maintenance Schedule'
            className='border p-3 rounded-lg text-gray-800'
            id='maintenanceSchedule'
            required
            onChange={handleChange}
            value={formData.maintenanceSchedule}
          />
          
          <div className='flex gap-6'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Updating...' : 'Update Maintenance'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
    </div>
  );
}
