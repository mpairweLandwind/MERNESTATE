import { createSelector } from 'reselect';

// Basic selector to get the user substate from the root state
const userState = state => state.user;

// Memoized selector to get the current user
export const getCurrentUser = createSelector(
    [userState],  // First argument is an array of input selectors
    (user) => user.currentUser   // Second argument is a function that returns the desired value
);

// Memoized selector to get the token
export const getToken = createSelector(
    [userState],  // Input selectors
    (user) => user.token  // Result function
);