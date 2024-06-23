// Frontend Code to Handle Avatar Upload and Signup
import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import user_icon from "../assets/person.png";
import user_password from "../assets/password.png";
import user_email from "../assets/email.png";
import '../Pages/signUp.scss';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    if (e.target.id === 'role') {
      setFormData({
        ...formData,
        role: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='signup-container'>
      <div className="title">
        <h1 className='signup-title'>Sign Up</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signup-form'>
        <div className="signup-input">
          <img src={user_icon} alt="" />
          <input
            type='text'
            placeholder='username'
            id='username'
            onChange={handleChange}
          />
        </div>
        <div className="signup-input">
          <img src={user_email} alt="" />
          <input
            type='email'
            placeholder='email'
            id='email'
            onChange={handleChange}
          />
        </div>
        <div className="signup-input">
          <div className="avatar-upload-container" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              src={formData.avatar || user_icon} // Replace user_icon with a placeholder image if needed
              alt='profile'
              onClick={() => fileRef.current.click()}
              className='rounded-full h-12 w-12 object-cover cursor-pointer'
              style={{ marginRight: '10px' }}
            />
            <span className='text-slate-700 cursor-pointer' onClick={() => fileRef.current.click()}>Upload Photo</span>
          </div>
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>Error Image upload (image must be less than 2 mb)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-200'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
        </div>
        <select
          className='signup-select'
          id='role'
          onChange={handleChange}
          required
        >
          <option value=''>Select Role</option>
          <option value='admin'>Admin</option>
          <option value='landlord'>Landlord</option>
          <option value='user'>User</option>
        </select>
        <div className="signup-input">
          <img src={user_password} alt="" />
          <input
            type='password'
            placeholder='password'
            id='password'
            onChange={handleChange}
          />
        </div>
        
        <div className="buttons">
          <button
            disabled={loading}
            className='signup-button'
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
        <OAuth />
      </form>
      <div className='account-info'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='signin-link'>Sign in</span>
        </Link>
      </div>
      {error && <p className='signup-error'>{error}</p>}
    </div>
  );
}
