import React, { useEffect, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  addBusDepartureTime,
  fetchCity,
  fetchBusDepartureTime,
  fetchZone,
  fetchRegion,
  fetchBusType,
  fetchRoute,
} from "../../services/API";
import BusDepartureTimeTable from "../presentation/busDepartureTimePage/BusDepartureTimeTable";
import BusDepartureTimeCreate from "../presentation/busDepartureTimePage/BusDepartureTimeCreate";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import Alerts from "../presentation/alert/Alerts";
import { jwtDecode } from "jwt-decode";
import {
  useAddBusDepartureTime,
  useBusDepartureTimes,
  useBusTypes,
  useCitys,
  useRegions,
  useRoutes,
  useUpdateBusDepartureTime,
  useUsers,
  useZones,
} from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Validation
const validationSchema = Yup.object().shape({
  routeId: Yup.object().required("Route is required"),
  basePrice: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(100, "Minimum basePrice is 100 Birr")
    .max(100000, "Maximum basePrice is 100000 Birr")
    .test(
      "decimal-places",
      "Maximum 2 decimal places",
      (value) => (String(value).split(".")[1] || []).length <= 2
    )
    .typeError("Must be a valid number"),
});

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const BusDepartureTime = () => {
   // reduce performance
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
   const [openCreatePage, setOpenCreatePage] = useState(false);
   const [alertOpen, setAlertOpen] = useState(false);
   const [alertMessage, setAlertMessage] = useState('');
   const [alertType, setAlertType] = useState('');
   const [departureTimes, setDepartureTimes] = useState(['']);
   const [busNumbers, setBusNumbers] = useState(['']);
   const [Id, setId] = useState('');
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const isUnderMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

   const {
      data: busDepartureTimeData = [],
      isLoading: busDepartureTimeIsLoading,
      isError: busDepartureTimeIsError,
   } = useBusDepartureTimes();
   const { data: cities = [], isLoading: cityIsLoading, isError: cityIsError } = useCitys();
   const { data: zones = [], isLoading: zoneIsLoading, isError: zoneIsError } = useZones();
   const { data: regions = [], isLoading: regionIsLoading, isError: regionIsError } = useRegions();
   const {
      data: busTypeData = [],
      isLoading: busTypeIsLoading,
      isError: busTypeIsError,
   } = useBusTypes();
   const { data: routeData = [], isLoading: routeIsLoading, isError: routeIsError } = useRoutes();
   const { mutateAsync: addBusDepartureTime } = useAddBusDepartureTime();
   const { mutateAsync: updateBusDepartureTime } = useUpdateBusDepartureTime();

   const loginUser = useMemo(() => {
      const login = localStorage.getItem('token');
      if (login) return jwtDecode(login);
      return null;
   }, []);
   const busType = useMemo(() => {
      return busTypeData.find(b => b?.userId === loginUser?.admin) ?? {};
   }, [busTypeData, loginUser]);
   // reduce performance
   const routes = useMemo(() => {
      return routeData?.map(route => {
         const city1 = cities?.find(c => c?.Id === route?.city1);
         const city2 = cities?.find(c => c?.Id === route?.city2);
         const zone1 = zones?.find(z => z?.Id === city1?.zoneId);
         const zone2 = zones?.find(z => z?.Id === city2?.zoneId);
         const region1 = regions?.find(r => r?.Id === zone1?.regionId);
         const region2 = regions?.find(r => r?.Id === zone2?.regionId);
         route.zone1 = zone1?.name;
         route.zone2 = zone2?.name;
         route.region1 = region1?.name;
         route.region2 = region2?.name;
         return route;
      });
   }, [cities, zones, regions, routeData]);

   const busDepartureTimes = useMemo(() => {
      return busDepartureTimeData?.filter(
         bdt => bdt?.busTypeId === busType?.Id && bdt?.statusId === 1
      );
   }, [busDepartureTimeData, busType]);
   // reduce performance
   const formik = useFormik({
      initialValues: {
         departureTime: '',
         busTypeId: '',
         routeId: '',
         statusId: '',
         basePrice: '',
      },
      validationSchema,
      onSubmit: async values => {
         values.departureTime = { data: [] };
         const checkRoute = busDepartureTimes.find(b => b.routeId === values.routeId);
         if (checkRoute) {
            setAlertMessage(
              "Can't duplicate the route!"
            );
            setAlertOpen(true);
            setAlertType("error");
            return;
         }
         for (let i = 0; i < departureTimes.length; i++) {
            values.departureTime.data.push(departureTimes[i]);
            values.departureTime.data.push(busNumbers[i]);
            if (
               departureTimes[i] === '' ||
               busNumbers === '' ||
               busNumbers < 1 ||
               busNumbers > 10
            ) {
               setAlertMessage('There is error in derparture time or bus number input!');
               setAlertOpen(true);
               setAlertType('error');
               return;
            }
         }
         setIsLoading(true);
         setIsError(false);
         try {
            if (Id === '') {
               values.statusId = 1;
               const checkDeparture = busDepartureTimes.find(
                  d =>
                     d.busTypeId === values.busTypeId &&
                     d.routeId === values.routeId &&
                     d.statusId === values.statusId
               );
               if (checkDeparture) {
                  setAlertMessage('Duplicate Route not allowed!');
                  setAlertOpen(true);
                  setAlertType('error');
                  setIsLoading(false);
                  return;
               }
               values.busTypeId = busType.Id;
               values.routeId = values.routeId.Id;

               await addBusDepartureTime(values);
               setAlertMessage('Departure Time Data Added Successfully!');
               setAlertOpen(true);
               setAlertType('success');
               handleOpenCreatePage(false);
            } else {
               const checkDeparture = busDepartureTimes.find(
                  d =>
                     d.Id !== Id &&
                     d.busTypeId === values.busTypeId &&
                     d.routeId === values.routeId &&
                     d.statusId === values.statusId
               );
               if (checkDeparture) {
                  setAlertMessage('Duplicate Route not allowed!');
                  setAlertOpen(true);
                  setAlertType('error');
                  setIsLoading(false);
                  return;
               }
               values.Id = Id;
               values.busTypeId = busType.Id;
               values.routeId = values.routeId.Id;

               await updateBusDepartureTime(values);
               setAlertMessage('Departure Time Data Update Successfully!');
               setAlertOpen(true);
               setAlertType('success');
               handleOpenCreatePage(false);
            }
         } catch (error) {
            setIsError(true);
         }
         setIsLoading(false);
      },
   });

   const handleOpenCreatePage = () => {
      formik.resetForm();
      if (!!!busType) {
         setAlertMessage('You need to permission to perform this action. please contact owner!');
         setAlertOpen(true);
         setAlertType('warning');
         return;
      }

      setBusNumbers(['']);
      setDepartureTimes(['']);
      setId('');
      setOpenCreatePage(!openCreatePage);
   };
   // reduce performance
   const handleOpenUpdatePage = data => {
      const bus = busDepartureTimes.find(u => u.Id === data.Id);
      setId(bus.Id);
      formik.setValues({
         departureTime: bus?.departureTime,
         busTypeId: bus?.busTypeId,
         routeId: routes.find(r => r.Id === bus.routeId),
         statusId: bus?.statusId,
         basePrice: bus?.basePrice,
      });
      let departureTime = [],
         busNumber = [];
      bus.departureTime.data.map((d, i) => {
         console.log(d);
         if (i % 2 === 0) departureTime.push(d);
         else busNumber.push(d);
         return d;
      });
      setBusNumbers(busNumber);
      setDepartureTimes(departureTime);
      setOpenCreatePage(true);
   };
   const handleDelete = async(id) => {
       setIsLoading(true);
          try {
             let deleteBus = busDepartureTimes.find((bus) => bus.Id === id);
          deleteBus.statusId = 2;
         await updateBusDepartureTime(deleteBus);
          setAlertMessage("Bus Departure Time Data Delete Successfully!");
          setAlertOpen(true);
          setAlertType("success");
          } catch (error) {
            setIsError(true);
          }
          setIsLoading(false);
   };
   // reduce performance
   const handleAddDeparture = () => {
      setDepartureTimes([...departureTimes, '']);
      setBusNumbers([...busNumbers, '']);
   };
   // reduce performance
   const handleSubDeparture = id => {
      setDepartureTimes(departureTimes.filter((d, i) => i !== id));
      setBusNumbers(busNumbers.filter((b, i) => i !== id));
   };
   if (
      isLoading ||
      busDepartureTimeIsLoading ||
      cityIsLoading ||
      zoneIsLoading ||
      regionIsLoading ||
      busTypeIsLoading ||
      routeIsLoading
   )
      return <LoadingPage />;
   if (
      isError ||
      busDepartureTimeIsError ||
      cityIsError ||
      zoneIsError ||
      regionIsError ||
      busTypeIsError ||
      routeIsError
   )
      return <div>Error</div>;
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
            <Box maxWidth="1200px">
               <Alerts
                  open={alertOpen}
                  setOpen={setAlertOpen}
                  message={alertMessage}
                  type={alertType}
               />
               <ThemeProvider theme={theme}>
                  {!openCreatePage && (
                     <BusDepartureTimeTable
                        busDepartureTimes={busDepartureTimes}
                        allRoutes={routes}
                        handleCreate={handleOpenCreatePage}
                        handleUpdate={handleOpenUpdatePage}
                        handleDelete={handleDelete}
                     />
                  )}
                  {openCreatePage && (
                     <BusDepartureTimeCreate
                        routes={routes.filter(data => data.statusId === 1)}
                        handleCreate={handleOpenCreatePage}
                        formik={formik}
                        isLoading={isLoading}
                        Id={Id}
                        departureTimes={departureTimes}
                        busNumbers={busNumbers}
                        handleAddDeparture={handleAddDeparture}
                        handleSubDeparture={handleSubDeparture}
                        setDepartureTimes={setDepartureTimes}
                        setBusNumbers={setBusNumbers}
                     />
                  )}
               </ThemeProvider>
            </Box>
         </center>
      </div>
   );
};

export default BusDepartureTime;
