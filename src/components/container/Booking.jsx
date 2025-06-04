import React, { useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { sendVerificationCode } from "../../services/API";
import Header from "../../Header";
import MyBooking from "../presentation/booking/MyBooking";
import { useFormik } from "formik";
import CustomerPage from "../../services/CustomerPage";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import QRCode from "qrcode";
import {
  useBusDepartureTimes,
  useBusTypes,
  useReserves,
  useReserveSeats,
  useUpdateReserveSeat,
  useRoutes,
  useDate,
} from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import AlertCondition from "../presentation/alert/AlertCondition";
import Alerts from "../presentation/alert/Alerts";

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
 const leavingNames = [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Ninth',
      'Tenth',
];
const customerPage = new CustomerPage();
const secretKey = 'Haile144@';
const Booking = () => {
   const [results, setResults] = useState(null);
   const [qrCodeUrl, setQrCodeUrl] = useState(null);
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
  // reduce performance
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const isUnderMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
   const navigate = useNavigate();

   const { data: serverDate = '', isLoading: dateIsLoading, isError: dateIsError } = useDate();
   const {
      data: busTypes = [],
      isLoading: busTypeIsLoading,
      isError: busTypeIsError,
   } = useBusTypes();

   const {
      data: reserves = [],
      isLoading: reserveIsLoading,
      isError: reserveIsError,
   } = useReserves();
   const {
      data: reserveSeats = [],
      isLoading: reserveSeatIsLoading,
      isError: reserveSeatIsError,
   } = useReserveSeats();
   const { data: routes = [], isLoading: routeIsLoading, isError: routeIsError } = useRoutes();
   const {
      data: departureTimes = [],
      isLoading: busDepartureTimeIsLoading,
      isError: busDepartureTimeIsError,
   } = useBusDepartureTimes();
   const { mutateAsync: updateReserveSeat } = useUpdateReserveSeat();
   const loginUser = useMemo(() => {
      const login = localStorage?.getItem('token');
      if (login) return jwtDecode(login);
      return null;
   }, []);

   // reduce performance
   const generateQRCode = text => {
      QRCode.toDataURL(text)
         .then(url => {
            setQrCodeUrl(url); // Set the QR code image URL
         })
         .catch(err => console.error('Error generating QR code:', err));
   };
   // reduce performance
   const formik = useFormik({
      initialValues: {
         ticketNumber: '',
         phoneNumber: '',
      },
      onSubmit: value => {
         const customer = reserveSeats.find(
            r =>
               '0' + r.customerPhone === value.phoneNumber && r.ticketNumber === value.ticketNumber
         );
         if (!customer) return setResults(null);
         const reserve = reserves.find(r => r.Id === customer.reserveId);
         const busDeparture = departureTimes.find(d => d.Id === reserve.busDepartureTimeId);
         const route = routes.find(r => r.Id === busDeparture.routeId);
         const busType = busTypes.find(b => b.Id === busDeparture.busTypeId);
         generateQRCode(`${customer.Id}`);
         const dates = new Date(serverDate);
         const date = new Date(`${dates.getFullYear()}-${dates.getMonth() + 1}-${dates.getDate()}`);
         const custInfo = {
            Id: customer.Id,
            reserveId: customer.reserveId,
            routeId: route.Id,
            busTypeId: busType.Id,
            ticketNumber: value.ticketNumber,
            customerName: customer.customerName,
            customerPhone: customer.customerPhone,
            seatNumber: customer.seatNumber,
            arrivalTime: customerPage
               .changeTime({
                  time: customerPage.addTimes({
                     time1: route.duration,
                     time2: customerPage.timeFormat({
                        time: reserve.reservedBy.departureTime,
                     }),
                  }),
               })
               .split('-'),
            travelDateEC: `${customerPage.toEthiopianCalendar({
               date: new Date(reserve.scheduleDate),
            })} ዓ.ም`,
            travelDateGC: new Date(reserve.scheduleDate),
            price: busDeparture.basePrice,
            departurePlace: route.origin,
            arrivalPlace: route.destination,
            bus: busType.name,
            leaving: `${leavingNames[Number(reserve.reservedBy?.bus) - 1]}`,
            departureTime: customerPage
               .changeTime({
                  time: reserve.reservedBy.departureTime,
               })
               .split('-'),

            isCancel:
               date.getTime() < new Date(reserve.scheduleDate) &&
               reserve.statusId === 1 &&
               customer.statusId === 1,
            date: [
               `${customerPage.toEthiopianCalendar({
                  date: new Date(reserve.createdAt),
               })} ዓ.ም`,
               `${new Date(customer.createdAt).toDateString()} A.D`,
            ],
         };
         setResults(custInfo);
      },
   });

   const handleCancelBooking = async value => {
      setIsLoading(true);
      // Add alert in this function
      try {
         const updateData = { Id: value, statusId: 2 };
         await updateReserveSeat(updateData);
         setResults(null);
         formik.resetForm();
         setOpen(true);
      } catch (error) {
         setIsError(true);
      }
      setIsLoading(false);
   };
   const handleEditBooking = async value => {
      await sendVerificationCode({ phone: value });
   };
   const handleSendData = () => {
      const jsonString = JSON.stringify(results); // Convert object to string
      const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
      window.localStorage.setItem('sharedData', encrypted);
      navigate('/'); // Redirect to A page
   };

   if (
      busDepartureTimeIsLoading ||
      busTypeIsLoading ||
      reserveIsLoading ||
      reserveSeatIsLoading ||
      routeIsLoading ||
      dateIsLoading ||
      isLoading
   )
      return <LoadingPage />;
   if (
      busDepartureTimeIsError ||
      busTypeIsError ||
      reserveIsError ||
      reserveSeatIsError ||
      routeIsError ||
      dateIsError ||
      isError
   )
      return <ErrorPage />;

   return (
      <div
         style={{
            overflowX: 'hidden',
            backgroundImage: 'url(/images/bus5.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
         }}
      >
         <Header />
         <ThemeProvider theme={theme}>
            <Alerts open={open} setOpen={setOpen} message={''} type={'success'} />
            <Box overflow="auto" alignItems="center" textAlign="center">
               <MyBooking
                  formik={formik}
                  results={results}
                  handleCancelBooking={handleCancelBooking}
                  handleEditBooking={handleEditBooking}
                  handleSendData={handleSendData}
                  isUnderMobile={isUnderMobile}
                  loginUser={loginUser}
                  qrCodeUrl={qrCodeUrl}
               />
            </Box>
         </ThemeProvider>
      </div>
   );
};

export default Booking;
