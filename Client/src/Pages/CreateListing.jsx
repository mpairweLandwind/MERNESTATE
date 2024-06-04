import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import PropTypes from 'prop-types';


export default function CreateListing() {
  const { currentUser, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    listingData: { 
      name: '',
      type: 'rent',
      property: '',
      status: '',
      description: '',
      city: '',
      address: '',
      regularPrice: '',
      discountPrice: '',
      bathrooms: 1,
      bedrooms: 1,
      furnished: false,
      parking: false,
      offer: false,
      latitude: '',
      longitude: '',
      imageUrls: [],
    },
    postDetail: {
      desc: '',
      utilities: '',
      pet: '',
      income: '',
      size: '',
      school: '',
      bus: '',
      restaurant: '',
    },
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.listingData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = files.map(file => storeImage(file));

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            listingData: {
              ...formData.listingData,
              imageUrls: formData.listingData.imageUrls.concat(urls),
            },
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError(error.message);
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      listingData: {
        ...formData.listingData,
        imageUrls: formData.listingData.imageUrls.filter((_, i) => i !== index),
      },
    });
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    const [mainKey, subKey] = id.split('.');

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [mainKey]: {
          ...formData[mainKey],
          [subKey]: checked,
        },
      });
    } else if (mainKey === 'listingData' && (subKey === 'regularPrice' || subKey === 'discountPrice')) {
      setFormData({
        ...formData,
        listingData: {
          ...formData.listingData,
          [subKey]: parseFloat(value),
        },
      });
    } else if (mainKey === 'listingData' && (subKey === 'bathrooms' || subKey === 'bedrooms')) {
      setFormData({
        ...formData,
        listingData: {
          ...formData.listingData,
          [subKey]: parseInt(value, 10),
        },
      });
    } else {
      setFormData({
        ...formData,
        [mainKey]: {
          ...formData[mainKey],
          [subKey]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.listingData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }

    if (+formData.listingData.regularPrice < +formData.listingData.discountPrice) {
      return setError('Discount price must be lower than regular price or zero');
    }

    setLoading(true);
    setError(false);

    // Ensure bathrooms and bedrooms are integers
    const sanitizedData = {
      ...formData.listingData,
      bathrooms: parseInt(formData.listingData.bathrooms, 10),
      bedrooms: parseInt(formData.listingData.bedrooms, 10),
    };

    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Using token for authorization
        },
        body: JSON.stringify({
          ...sanitizedData,
          userRef: currentUser.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create listing');
      }

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-900 flex flex-col items-center justify-center p-10">
      <form className="space-y-8 divide-y divide-gray-200 w-full max-w-4xl bg-gray-800 p-10 rounded-lg" onSubmit={handleSubmit}>
        <PropertyDetails formData={formData} handleChange={handleChange} />
        <ImageUploadSection 
          setFiles={setFiles} 
          handleImageSubmit={handleImageSubmit} 
          handleRemoveImage={handleRemoveImage} 
          uploading={uploading} 
          formData={formData} 
          loading={loading} 
          error={error} 
          imageUploadError={imageUploadError} 
        />
        <AdditionalInformation formData={formData} handleChange={handleChange} />
        <div className="mt-6 ml-52">
          <button type="submit" className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Save Changes</button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </main>
  );
}


function PropertyDetails({ formData, handleChange }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-center text-white">Add  Property Information</h2>
      <div className="grid grid-cols-2 gap-8 w-full mt-6 pr-4 pt-4 pl-10 ml-8">
        <div className="grid grid-cols-1 gap-6">
          <InputField label="Property Name" id="listingData.name" type="text" value={formData.listingData.name} onChange={handleChange} placeholder="Enter property name" />
          <InputField label="Property Address" id="listingData.address" type="text" value={formData.listingData.address} onChange={handleChange} placeholder="Enter property address" />
          <InputField label="City/Districtict/Location" id="listingData.city" type="text" value={formData.listingData.city} onChange={handleChange} placeholder="Enter location" />        
          <InputField label="Latitude" id="listingData.latitude" type="text" value={formData.listingData.latitude} onChange={handleChange} placeholder="Enter latitude" />
          <InputField label="Longitude" id="listingData.longitude" type="text" value={formData.listingData.longitude} onChange={handleChange} placeholder="Enter longitude" />         
          <CheckboxField label="Furnished" id="listingData.furnished" checked={formData.listingData.furnished} onChange={handleChange} />
          <CheckboxField label="Parking Spot" id="listingData.parking" checked={formData.listingData.parking} onChange={handleChange} />
          <CheckboxField label="Offer" id="listingData.offer" checked={formData.listingData.offer} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-1 gap-6">
          <InputField label="Regular Price($)" id="listingData.regularPrice" type="text" value={formData.listingData.regularPrice} onChange={handleChange} placeholder="Enter regular price" />
          <InputField label="Discount Price($)" id="listingData.discountPrice" type="text" value={formData.listingData.discountPrice} onChange={handleChange} placeholder="Enter discount price" />
          <InputField label="Bedrooms" id="listingData.bedrooms" type="text" value={formData.listingData.bedrooms} onChange={handleChange} placeholder="Enter number of bedrooms" />
          <InputField label="Bathrooms" id="listingData.bathrooms" type="text" value={formData.listingData.bathrooms} onChange={handleChange} placeholder="Enter number of bathrooms" />
          <InputField label="Property Type" id="listingData.property" type="text" value={formData.listingData.property} onChange={handleChange} placeholder="Enter property type" />
          <SelectField label="Status" id="listingData.status" type="text" value={formData.listingData.status} onChange={handleChange} placeholder="Enter property status" options={['available', 'occupied', 'under_contract', 'for_sale', 'under_renovation', 'pending_approval', 'sold', 'terminated', 'pending_availability', 'inactive']}  />
          <SelectField label="Transaction Type" id="listingData.type" value={formData.listingData.type} onChange={handleChange} options={[{value: 'rent', label: 'Rent'}, {value: 'sale', label: 'Sale'}]} />
          <TextAreaField label="Description" id="listingData.description" value={formData.listingData.description} onChange={handleChange} placeholder="Enter property description" />
        </div>
      </div>
    </div>
  );
}

function CheckboxField({ label, id, checked, onChange }) {
  return (
    <div className="relative flex gap-x-3">
      <div className="flex h-6 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={id} className="font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
}


function ImageUploadSection({ setFiles, handleImageSubmit, handleRemoveImage, uploading, formData, imageUploadError }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-white">Photos</h2>
      <div className="mt-3 flex flex-col">
        <input 
          type="file"
          multiple
          accept=".jpg,.png,.jpeg"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
        {imageUploadError && <p className="text-red-500 mt-2">{imageUploadError}</p>}
        {uploading && <p className="text-white mt-2">Uploading images...</p>}
        {formData.listingData.imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.listingData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover" />
                <button 
                  type="button"
                  className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1 shadow-md"
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        <button 
          type="button"
          onClick={handleImageSubmit}
          className="mt-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
}

function AdditionalInformation({ formData, handleChange }) {
  return (
    <div className="pt-8">
      <h2 className="text-base font-semibold text-white">Additional Information</h2>
      <div className="grid grid-cols-2 gap-8 mt-6 pr-4 pt-4 pl-10 ml-8">
        <div className="grid grid-cols-1 gap-6">
          <TextAreaField label="Post Description" id="postDetail.desc" value={formData.postDetail.desc} onChange={handleChange} placeholder="Enter post description" />
          <InputField label="Utilities" id="postDetail.utilities" value={formData.postDetail.utilities} onChange={handleChange} placeholder="Enter utilities details" />
          <InputField label="Pet Policy" id="postDetail.pet" value={formData.postDetail.pet} onChange={handleChange} placeholder="Enter pet policy" />
          <InputField label="Income Requirements" id="postDetail.income" value={formData.postDetail.income} onChange={handleChange} placeholder="Enter income requirements" />
        </div>
        <div className="grid grid-cols-1 gap-6">         
          <InputField label="Size Details" id="postDetail.size" value={formData.postDetail.size} onChange={handleChange} placeholder="Enter size details" />
          <InputField label="Nearby Schools" id="postDetail.school" value={formData.postDetail.school} onChange={handleChange} placeholder="Enter nearby schools" />
          <InputField label="Nearby Bus Stops" id="postDetail.bus" value={formData.postDetail.bus} onChange={handleChange} placeholder="Enter nearby bus stops" />
          <InputField label="Nearby Restaurants" id="postDetail.restaurant" value={formData.postDetail.restaurant} onChange={handleChange} placeholder="Enter nearby restaurants" />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, id, type, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-white">{label}</label>
      <input 
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 px-2 py-1 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-green-600 sm:text-sm w-full"
      />
    </div>
  );
}

function TextAreaField({ label, id, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-white">{label}</label>
      <textarea 
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 px-2 py-1 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-green-600 sm:text-sm w-full"
      />
    </div>
  );
}

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-white">{label}</label>
      <select 
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 px-2 py-1 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-green-600 sm:text-sm w-full"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

PropertyDetails.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

ImageUploadSection.propTypes = {
  setFiles: PropTypes.func.isRequired,
  handleImageSubmit: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  imageUploadError: PropTypes.string,
};

AdditionalInformation.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

CheckboxField.defaultProps = {
  checked: false,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};
