import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Listings",
    "Landlords",
    "Users",
    "Rents",
    "Geography",
    "Sales",
    "Offers",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `api/user/${id}`,
      providesTags: ["User"],
    }),
    getListings: build.query({
      query: () => "api/listing",
      providesTags: ["Listings"],
    }),
    getLandlords: build.query({
      query: () => "api/user",
      providesTags: ["Landlords"],
    }),
    getClients: build.query({
      query: () => "api/user",
      providesTags: ["Users"],
    }), 
    
    getRents: build.query({
      query: () => "api/listing",
      providesTags: ["Rents"],
    }), 
    getOffers: build.query({
      query: () => "api/listing",
      providesTags: ["Offers"],
    }), 
    
    getGeography: build.query({
      query: () => "api/listing/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "api/listings",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "api/user",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `api/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "api/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetListingsQuery,
  useGetClientsQuery,
  useGetLandlordsQuery,
  useGetOffersQuery,
  useGetRentsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
