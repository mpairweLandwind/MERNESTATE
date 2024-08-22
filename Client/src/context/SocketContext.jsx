import { useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser); // Adjust path according to your Redux store setup
  const [socket, setSocket] = useState(null);




  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, []);

  useEffect(() => {
  currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketContext;
