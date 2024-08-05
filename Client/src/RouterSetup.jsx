import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import App from './App';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Search from './Pages/Search';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Profile from './Pages/Profile';
import User from './Pages/User';
import Admin from './Pages/Admin';
import Logout from './components/Logout';
import { listingLoader } from './lib/loaders';
import PrivateRoute from './components/PrivateRoute';

const RouterSetup = () => {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserRole = currentUser?.role;

  const routes = [
    { path: '/', element: <Home /> },
    { path: 'sign-in', element: <SignIn /> },
    { path: 'sign-up', element: <SignUp /> },
    { path: 'about', element: <About /> },
    { path: 'search', element: <Search /> },
    { path: 'logout', element: <Logout /> },
    {
      path: 'listing/:listingId',
      element: <PrivateRoute component={Listing} />,
      loader: listingLoader,
    },
    {
      path: 'create-listing',
      element: <PrivateRoute allowedRoles={['landlord']} component={CreateListing} />,
    },
    {
      path: 'update-listing/:listingId',
      element: <PrivateRoute allowedRoles={['landlord']} component={UpdateListing} />,
    },
    currentUserRole === 'admin' && { path: 'admin-dashboard/*', element: <Admin /> },
    currentUserRole === 'user' && { path: 'user-dashboard', element: <User /> },
    {
      path: 'landlord',
      element: <PrivateRoute allowedRoles={['landlord']} component={Profile} />,
    },
  ].filter(Boolean);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: routes,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouterSetup;
