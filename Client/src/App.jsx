import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Profile from './Pages/Profile';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import User from './Pages/User';
import Admin from './Pages/Admin';
import Logout from './components/Logout';
import ProfileManagement from './components/ProfileManagement';
import Layout from './Layout';
import { profileLoader } from './lib/loaders';
import { getCurrentUser,getToken } from './redux/user/useSelectors';
const App = () => {
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const currentUserRole = currentUser?.role;

  // Define routes based on state
  const getRoutes = () => [
    {
      path: '/',
      element: <Layout />, // Layout includes Header and Outlet
      children: [
        { path: '/', element: <Home /> },
        { path: 'sign-in', element: token ? <Navigate to="/" replace /> : <SignIn /> },
        { path: 'sign-up', element: <SignUp /> },
        { path: 'about', element: <About /> },
        { path: 'search', element: <Search /> },
        { path: 'logout', element: <Logout /> },
        {
          path: 'admin-dashboard/*',
          element: currentUserRole === 'admin' ? <Admin /> : <Navigate to="/" replace />
        },
        {
          path: 'listing/:listingId',
          element: <PrivateRoute component={Listing} />
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

  return <RouterProvider router={router} />;
};

export default App;