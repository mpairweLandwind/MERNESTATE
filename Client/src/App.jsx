import { useState, useEffect, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Layout from './components/Layout/Layout';
import './App.css';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Search from './Pages/Search';
import Admin from './Pages/Admin';
import User from './Pages/User';
import Profile from './Pages/Profile';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRedirect from './RoleBasedRedirect';
import { getCurrentUser, getToken } from './redux/user/useSelectors';
import ProfileManagement from './components/ProfileManagement';
import { profileLoader } from './lib/loaders';
import Listing from './Pages/Listing';
import CreateMaintenance from './Pages/CreateMaintenance';
import Maintenance from './Pages/Maintenance';
import UpdateMaintenance from './Pages/UpdateMaintenance';
import UserDetailContext from './context/UserDetailContext';
import Property from "./Pages/Property/Property";
import Bookings from "./Pages/Bookings/Bookings";
import Favourites from "./Pages/Favourites/Favourites";
import Properties from "./Pages/Properties/Properties";
import { MantineProvider } from '@mantine/core';
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const queryClient = new QueryClient(); // Initialize QueryClient outside the component

const App = () => {
  //const [routerKey, setRouterKey] = useState(Date.now());
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const currentUserRole = currentUser?.role;

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null,
  }); // context state

//   const initialOptions = {
//     clientId: "AW2JLs8fwZMo6SsQCc78C9LFayq6uEog3ag_6S4G6Xa36-AcrGx2zNS3h2baQSekqh3Gj3eGKmMDbYHg",
//     currency: "USD",
//     intent: "capture",
// };

  const getRoutes = (currentUserRole) => [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: 'sign-in', element: token ? <Navigate to="/" replace /> : <SignIn /> }, // Use token directly
        { path: 'sign-up', element: <SignUp /> },
        { path: 'about', element: <About /> },
        { path: 'search', element: <Search /> },
        {
          path: 'properties',
          children: [
            { path: '', element: <Properties /> },
            { path: ':propertyId', element: <Property /> }
          ]
        },
        { path: 'bookings', element: <Bookings /> },
        { path: 'favourites', element: <Favourites /> },
        {
          path: 'admin-dashboard/*',
          element: currentUserRole === 'admin' ? <Admin /> : <Navigate to="/" replace />
        },
        {
          path: 'listing/:listingId',
          element: <PrivateRoute allowedRoles={['admin', 'user', 'landlord']} />,
          children: [
            { path: '', element: <Listing /> }
          ]
        },
        {
          path: 'maintenance/:maintenanceId',
          element: <PrivateRoute allowedRoles={['admin', 'landlord']} />,
          children: [
            { path: '', element: <Maintenance /> }
          ]
        },
        {
          path: 'user-dashboard',
          element: currentUserRole === 'user' ? <User /> : <Navigate to="/" replace />,
          loader: profileLoader
        },
        {
          path: 'landlord',
          element: <PrivateRoute allowedRoles={['landlord']} />,
          children: [
            { path: 'dashboard', element: <Profile />, loader: profileLoader },
            { path: 'profile', element: <ProfileManagement /> },
            { path: 'update-maintenance/:maintenanceId', element: <UpdateMaintenance /> },
            { path: 'create-maintenance', element: <CreateMaintenance /> },
            { path: 'create-listing', element: <CreateListing /> },
            { path: 'update-listing/:listingId', element: <UpdateListing /> }
          ]
        }
      ]
    }
  ];  
  
  useEffect(() => {
    //setRouterKey(Date.now()); // Update the key to force re-render when the user role changes
  }, [currentUserRole]);

  const router = createBrowserRouter(getRoutes(currentUserRole));

  return (
    // <PayPalScriptProvider options={initialOptions}>
    <MantineProvider withGlobalStyles withNormalizeCSS> {/* Wrap your app with MantineProvider */}
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider  router={router}>
              <RoleBasedRedirect />             
            </RouterProvider>
          </Suspense>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </MantineProvider>
    // </PayPalScriptProvider>
  );
};

export default App;
