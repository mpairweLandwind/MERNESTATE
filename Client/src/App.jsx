import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "./components/Header/Header";
import PrivateRoute from './components/PrivateRoute';
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import Listing from "./Pages/Listing";
import Search from "./Pages/Search";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/UpdateListing";
import User from './Pages/User';
import Admin from './Pages/Admin';
import './index.css';
import '../i18n';

const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserRole = currentUser?.role;

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
          <Route path='/admin-dashboard/*' element={<Admin />} />
        )}

        <Route element={<PrivateRoute />}>
          <Route path='/listing/:listingId' element={<Listing />} />
        </Route>

        {currentUserRole === 'user' && (
          <Route path='/user-dashboard' element={<User />} />
        )}

        <Route element={<PrivateRoute allowedRoles={['landlord']} />}>
          <Route path='/landlord' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
