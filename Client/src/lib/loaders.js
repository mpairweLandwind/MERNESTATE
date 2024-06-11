import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";
import axios from "axios";
import { fetchData } from './utils';
import { getAuthToken } from "./getAuthToken";


export const listing = async ({ params }) => {
  const res = await apiRequest("/listings/" + params.id);
  return res.data;
};

export const profileLoader = async () => {
  const token = getAuthToken(); // get the token

  const chatDataPromise = fetchData(`/api/chats/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return defer({
    chatData: chatDataPromise
  });
};


// // chatLoader.js

// export const profileLoader = async () => {
//   const token = localStorage.getItem('token'); // Or retrieve the token from your state management

//   const chatDataPromise = fetchData(`/api/chats/`, {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });

//   return defer({
//     chatData: chatDataPromise
//   });
// };


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

