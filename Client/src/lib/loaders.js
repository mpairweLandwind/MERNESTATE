import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";
import axios from "axios";

export const listing = async ({ params }) => {
  const res = await apiRequest("/listings/" + params.id);
  return res.data;
};

// src/loaders/listingLoader.js
// In your route configuration file or above your component

 export const listingLoader = async ({ params }) => {
  try {
    const response = await axios.get(`/api/listing/get/${params.listingId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};


export const listPageLoader = async ({ request }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/listings?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
