import {createContext} from 'react'

const UserDetailContext = createContext()

export default UserDetailContext



// import { createContext, useState } from 'react';
// import PropTypes from 'prop-types';

// // Create the context
// const UserDetailContext = createContext();

// // Create a provider component
// export const UserDetailProvider = ({ children }) => {
//   const [userDetails, setUserDetails] = useState({});

//   return (
//     <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
//       {children}
//     </UserDetailContext.Provider>
//   );
// };

// // Add PropTypes validation
// UserDetailProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default UserDetailContext;