import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import Sidebar from '../components/Sidebar';
import { handleLogout } from '../lib/utils';
import { clearCurrentUser } from '../redux/user/userSlice';
import "./createMaintenance.scss"

import PropTypes from 'prop-types';

export default function CreateMaintenance() {
  const { currentUser, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    maintenanceData: { 
      name: '',
      property: '',
      status: '',
      description: '',
      city: '',
      address: '',
      type:'',
      size: '',
      maintenanceCharge: '',
      furnished: false,
      parking: false,
      latitude: '',
      longitude: '',
      imageUrls: [],
      yearBuilt: '',
      lastRenovationDate: '',
      materialsUsed: '',
      estimatedValue: '',
      condition: '',
      maintenanceSchedule: '',
    },
    maintenanceHistory: {
      description: '',
      date: '',
      cost: '',
    },
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.maintenanceData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = files.map(file => storeImage(file));

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            maintenanceData: {
              ...formData.maintenanceData,
              imageUrls: formData.maintenanceData.imageUrls.concat(urls),
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
      maintenanceData: {
        ...formData.maintenanceData,
        imageUrls: formData.maintenanceData.imageUrls.filter((_, i) => i !== index),
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
    } else if (mainKey === 'maintenanceData' && (subKey === 'maintenanceCharge' || subKey === 'estimatedValue' || subKey === 'yearBuilt' )) {
      setFormData({
        ...formData,
        maintenanceData: {
          ...formData.maintenanceData,
          [subKey]: parseFloat(value),
        },
      });
    } else if (mainKey === 'maintenanceData' && subKey === 'size') {
      setFormData({
        ...formData,
        maintenanceData: {
          ...formData.maintenanceData,
          [subKey]: parseFloat(value),
        },
      });
    } else if (mainKey === 'maintenanceData' && (subKey === 'latitude' || subKey === 'longitude')) {
      setFormData({
        ...formData,
        maintenanceData: {
          ...formData.maintenanceData,
          [subKey]: parseFloat(value),
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
  
    if (formData.maintenanceData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }
  
    setLoading(true);
    setError(false);
   
    formData.maintenanceData.size = parseFloat(formData.maintenanceData.size);
    formData.maintenanceData.yearBuilt = parseFloat(formData.maintenanceData.yearBuilt);
    formData.maintenanceHistory.cost = parseFloat(formData.maintenanceHistory.cost);
  
    try {
      const res = await fetch('/api/maintenance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Using token for authorization
        },
        body: JSON.stringify({
          maintenanceData: formData.maintenanceData,
          maintenanceHistory: formData.maintenanceHistory,
          userRef: currentUser.id,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to create maintenance record');
      }
  
      const data = await res.json();
      setLoading(false);
  
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/maintenance/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  const onLogOut = () => handleLogout(navigate, dispatch, clearCurrentUser);

  return (
    <div className='flex'>
     <Sidebar onLogout={onLogOut} />
    <main className="bg-gray-100  w-full flex flex-col items-center justify-center  mainsection">
      <form className="space-y-4 divide-y divide-gray-200 w-full  bg-gray-200 pt-4 rounded-lg" onSubmit={handleSubmit}>
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
   
      <div className="button-container">
          <button type="submit" className=".custom-font bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Save Changes</button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      </form>
    </main>
    </div>
  );
}

function PropertyDetails({ formData, handleChange }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-center .custom-font">Add Maintenance Information</h2>
      <div className="grid grid-cols-2 gap-8 w-full mt-6 pr-4 pt-4 pl-10 ml-8">
        <div className="grid grid-cols-1 gap-6">
          <InputField label="Property Name" id="maintenanceData.name" type="text" value={formData.maintenanceData.name} onChange={handleChange} placeholder="Enter property name" />
          <InputField label="Property Address" id="maintenanceData.address" type="text" value={formData.maintenanceData.address} onChange={handleChange} placeholder="Enter property address" />
          <SelectField label="maintenance type" id="maintenanceData.type" value={formData.maintenanceData.type} onChange={handleChange} placeholder="select maintenance type"
          options={[
            { value: '', label: 'Click to select ' },
            { value: 'Routine', label: 'Routine Maintenance' },
            { value: 'Preventive', label: 'Preventive Maintenance' },
            { value: 'Corrective', label: 'Corrective Maintenance' },
            { value: 'Predictive', label: 'Predictive Maintenance' },
            { value: 'Emergency', label: 'Emergency Maintenance' },
            { value: 'Cosmetic', label: 'Cosmetic Maintenance' },
            { value: 'Seasonal', label: 'Seasonal Maintenance' },
            { value: 'Deferred', label: 'Deferred Maintenance' },
           ]} />
            <SelectField label="Property Type" id="maintenanceData.property" value={formData.maintenanceData.property} onChange={handleChange} placeholder=" select property type"
          options={[
            { value: '', label: 'Click to select ' },
            { value: 'COMMERCIAL', label: 'Commercial' },
            { value: 'RESIDENTIAL', label: 'Residential' },
            { value: 'INDUSTRIAL', label: 'Industrial' },
            { value: 'LAND', label: 'Land' }           
           ]} />
          <InputField label="City/District/Location" id="maintenanceData.city" type="text" value={formData.maintenanceData.city} onChange={handleChange} placeholder="Enter location" />
          <InputField label="Latitude" id="maintenanceData.latitude" type="number"  step="any" value={formData.maintenanceData.latitude} onChange={handleChange} placeholder="Enter latitude" />
          <InputField label="Longitude" id="maintenanceData.longitude" type="number"  step="any" value={formData.maintenanceData.longitude} onChange={handleChange} placeholder="Enter longitude" />
          <CheckboxField label="Furnished" id="maintenanceData.furnished" checked={formData.maintenanceData.furnished} onChange={handleChange} />
          <CheckboxField label="Parking Spot" id="maintenanceData.parking" checked={formData.maintenanceData.parking} onChange={handleChange} />
          <TextAreaField label="maintenance description" id="maintenanceData.description" type="text" value={formData.maintenanceData.description} onChange={handleChange} placeholder="maintenance description" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <InputField label="Size (sqft)" id="maintenanceData.size" type="number" value={formData.maintenanceData.size} onChange={handleChange} placeholder="Enter property size" />
          <InputField label="maintenance Charge($)" id="maintenanceData.maintenanceCharge" type="number" value={formData.maintenanceData.maintenanceCharge} onChange={handleChange} placeholder="Enter maintenance charge" />
          <InputField label="Estimated Value ($)" id="maintenanceData.estimatedValue" type="number" value={formData.maintenanceData.estimatedValue} onChange={handleChange} placeholder="Enter estimated value" />
          <InputField label="Year Built" id="maintenanceData.yearBuilt" type="number" step="any" value={formData.maintenanceData.yearBuilt} onChange={handleChange} placeholder="Enter year built" />
          <InputField label="Last Renovation Date" id="maintenanceData.lastRenovationDate" type="date" value={formData.maintenanceData.lastRenovationDate} onChange={handleChange} />
          <TextAreaField label="Materials Used" id="maintenanceData.materialsUsed" type="text" value={formData.maintenanceData.materialsUsed} onChange={handleChange} placeholder="Enter materials used" />
          <SelectField label="Property Condition" id="maintenanceData.condition" value={formData.maintenanceData.condition} onChange={handleChange} placeholder=" select property state"
          options={[
            { value: '', label: 'Click to select ' },
            { value: 'NEW', label: 'NEW' },
            { value: 'GOOD', label: 'GOOD' },
            { value: 'FAIR', label: 'FAIR' },
            { value: 'POOR', label: 'POOR' }           
           ]} />

<SelectField label="Property Status" id="maintenanceData.status" value={formData.maintenanceData.status} onChange={handleChange} placeholder=" select property status"
          options={[
            { value: '', label: 'Click to select ' },
            { value: 'UNOCCUPIED', label: 'UNOCCUPIED' },
            { value: 'RENTED', label: 'RENTED' },
            { value: 'UNDER_maintenance', label: 'UNDER maintenance' },
            { value: 'UNDER_SALE', label: 'UNDER SALE' }           
           ]} />   

        <InputField label="maintenance schedule" id="maintenanceData.maintenanceSchedule" type="text" value={formData.maintenanceData.maintenanceSchedule} onChange={handleChange} placeholder=" specify maintenance schedule" />      
        </div>
      </div>
    </div>
  );
}

function ImageUploadSection({ setFiles, handleImageSubmit, handleRemoveImage, uploading, formData,  imageUploadError }) {
  return (
    <div className="pt-8 w-full flex flex-col items-center">
      <h2 className="text-base font-semibold leading-7 .custom-font">Upload Images  max(6)</h2>
      <div className="mt-2 flex items-center gap-x-3">
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
        <button type="button" onClick={handleImageSubmit} className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Upload</button>
      </div>
      {uploading && <p className="text-blue-500">Uploading images...</p>}
      {imageUploadError && <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>}
      {formData.maintenanceData.imageUrls.length > 0 && ( 

      <div className="grid grid-cols-3 gap-4 mt-4">
        {formData.maintenanceData.imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full">X</button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function AdditionalInformation({ formData, handleChange }) {
  return (
    <div className="pb-12 pt-8">
      <h2 className="text-base font-semibold leading-7 .custom-font text-center">Add maintenance History</h2>
      <div className=" ml-8 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
        <TextAreaField label="Description" id="maintenanceHistory.description" type="text" value={formData.maintenanceHistory.description} onChange={handleChange} placeholder="Enter maintenance history description" className="sm:col-span-2 sm:col-start-1" />       
        <InputField label="Date" id="maintenanceHistory.date" type="date" value={formData.maintenanceHistory.date} onChange={handleChange} className="sm:col-span-2 sm:col-start-1" />
        <InputField label="Cost" id="maintenanceHistory.cost" type="number" value={formData.maintenanceHistory.cost} onChange={handleChange} placeholder="Enter cost" className="sm:col-span-2 sm:col-start-1" />
      </div>
    </div>
  );
}

function InputField({ label, id, type, value, onChange, placeholder }) {
  return (
    <div className='flex flex-col'>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-1/2 pl-3 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}


function SelectField({ label, id, value, onChange, options }) {
    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="block text-sm font-medium .custom-font">
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="mt-2 block w-1/2 px-12 py-2 bg-gray-200 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm .custom-font"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  

  function TextAreaField({ label, id, value, onChange, placeholder }) {
    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="block text-sm font-medium .custom-font .custom-font">
          {label}
        </label>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-2 block w-3/4 px-3 py-2  bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm .custom-font"
        />
      </div>
    );
  }  

function CheckboxField({ label, id, checked, onChange}) {
  return (
    <div className='relative flex gap-x-3'>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
      <label htmlFor={id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
    </div>
  );
}

CreateMaintenance.propTypes = {
  currentUser: PropTypes.object,
  token: PropTypes.string,
  
};

PropertyDetails.propTypes = {
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
  };

  TextAreaField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

CheckboxField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    className:PropTypes,
    onChange: PropTypes.func.isRequired,
  };
  
  ImageUploadSection.propTypes = {
    setFiles: PropTypes.func.isRequired,
    handleImageSubmit: PropTypes.func.isRequired,
    handleRemoveImage: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    formData: PropTypes.object.isRequired,
    error: PropTypes.string,
    imageUploadError: PropTypes.string,
  };
  
  AdditionalInformation.propTypes = {
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
  };


SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })).isRequired,
  };
  
  InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };
  
 

