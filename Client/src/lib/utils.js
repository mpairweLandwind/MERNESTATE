import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


// utils.js
export async function fetchData(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function handleLogout(navigate, dispatch, clearCurrentUser) {
  try {
    await fetchData(`api/auth/signout`, { method: 'POST' });
    dispatch(clearCurrentUser());
    navigate("/");
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
