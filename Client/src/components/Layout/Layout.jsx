import { useContext, useEffect, useState } from "react"; // Added useState
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
  useFavourites();
  useBookings();

  const [isLoading, setIsLoading] = useState(true); // Now useState is defined
  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      try {
        const res = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: "http://localhost:3000", // Adjust if needed
            scope: "openid profile email",
          },
        });
        console.log("Access Token:", res);
        localStorage.setItem("access_token", res);
        setUserDetails((prev) => ({ ...prev, token: res }));
        mutate(res);
        setIsLoading(false); // Set loading to false when done
      } catch (error) {
        console.error("Error during token retrieval:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    if (isAuthenticated) {
      getTokenAndRegister();
    } else {
      setIsLoading(false); // Set loading to false if not authenticated
    }
  }, [getAccessTokenWithPopup, isAuthenticated, mutate, setUserDetails]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading while token is being set
  }

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
