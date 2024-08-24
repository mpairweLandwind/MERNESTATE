import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useMutation } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { checkFavourites, updateFavourites } from "../../utils/common";
import { toFav } from "../../utils/api";
import PropTypes from 'prop-types';

const Heart = ({ id }) => {
  const [heartColor, setHeartColor] = useState("white");
  const { validateLogin } = useAuthCheck();
  const { user, getAccessTokenSilently } = useAuth0();

  const {
    userDetails: { favourites, token },
    setUserDetails,
  } = useContext(UserDetailContext);

  useEffect(() => {
    setHeartColor(() => checkFavourites(id, favourites));
  }, [favourites, id]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const accessToken = token || await getAccessTokenSilently({
        authorizationParams: {
          audience: "http://localhost:3000",
          scope: "openid profile email",
        },
      });

      // If token is newly fetched, update it in context
      if (!token) {
        setUserDetails((prev) => ({ ...prev, token: accessToken }));
      }

      return toFav(id, user?.email, accessToken);
    },
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourites: updateFavourites(id, prev.favourites),
      }));
    },
  });

  const handleLike = () => {
    if (validateLogin()) {
      mutate();
      setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
    />
  );
};

Heart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Heart;
