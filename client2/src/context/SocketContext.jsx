import { useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser); // Adjust path according to your Redux store setup
  const [socket, setSocket] = useState(null);

  
  // Effect for setting up and tearing down the socket connection
  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:4000", {
        query: { userId: currentUser.id },
      });
      setSocket(newSocket);
      console.log("Connected to socket server as user:", currentUser.id);

      return () => {
        newSocket.close();
        console.log("Socket disconnected");
      };
    }
  }, [currentUser]); 
      
  // Separate effect for handling socket events if needed
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket event: connected");
      });

      // Optionally add more event listeners here

      return () => {
        socket.off("connect");
        // Disconnect other event listeners here if added
      };
    }
  }, [socket]); // Dependency only on socket for setting event listeners

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
