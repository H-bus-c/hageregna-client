import React, { useEffect, useState } from "react";
import {
  fetchBus,
  fetchBusDepartureTime,
  fetchBusType,
  fetchCity,
  fetchReserve,
  fetchReserveSeat,
  fetchRoute,
} from "../../services/API";
import { jwtDecode } from "jwt-decode";
import CustomerPage from "../../services/CustomerPage";
import { Container, createTheme, ThemeProvider } from "@mui/material";
import Header from "../../Header";
import { toEthiopian } from "ethiopian-date";
import BookingList from "../presentation/passenger/BookingList";
import PasssengerList from "../presentation/passenger/PasssengerList";
const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const Passengers = () => {
   const [reserves, setReserves] = useState([]);
   const [reserveSeats, setReserveSeats] = useState([]);
   const [departureTimes, setDepartureTimes] = useState([]);
   const [routes, setRoutes] = useState([]);
   const [citys, setCitys] = useState([]);
   const [busTypes, setBusTypes] = useState([]);
   const [buss, setBuss] = useState([]);
   const [allDate, setAllDate] = useState([]);
   const loginUsers = jwtDecode(localStorage?.getItem('token'));
   const url = window.location.pathname;
   const passengerListUrl = '/report/passenger_list';
   const customerPage = new CustomerPage();
   const leaveBus = [
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

   const fetchData = async () => {
      const [reserve, reserveSeat, departureTime, route, city, busType, bus] = await Promise.all([
         fetchReserve(),
         fetchReserveSeat(),
         fetchBusDepartureTime(),
         fetchRoute(),
         fetchCity(),
         fetchBusType(),
         fetchBus(),
      ]);
      const date = new Set();
      setReserves(
         reserve.map(r => {
            if (!date.has(r.scheduleDate)) date.add(r.scheduleDate);
            r.busTypeId = departureTime.find(d => d.Id === r.busDepartureTimeId)?.busTypeId;
            r.routeId = departureTime.find(d => d.Id === r.busDepartureTimeId)?.routeId;
            return r;
         })
      );
      setAllDate([...date]);
      setReserveSeats(reserveSeat);
      setDepartureTimes(departureTime);
      setRoutes(route);
      setCitys(city);
      setBusTypes(busType.find(b => b.userId === loginUsers.admin));
      setBuss(
         bus.filter(b => b.busTypeId === busType.find(b => b.userId === loginUsers.admin)?.Id)
      );
   };
   useEffect(() => {
      fetchData();
   }, []);
   // reduce performance
   const handleReserveSeats = newReserve => {
      return reserveSeats.filter(rs => {
         const reserve = newReserve.find(nr => nr.Id === rs.reserveId && nr.statusId === 1);
         const route = routes.find(ro => ro.Id === reserve?.routeId);
         const checkRoute =
            (loginUsers.roleId <= 3 || route?.city1 === loginUsers.workPlace) &&
            (rs.statusId === 1 || rs.statusId >= 6);
         const travelDate = checkRoute
            ? toEthiopian([
                 new Date(reserve?.scheduleDate).getUTCFullYear(),
                 new Date(reserve?.scheduleDate).getUTCMonth() + 1,
                 new Date(reserve?.scheduleDate).getUTCDate(),
              ])
            : [1, 1, 1];
         rs.travelDate = `${travelDate[2]}/${travelDate[1]}/${travelDate[0]}`;
         rs.route = `${citys.find(c => c.Id === route?.city1)?.name} To ${
            citys.find(c => c.Id === route?.city2)?.name
         }`;
         const bookedDate = toEthiopian([
            new Date(rs.createdAt).getUTCFullYear(),
            new Date(rs.createdAt).getUTCMonth() + 1,
            new Date(rs.createdAt).getUTCDate(),
         ]);
         rs.bookedDate = `${bookedDate[2]}/${bookedDate[1]}/${bookedDate[0]}`;
         rs.departureTime = checkRoute
            ? customerPage
                 .changeTime({
                    time: reserve?.reservedBy.departureTime,
                 })
                 .split('-')[1]
            : '1:00 AM';
         return checkRoute;
      });
   };
   // reduce performance
   const handleRoute = () => {
      return allDate
         .map((date, index) => {
            const travelDate = toEthiopian([
               new Date(date).getUTCFullYear(),
               new Date(date).getUTCMonth() + 1,
               new Date(date).getUTCDate(),
            ]);
            return buss
               .map(b => {
                  const reserve = reserves.filter(r => r.scheduleDate === date && r.busId === b.Id);
                  let cust = 0,
                     sale = 0,
                     attendant = 0;
                  const counter = reserve
                     .map(r => {
                        const count = reserveSeats.filter(
                           rs => rs.reserveId === r.Id && (rs.statusId === 1 || rs.statusId >= 6)
                        ).length;
                        cust += r.reservedBy.reservedBy.includes('Cust') ? count : 0;
                        sale += r.reservedBy.reservedBy.includes('Sal') ? count : 0;
                        attendant += r.reservedBy.reservedBy.includes('Car') ? count : 0;
                        return count;
                     })
                     .reduce((acc, crr) => acc + crr, 0);
                  const route =
                     reserve.length > 0 && routes.find(ro => ro.Id === reserve[0]?.routeId);
                  if (reserve.length === 0) return null;
                  return {
                     id: index + 1,
                     Id: index + 1,
                     travelDate: `${travelDate[2]}/${travelDate[1]}/${travelDate[0]}`,
                     totalBooked: counter,
                     route:
                        reserve.length > 0 &&
                        `${citys.find(c => c.Id === route?.city1)?.name} To ${
                           citys.find(c => c.Id === route?.city2)?.name
                        }`,
                     departureTime:
                        reserve.length > 0 &&
                        customerPage
                           .changeTime({
                              time: reserve[0].reservedBy.departureTime,
                           })
                           .split('-')[1],
                     leavingBus: reserve.length > 0 && leaveBus[reserve[0].reservedBy.bus - 1],
                     licensePlate: b.licensePlate,
                     data: reserve.map(r => r.Id),
                     bookedByCustomer: cust,
                     bookedByCarAttender: attendant,
                     bookedByTicketSaller: sale,
                  };
               })
               .filter(b => !!b);
         })
         .flat();
   };
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
         <Container maxWidth="xl">
            <center>
               <ThemeProvider theme={theme}>
                  {url === passengerListUrl ? (
                     <PasssengerList
                        passenger={handleRoute()}
                        reserves={reserves}
                        reserveSeats={handleReserveSeats(
                           reserves.filter(r => r.busTypeId === busTypes?.Id)
                        )}
                     />
                  ) : (
                     <BookingList
                        reserveSeats={handleReserveSeats(
                           reserves.filter(r => r.busTypeId === busTypes?.Id)
                        )}
                     />
                  )}
               </ThemeProvider>
            </center>
         </Container>
      </div>
   );
};

export default Passengers;
