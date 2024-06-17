import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//import { useTranslation } from 'react-i18next'; // make sure to import useTranslation
import Layout from './Layout';
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

const App = () => {
 // const { i18n } = useTranslation();
  const [routerKey, setRouterKey] = useState(Date.now());
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const currentUserRole = currentUser?.role;

  // useEffect(() => {
  //   const handleLanguageChange = () => {
  //     // Update the key to force re-render the RouterProvider
  //     setRouterKey(Date.now());
  //   };

  //   i18n.on('languageChanged', handleLanguageChange);

  //   return () => {
  //     // Cleanup the listener
  //     i18n.off('languageChanged', handleLanguageChange);
  //   };
  // }, [i18n]);

  const getRoutes = () => [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: 'sign-in', element: token ? <Navigate to="/" replace /> : <SignIn /> },
        { path: 'sign-up', element: <SignUp /> },
        { past: 'about', element: <About /> },
        { path: 'search', element: <Search /> },
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
          path: 'user-dashboard',
          element: currentUserRole === 'user' ? <User /> : <Navigate to="/" replace />,
          loader: profileLoader
        },
        {
          path: 'landlord',
          element: <PrivateRoute allowedRoles={['landlord']} />,
          children: [
            { path: 'dashboard', element: <Profile />, loader: profileLoader  },
            { path: 'profile', element: <ProfileManagement /> },
            { path: 'create-listing', element: <CreateListing /> },
            { path: 'update-listing/:listingId', element: <UpdateListing /> }
          ]
        }
      ]
    }
  ];

  const router = createBrowserRouter(getRoutes());
  useEffect(() => {
    setRouterKey(Date.now()); // Update the key to force re-render
  }, [currentUserRole]);


  return (
    <RouterProvider key={routerKey} router={router}>
      <RoleBasedRedirect />
    </RouterProvider>
  );
};

export default App;