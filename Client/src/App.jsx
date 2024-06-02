import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import Header from "./components/Header/Header";
 import Listing from "./Pages/Listing";
import Search from "./Pages/Search";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/UpdateListing";
import './index.css';
import '../i18n';
import ProfileManagement from "./components/ProfileManagement";
import PrivateRoute from './components/PrivateRoute';
import User from './Pages/User';





const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserRole = currentUser?.role; // Dynamically get the user role from the Redux store

  return (
    <BrowserRouter>    
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />

        {currentUserRole === 'admin' && (
        <Route element={""}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        


        </Route>
        )}


        <Route element={<PrivateRoute  />}>
          <Route path='/listing/:listingId' element={<Listing />} />
        </Route>

        {currentUserRole === 'user' && (
          <Route path='/user-dashboard' element={<User />} />
        )}
         



        <Route element={<PrivateRoute allowedRoles={['landlord']} />}>
          <Route path='/landlord' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
          <Route path="/profile-management" element={<ProfileManagement />} />
        </Route>
      </Routes>
     
    </BrowserRouter>
  );
};

export default App;
