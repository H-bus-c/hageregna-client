/** @format */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerHomePage from "./components/container/CustomerHomePage";
import UserPage from "./components/container/UserPage";
import BusTypePage from "./components/container/BusTypePage";
import CityPage from "./components/container/CityPage";
import BusPage from "./components/container/BusPage";
import LogIn from "./components/LogIn";
import ProtectedRoute from "./ProtectedRoute";
import RoutePage from "./components/container/RoutePage";
import BusDepartureTime from "./components/container/BusDepartureTime";
import UserHomePage from "./UserHomePage";
import Booking from "./components/container/Booking";
import Passengers from "./components/container/Passengers";
import LoadingPage from "./components/LoadingPage";

const CustomerDataCheckList=React.lazy(()=> import("./components/container/CustomerDataCheckList"));



const Home = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHomePage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/report/booking_list"
          element={
            <ProtectedRoute requiredRole={[2, 3, 4]}>
              <Passengers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/passenger_list"
          element={
            <ProtectedRoute requiredRole={[2, 3]}>
              <Passengers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger_check_list"
          element={
            <ProtectedRoute requiredRole={[4, 5]}>
              <Suspense fallback={<LoadingPage/>}> <CustomerDataCheckList /></Suspense>
             
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole={[1, 2, 3]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus_departure_time"
          element={
            <ProtectedRoute requiredRole={[2, 3]}>
              <BusDepartureTime />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus"
          element={
            <ProtectedRoute requiredRole={[2, 3]}>
              <BusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus_type"
          element={
            <ProtectedRoute requiredRole={[1]}>
              <BusTypePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/city/:id"
          element={
            <ProtectedRoute requiredRole={[2, 3]}>
              <CityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/route"
          element={
            <ProtectedRoute requiredRole={[2, 3]}>
              <RoutePage />
            </ProtectedRoute>
          }
        />

        <Route path="/user_page" element={<UserHomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Home;

{
  /* <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole={[2, 3, 4, 5]}>
              <HomePage />
            </ProtectedRoute>
          }
        /> */
}
