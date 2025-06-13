import React, { useEffect, useMemo, useRef, useState } from "react";
import { createTheme, useMediaQuery, ThemeProvider, Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "../../Header";
import CustomerSearch from "../presentation/customerPage/CustomerSearch";
import CustomerHome from "../presentation/customerPage/CustomerHome";
import CustomerBooking from "../presentation/customerPage/CustomerBooking";
import CustomerPage from "../../services/CustomerPage";
import io from "socket.io-client";
import { passengersSchema } from "../../services/passengersSchema";
import { toGregorian } from "ethiopian-date";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import {
  useAddReserve,
  useAddReserveSeat,
  useBusDepartureTimes,
  useBusTypes,
  useCitys,
  useReserves,
  useReserveSeats,
  useRoutes,
  useUpdateReserve,
  useUpdateReserveSeat,
} from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 576, md: 769, lg: 1024, xl: 1200 } },
});
const validationSchema = yup.object({
  origin: yup.object().required("Origin is required"),
  destination: yup.object().required("Destination is required"),
  travelDate: yup.object().required("Travel date is required"),
  departureTime: yup.string().required("Departure time is required"),
});

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroSection = styled("div")(({ theme }) => ({
  minHeight: "60vh",
  background: `linear-gradient(
       45deg, 
       ${theme.palette.primary}, 
       ${theme.palette.secondary}, 
       ${theme.palette.success}
     )`,
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 6s ease infinite`,
  color: "white",
  padding: theme.spacing(8, 0),
}));
const socket = io("https://hageregna-server.onrender.com");
const CustomerHomePage = () => {
  const [seats, setSeats] = useState([]);
  const [destinationCitys, setDestinationCitys] = useState([]);
  const [departureTimes, setDepartureTimes] = useState([]);
  const [listAvailableBus, setListAvailableBus] = useState([]);
  const [activeBus, setActiveBus] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [passengers, setPassengers] = useState([{ name: "", phone: "" }]);
  const [errors, setErrors] = useState([]);
  const [openCustomerSearch, setOpenCustomerSearch] = useState(true);
  const [receivedData, setReceivedData] = useState(null);
  const [userType, setUserType] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isUnderMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const customerPage = new CustomerPage();
  const secretKey = "Haile144@";

  const {
    data: routes = [],
    isLoading: routeIsLoading,
    isError: routeIsError,
  } = useRoutes();
  const {
    data: buses=[],
    isLoading: busDepartureTimeIsLoading,
    isError: busDepartureTimeIsError,
  } = useBusDepartureTimes();
  const {
    data: cities = [],
    isLoading: cityIsLoading,
    isError: cityIsError,
  } = useCitys();
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

  const originCities = useMemo(() => {
    return cities;
  }, [ cities]);
  const { mutateAsync:addReserve } = useAddReserve();
  const { mutateAsync: addReserveSeat } = useAddReserveSeat();
  const { mutateAsync: updateReserve } = useUpdateReserve();
 const { mutateAsync: updateReserveSeat } = useUpdateReserveSeat();

  const calenderECtoGC = (dateEc) => {
    if (!dateEc) return;
    const dateGC = toGregorian(dateEc.year, dateEc.month, dateEc.day);
    return `${dateGC[0]}-${dateGC[1]}-${dateGC[2]}`;
  };
  const formik = useFormik({
    initialValues: {
      origin: "",
      destination: "",
      travelDate: "",
      departureTime: "",
      busDepartureTimeId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (openCustomerSearch) {
        const route = routes.find(
          (r) =>
            r.city1 === values.origin.Id && r.city2 === values.destination.Id
        );
        
        const sortBusOrder = customerPage.sortBusOrder({
          route,
          travelDate: calenderECtoGC(values.travelDate),
          departureTimes: departureTimes[Number(values.departureTime)],
          busDepartureTimes: buses,
          reserves,
          reserveSeats,
          busTypes: busTypes,
        });
        
        setListAvailableBus(sortBusOrder);
        setOpenCustomerSearch(false);
        if (userType !== 1&&sortBusOrder.length===1) {
          hnadleSelectBus(0, sortBusOrder);
          setActiveBus(0);
        }
        return;
      }
      setIsLoading(true);
      values.busDepartureTimeId = listAvailableBus[activeBus]?.Id;
      values.departureTime =
        departureTimes[values.departureTime].split("-")[0];
      try {
        const amount = parseFloat(
          passengers.length *
            buses.find((b) => b.Id === values.busDepartureTimeId)?.basePrice
        );
        //  await startPay({ amount: amount, title: "Bus Ticket Payment" });
        if (userType === 2) {
          let value = { Id: receivedData.Id, statusId: 2 };
          const reserve = reserves.find((r) => r.Id === receivedData.reserveId);
          let reserveValue = {
            Id: reserve.Id,
            totalPrice: Number(reserve.totalPrice) - Number(amount),
          };
         await updateReserveSeat(value);
        await  updateReserve(reserveValue);
          const localData = localStorage?.getItem("sharedData");
          if (localData) localStorage.removeItem("sharedData");
          setIsLoading(false);
          return;
        }

        const addReserves = await addReserve({
          totalPrice: amount,
          statusId: 1,
          busId: "",
          busDepartureTimeId: values.busDepartureTimeId,
          scheduleDate: new Date(calenderECtoGC(values.travelDate)),
          payment: {},
          reservedBy: {
            reservedBy:
              userType === 3
                ? "Ticket Saller"
                : userType === 4
                ? "Car Attendant"
                : "Customer",
            departureTime: values.departureTime,
            bus: listAvailableBus[activeBus]?.bus,
          },
        });

      const addReserveSeats=  passengers.map(async(p) => {
         await addReserveSeat({
            customerName: p.name.toUpperCase(),
            customerPhone: p.phone,
            seatNumber: p.seatNumber,
            ticketNumber: "",
            reserveId: addReserves.data.Id,
            statusId: 1,
          });
          confirmSeat(p.seatNumber);
      });
        await Promise.all([addReserves,addReserveSeats])
        setTimeout(() => {
          return handleBack();
        }, passengers.length * 2000);
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
      
    },
  });
  console.log(new Date(calenderECtoGC(formik.values.travelDate)));
  const formikRef = useRef();
  const listAvailableBusRef = useRef();
  const busesRef = useRef();
  // useEffect functions
  useEffect(() => {
    busesRef.current = buses;
  }, [buses]);
  useEffect(() => {
    formikRef.current = formik.values;
  }, [formik.values]);
  useEffect(() => {
    listAvailableBusRef.current = listAvailableBus;
  }, [listAvailableBus]);


  useEffect(() => {
    if (!routes.length || !cities.length) return;
    const loginToken = localStorage.getItem("token");
    const encrypted = localStorage.getItem("sharedData");

    if (loginToken) {
      try {
        const decodedUser = jwtDecode(loginToken);

        const busType = busTypes.find((b) => b.userId === decodedUser.admin);
        busesRef.current = buses.filter((b) => b.busTypeId === busType?.Id);
        if (decodedUser.roleId === 4) {
          formik.setFieldValue(
            "origin",
            cities.find((c) => c.Id === decodedUser.workPlace) || ""
          );
          setUserType(3);
          handleOriginCity(cities.find((c) => c.Id === decodedUser.workPlace));
        } else if (decodedUser.roleId === 5) {
          setUserType(4);
        }
      } catch (err) {
        console.error("Failed to decode login token:", err);
      }
    }

    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedText);

        const route = routes.find((r) => r.Id === parsedData.routeId);
        if (!route) return;

        const originCity = cities.find((c) => c.Id === route.city1);
        const destinationCity = cities.find((c) => c.Id === route.city2);

        formik.setFieldValue("origin", originCity || "");
        formik.setFieldValue("destination", destinationCity || "");

        setPassengers([
          { name: parsedData.customerName, phone: parsedData.customerPhone },
        ]);
        setReceivedData(parsedData);

        const departureTime = customerPage.departureTime({
          buses: buses.filter((b) => b.busTypeId === parsedData.busTypeId),
          routes,
          city1: originCity,
          city2: "", // <--- not sure if this is intended?
          city: destinationCity,
        });

        setDepartureTimes(departureTime);
        setActiveBus(0);
        setUserType(2);
      } catch (err) {
        console.error("Failed to decrypt sharedData:", err);
      }
    }
  }, [routes, cities, busTypes, buses]);
  useEffect(() => {
    // socket listeners
    socket.on("seat-held", ({ seat }) => {
      const currentFromik = formikRef.current;
      const currentListAvailableBus = listAvailableBusRef.current;
      updateSeat(seat, currentFromik, currentListAvailableBus, "held");
    });
    socket.on("seat-confirmed", ({ seat }) => {
      const currentFromik = formikRef.current;
      const currentListAvailableBus = listAvailableBusRef.current;
      updateSeat(seat, currentFromik, currentListAvailableBus, "booked");
    });
    socket.on("seat-released", ({ seat }) => {
      const currentFromik = formikRef.current;
      const currentListAvailableBus = listAvailableBusRef.current;
      updateSeat(seat, currentFromik, currentListAvailableBus, "available");
    });
    socket.on("seat-filtered", ({ availableSeats }) => {
      filterSeat(availableSeats);
    });
    return () => {
      socket.off("seat-held");
      socket.off("seat-confirmed");
      socket.off("seat-released");
      socket.off("seat-filtered");
    };
  }, []);
  const updateSeat = (seat, currentFromik, currentListAvailableBus, status) => {
    const checkStatus =
      status === "held"
        ? "selected"
        : status === "available"
        ? "available"
        : "booked";

    const bus = currentListAvailableBus.find(
      (l) => l.Id === seat.Id && Number(seat.bus) === Number(l.bus)
    );
    const travelDate =
      calenderECtoGC(currentFromik.travelDate) === seat.travelDate;
    const departureTime =
      Number(currentFromik.departureTime) === Number(seat.departureTime);
    if (bus && travelDate && departureTime) {
      setSeats((prev) =>
        prev.map((seatl) =>
          seatl.id === Number(seat.seatNumber) && checkStatus !== seatl.status
            ? { ...seatl, status }
            : seatl
        )
      );
    }
  };
  const holdSeat = (seatId) => {
    const returnSeat = seats.find((s) => s.id === seatId);
    const bus = listAvailableBus[activeBus];
    let seat = {
      Id: bus.Id,
      travelDate: calenderECtoGC(formik.values.travelDate),
      departureTime: Number(formik.values.departureTime),
      seatNumber: seatId,
      bus: bus.bus,
    };
    if (returnSeat.status === "available") {
      const checkStatus = seats.find((s) => s.status === "selected");
      if (checkStatus && userType === 2) return;
      setSeats((prev) =>
        prev.map((seatl) =>
          seatl.id === seatId ? { ...seatl, status: "selected" } : seatl
        )
      );
      socket.emit("hold-seat", {
        seat,
      });
    } else if (returnSeat.status === "selected") {
      setSeats((prev) =>
        prev.map((seatl) =>
          seatl.id === seatId ? { ...seatl, status: "available" } : seatl
        )
      );
      socket.emit("release-seat", {
        seat,
      });
    }
  };
  const filterSeat = (availableSeats) => {
    setSeats((prev) =>
      prev.map((seatl) =>
        !!availableSeats?.find((a) => a.seatNumber === seatl.id) &&
        seatl.status === "available"
          ? { ...seatl, status: "held" }
          : seatl
      )
    );
  };
  const confirmSeat = (seatId) => {
    const returnSeat = seats.find((s) => s.id === seatId);
    const bus = listAvailableBus[activeBus];
    let seat = {
      Id: bus.Id,
      travelDate: calenderECtoGC(formik.values.travelDate),
      departureTime: Number(formik.values.departureTime),
      seatNumber: seatId,
      bus: bus.bus,
    };
    if (returnSeat.status === "selected") {
      setSeats((prev) =>
        prev.map((seatl) =>
          seatl.id === seatId ? { ...seatl, status: "booked" } : seatl
        )
      );
      socket.emit("confirm-seat", {
        seat,
      });
    }
  };

  const handleBack = () => {
    seats.map((seat) => {
      if (seat.status === "selected") {
        holdSeat(seat.id);
      }
    });
    setSeats([]);
    setOpenCustomerSearch(true);
    setActiveStep(0);
    setIsLoading(false);
    setActiveBus("");
    //setListAvailableBus([]);
    if (userType === 3) {
      formik.values.busDepartureTimeId = "";
      formik.values.departureTime = "";
      formik.values.destination = "";
      formik.values.travelDate = "";
      return;
    }
    
    if (userType % 2 === 0) return;
    formik.resetForm();
    setActiveBus("");
    setListAvailableBus([]);
  };
  const swapLocations = () => {
    if (!formik.values.destination || !formik.values.origin) return;
    const temp = formik.values.origin;

    const city1 = customerPage.handleCity({
      city: formik.values.destination,
      cities,
      routes,
    });
    if (temp) {
      const departureTime = customerPage.departureTime({
        buses,
        routes,
        city1: "",
        city2: temp,
        city: formik.values.destination,
      });
      setDepartureTimes(departureTime);
    } else {
      setDepartureTimes([]);
    }
    setDestinationCitys([...city1]);
    formik.setFieldValue("origin", formik.values.destination);
    formik.setFieldValue("destination", temp);
  };

  const handleOriginCity = (city) => {
    if (!city) {
      setDepartureTimes([]);
      return;
    }
    const city1 = customerPage.handleCity({ city, cities, routes });
    if (formik.values.destination) {
      const departureTime = customerPage.departureTime({
        buses,
        routes,
        city1: "",
        city2: formik.values.destination,
        city,
      });
      setDepartureTimes(departureTime);
    } else {
      setDepartureTimes([]);
    }
    setDestinationCitys([...city1]);
  };
  const handleDestinationCity = (city) => {
    if (!city) {
      setDepartureTimes([]);
      return;
    }
    if (formik.values.origin) {
      const departureTime = customerPage.departureTime({
        buses,
        routes,
        city1: formik.values.origin,
        city2: "",
        city,
      });
      setDepartureTimes(departureTime);
    } else {
      setDepartureTimes([]);
    }
  };
  const handleChange = async (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
    try {
      await passengersSchema.validate(updated, {
        abortEarly: false,
      });
      setErrors([]);
    } catch (err) {
      const newErrors = [];
      passengers.forEach(() => newErrors.push({}));
      err.inner.forEach((e) => {
        const indexs = e.path.match(/\[(\d+)\]/)?.[1];
        const fields = e.path.split(".").pop();
        if (
          indexs !== undefined &&
          fields &&
          Number(indexs) === index &&
          fields === field
        ) {
          newErrors[indexs][fields] = e.message;
        }
      });
      setErrors(newErrors);
    }
  };
  const hnadleSelectBus = (index, listBus = listAvailableBus) => {
    seats.map((seat) => {
      if (seat.status === "selected") {
        holdSeat(seat.id);
      }
    });
    const customerSeat = customerPage.customerSeat({
      departureTimes: departureTimes[Number(formik.values.departureTime)],
      bus: listBus[index],
      reserves,
      reserveSeats,
      travelDate: calenderECtoGC(formik.values.travelDate),
    });
    
    socket.emit("filter-seat", {
      seat: {
        Id: listBus[index].Id,
        travelDate: calenderECtoGC(formik.values.travelDate),
        departureTime: Number(formik.values.departureTime),
        bus: listBus[index].bus,
      },
    });
    setSeats(customerSeat);
    setActiveBus(index);
  };

  if (
    isLoading ||
    routeIsLoading ||
    busTypeIsLoading ||
    busDepartureTimeIsLoading ||
    cityIsLoading ||
    reserveIsLoading ||
    reserveSeatIsLoading
  )
    return <LoadingPage />;
  if (
    isError ||
    routeIsError ||
    busTypeIsError ||
    busDepartureTimeIsError ||
    cityIsError ||
    reserveIsError ||
    reserveSeatIsError
  )
    return <ErrorPage />;
  return (
    <div
      style={{
        overflowX: "hidden",
        backgroundImage: "url(/images/bus5.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <ThemeProvider theme={theme}>
        <Header />
        <Box overflow="auto" alignItems="center" textAlign="center">
          {openCustomerSearch ? (
            <>
              <HeroSection>
                <CustomerSearch
                  formik={formik}
                  originCitys={originCities}
                  destinationCitys={destinationCitys}
                  handleOriginCity={handleOriginCity}
                  handleDestinationCity={handleDestinationCity}
                  buss={departureTimes}
                  cities={cities}
                  swapLocations={swapLocations}
                  isLoading={isLoading}
                  responsive={{ isMobile, isTablet, isUnderMobile }}
                  userType={userType}
                />
              </HeroSection>
              <CustomerHome />
            </>
          ) : (
            <CustomerBooking
              formik={formik}
              hnadleSelectBus={hnadleSelectBus}
              holdSeat={holdSeat}
              activeStep={activeStep}
              handleBack={handleBack}
              setActiveStep={setActiveStep}
              listAvailableBus={listAvailableBus}
              busTypes={busTypes}
              activeBus={activeBus}
              availableSeatNumbers={seats}
              setSeats={setSeats}
              isMobile={isUnderMobile}
              handleChange={handleChange}
              passengers={passengers}
              setPassengers={setPassengers}
              errors={errors}
              setErrors={setErrors}
              departureTimes={departureTimes}
              buss={buses}
              calenderECtoGC={calenderECtoGC}
                userType={userType}
                
            />
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
};
export default CustomerHomePage;
