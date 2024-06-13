import  { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RoleBasedRedirect from './RoleBasedRedirect';
import PrivateRoute from './components/PrivateRoute';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import User from './Pages/User';
import Admin from './Pages/Admin';
import Layout from './Layout';
import { profileLoader } from './lib/loaders';
import { getCurrentUser, getToken } from './redux/user/useSelectors';
import ProfileManagement from './components/ProfileManagement';
import Profile from './Pages/Profile';

const App = () => {
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const currentUserRole = currentUser?.role;

  const [routerKey, setRouterKey] = useState(Date.now());

  const getRoutes = () => [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: 'sign-in', element: token ? <Navigate to="/" replace /> : <SignIn /> },
        { path: 'sign-up', element: <SignUp /> },
        { path: 'about', element: <About /> },
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
          element: currentUserRole === 'user' ? <User /> : <Navigate to="/" replace />
        },
        {
          path: 'landlord',
          element: <PrivateRoute allowedRoles={['landlord']} />,
          children: [
            { path: 'dashboard', element: <Profile />, loader: profileLoader },
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
