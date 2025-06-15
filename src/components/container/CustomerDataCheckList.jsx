import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  createTheme,
  Snackbar,
  ThemeProvider,
  Typography,
  useMediaQuery,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import { jwtDecode } from "jwt-decode";

import CheckList from "../presentation/customerDataCheckList/CheckList";
import CustomerPage from "../../services/CustomerPage";
import {
  useBusDepartureTimes,
  useBuss,
  useBusTypes,
  useCitys,
  useDate,
  useReserves,
  useReserveSeats,
  useRoutes,
  useUpdateReserve,
  useUpdateReserveSeat,
} from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import Alerts from "../presentation/alert/Alerts";

// const validationSchema = Yup.object().shape({
//   routeId: Yup.object().required("Route is Required!"),
//   departureTimes: Yup.object().required("Departure Time is Required!"),
// });

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const CustomerDataCheckList = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
   const [departureTimes, setDepartureTimes] = useState([]);
   const [busGoesOut, setBusGoesOut] = useState([]);
   const [customerData, setCustomerData] = useState([]);
   const [openAlert, setOpenAlert] = useState(false);
   const [reserveDatas, setReserveDatas] = useState([]);
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const isUnderMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

   const customerPage = new CustomerPage();

   const { data: dates = '', isLoading: dataIsLoading, isError: dataIsError } = useDate();
   const { data: busData = [], isLoading: busIsLoading, isError: busIsError } = useBuss();

   const {
      data: busTypes = [],
      isLoading: busTypeIsLoading,
      isError: busTypeIsError,
   } = useBusTypes();
   const { data: citys = [], isLoading: cityIsLoading, isError: cityIsError } = useCitys();
   const {
      data: reserveData = [],
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
      data: busDepartureTimeDatas = [],
      isLoading: busDepartureTimeIsLoading,
      isError: busDepartureTimeIsError,
   } = useBusDepartureTimes();

   const loginUser = useMemo(() => {
      const user = localStorage?.getItem('token');
      if (user) return jwtDecode(user);
      return null;
   }, []);
   const busType = useMemo(() => {
      const bustype = busTypes.find(b => b.userId === loginUser?.admin);
      return bustype;
   }, [busTypes, loginUser]);
   const busDepartureTimes = useMemo(() => {
      const bus = busDepartureTimeDatas.filter(b => b.busTypeId === busType?.Id);
      return [...bus];
   }, [busDepartureTimeDatas, busType]);
   const buses = useMemo(() => {
      const bus = busData.find(b => b?.busTypeId === busType?.Id && b?.userId === loginUser?.Id);
      return bus;
   }, [busData, busType, loginUser]);
   const reserves = useMemo(() => {
      const serverDate = new Date(dates)
      const reserve = reserveData.filter(r => {
         const reserveDate = new Date(r.scheduleDate);
         return (
            r.busTypeId === busType?.Id &&
            new Date(
               `${reserveDate.getFullYear()}-${reserveDate.getMonth() + 1}-${reserveDate.getDate()}`
            ).getTime() ===
               new Date(
                  `${serverDate.getFullYear()}-${serverDate.getMonth() + 1}-${serverDate.getDate()}`
               ).getTime() &&
            r.statusId === 1
         );
      });
      return [...reserve];
   }, [reserveData, busType, dates]);

   const { mutateAsync: updateReserve } = useUpdateReserve();
   const { mutateAsync: updateReserveSeat } = useUpdateReserveSeat();

   const formik = useFormik({
      initialValues: {
         routeId: '',
         departureTime: '',
         bus: '',
      },
      // validationSchema,
      onSubmit: async values => {
         try {
            setIsLoading(true);

            const updateReserveData = reserveDatas.map(async reserve => {
               await updateReserve({ Id: reserve.Id, busId: buses.Id });
            });
            const updateData = customerData.map(async reserveSeat => {
               await updateReserveSeat({
                  Id: reserveSeat.Id,
                  statusId: reserveSeat.isAvailable ? 7 : 6,
               });
            });
            await Promise.all([updateReserveData, updateData]);
            setOpenAlert(true);
         } catch (error) {
            console.log(error);
            setIsError(true);
         }
         setIsLoading(false);
      },
   });
   const handleDepartureTime = value => {
      if (!value) {
         formik.resetForm();
         setBusGoesOut([]);
         return setDepartureTimes([]);
      }

      const departureTime = busDepartureTimes.filter(d => d.routeId === value.Id);
      const departure = customerPage.departure({ bus: departureTime });
      setDepartureTimes(departure);
   };
   // reduce performance
   const handleBus = value => {
      if (!value && value !== 0) {
         formik.setFieldValue('departureTime', '');
         formik.setFieldValue('bus', '');
         return setBusGoesOut([]);
      }
      const departureTime = busDepartureTimes.find(d => d.routeId === formik.values.routeId?.Id)
         ?.departureTime?.data;
      let leaveBus = [
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
      const lap = Number(departureTime[value * 2 + 1]);
      const newArray = new Array(lap).fill(1);
      setBusGoesOut(
         newArray.map((n, i) => {
            return leaveBus[i];
         })
      );
   };
   // reduce performance
   const handleCustomer = () => {
      if (formik.values.bus === '' || formik.values.departureTime === '' || !formik.values.routeId)
         return setCustomerData([]);
      const departureTime = busDepartureTimes.find(d => d.routeId === formik.values.routeId.Id);
      const newReserve = reserves.filter(reserve => {
         return (
            reserve.busDepartureTimeId === departureTime.Id &&
            reserve?.reservedBy?.bus === formik.values.bus + 1 &&
            customerPage.timeFormat({ time: reserve.reservedBy.departureTime }) ===
               customerPage.timeFormat({
                  time: departureTimes[Number(formik.values.departureTime)],
               })
         );
      });
      setReserveDatas([...newReserve]);
      const newReserveSeats = newReserve
         .map(reserve => {
            const newReserveSeat = reserveSeats.filter(
               reserveSeat => reserveSeat.reserveId === reserve.Id // && reserveSeat.statusId === 1
            );
            return newReserveSeat;
         })
         .flat();
      const passengers = new Array(53).fill(0);
      newReserveSeats?.map(reserveSeat => {
         passengers[Number(reserveSeat.seatNumber)] = {
            Id: reserveSeat.Id,
            name: reserveSeat.customerName,
            phone: reserveSeat.customerPhone,
            ticketNumber: reserveSeat.ticketNumber,
            seatNumber: reserveSeat.seatNumber,
            isAvailable: reserveSeat.statusId === 7,
         };
         return reserveData;
      });
      setCustomerData(passengers.filter(p => !!p));
      return passengers.filter(p => !!p);
   };

   if (
      isLoading ||
      cityIsLoading ||
      dataIsLoading ||
      reserveIsLoading ||
      reserveSeatIsLoading ||
      routeIsLoading ||
      busDepartureTimeIsLoading ||
      busTypeIsLoading ||
      busIsLoading
   )
      return <LoadingPage />;
   if (
      isError ||
      cityIsError ||
      dataIsError ||
      reserveIsError ||
      reserveSeatIsError ||
      routeIsError ||
      busDepartureTimeIsError ||
      busTypeIsError ||
      busIsError
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

         <center>
            <ThemeProvider theme={theme}>
               <Alerts
                  open={openAlert}
                  setOpen={setOpenAlert}
                  message={'Data Submit Successfully!'}
                  type={'success'}
               />
               <CheckList
                  routes={routes}
                  departureTimes={departureTimes}
                  busGoesOut={busGoesOut}
                  customerData={customerData}
                  isMobile={isUnderMobile}
                  formik={formik}
                  handleDepartureTime={handleDepartureTime}
                  handleBus={handleBus}
                  handleCustomer={handleCustomer}
                  setCustomerData={setCustomerData}
               />
            </ThemeProvider>
         </center>
      </div>
   );
};

export default CustomerDataCheckList;
