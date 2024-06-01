import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import themeSettings from "theme"
import createTheme from '@mui/material';
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
import { CssBaseline, ThemeProvider } from '@mui/material';
import Layout from './scenes/layout';
import Dashboard from './scenes/dashboard';
import Products from './scenes/products';
import Customers from './scenes/customers';
import Transactions from './scenes/transactions';
import Geography from './scenes/geography';
import Overview from './scenes/overview';
import Monthly from './scenes/monthly';
import Breakdown from './scenes/breakdown';
import Daily from './scenes/daily';
import Admin from './scenes/admin';
import Performance from './scenes/performance';



const App = () => {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { currentUser } = useSelector((state) => state.user);
  const currentUserRole = currentUser?.role; // Dynamically get the user role from the Redux store

  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />

        {currentUserRole === 'admin' && (
        <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />


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
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
