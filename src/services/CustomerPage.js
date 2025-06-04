import { toEthiopian } from "ethiopian-date";
import SortData from "./SortData";
const sortData = new SortData();
class CustomerPage {
  sortBusOrder = ({
    route,
    travelDate,
    departureTimes,
    busDepartureTimes,
    reserves,
    reserveSeats,
    busTypes,
  }) => {
    const times = departureTimes.split("-");
    let newTime = this.timeFormat({ time: times[0] });
    const counBusSeat = busTypes
      .map((busType) => {
        const busDepartureTime = busDepartureTimes.find(
          (b) =>
            b.busTypeId === busType.Id &&
            b.routeId === route.Id &&
            b.statusId === 1
        );
        const busIndex = busDepartureTime?.departureTime.data?.find(
          (b) => newTime === this.timeFormat({ time: b })
        );
        if (busIndex) {
          const indexs =
            busDepartureTime.departureTime.data.findIndex(
              (b) => newTime === this.timeFormat({ time: b })
            ) + 1;
          const totalBus = new Array(
            Number(busDepartureTime.departureTime.data[indexs])
          ).fill(1);
          let checkLeavingBus = false;
          return totalBus.map((tbus, index) => {
            const reserve = reserves.filter((r) => {
              return (
                new Date(r.scheduleDate).getTime() ===
                  new Date(travelDate).getTime() &&
                r.busDepartureTimeId === busDepartureTime.Id &&
                this.timeFormat({ time: r.reservedBy.departureTime }) ===
                  newTime &&
                r.reservedBy.bus === index + 1 &&
                r.statusId === 1
              );
            });
            const count = reserve
              .map((r) => {
                const countSeat = reserveSeats.filter(
                  (rr) => rr.statusId === 1 && rr.reserveId === r.Id
                ).length;
                return countSeat;
              })
              .reduce((acc, crr) => acc + crr, 0);
            if (count > 0 && count !== 53) checkLeavingBus = true;
            if (count === 53) return null;
            if (count === 0 && checkLeavingBus) return null;
            checkLeavingBus = true;
            return {
              bus: index + 1,
              totalSeat: count,
              busTypeId: busType.Id,
              statusId: busType.statusId,
              Id: busDepartureTime.Id,
              basePrice: busDepartureTime.basePrice,
            };
          });
        } else return busDepartureTime;
      })
      .flat()
      .filter((b) => b?.statusId === 1);
    return this.sortBusBySeat({ busTypes: counBusSeat });
  };
  sortBusBySeat = ({ busTypes }) => {
    let order = busTypes;
    let sortSeat = sortData.sortData(order.map((o) => o.totalSeat));

    let sortBySeat = sortSeat.map((s) => {
      let orderindex = order.findIndex((o) => o.totalSeat === s);
      let newOrder = order.find((o, index) => index === orderindex);
      if (newOrder) {
        order = order.filter((o, index) => index !== orderindex);
      }
      return newOrder;
    });
    return sortBySeat;
  };
  customerSeat = ({
    bus,
    reserves,
    reserveSeats,
    travelDate,
    departureTimes,
  }) => {
    const times = departureTimes.split("-");
    let newTime = this.timeFormat({ time: times[0] });
    const newArray = new Array(53).fill(1);
    const newReserves =
      reserves?.filter(
        (r) =>
          new Date(r.scheduleDate).getTime() ===
            new Date(travelDate).getTime() &&
          r.reservedBy.bus === bus.bus &&
          r.busDepartureTimeId === bus.Id &&
          r.statusId === 1&&newTime===this.timeFormat({time:r.reservedBy.departureTime})
      ) || [];
    const newReserveSeat =
      newReserves
        ?.map((r) => {
          return reserveSeats?.filter(
            (rr) => rr.reserveId === r.Id && rr.statusId === 1
          );
        })
        ?.flat() || [];
    const seat = newArray.map((a, index) => {
      const reserveSeat = newReserveSeat?.find(
        (r) => Number(r.seatNumber) === index + 1
      );
      return { id: index + 1, status: reserveSeat ? "booked" : "available" };
    });
    return seat;
  };
  handleCity = ({ city, cities, routes }) => {
    const city1 = cities.filter((c) => {
      const routeOrigin = routes.find(
        (r) => r.city1 === city.Id && r.city2 === c.Id
      );
      const routeDestination = routes.find(
        (r) => r.city1 === c.Id && r.city2 === city.Id
      );
      return !!routeOrigin || !!routeDestination;
    });
    return city1;
  };

  changeTime = ({ time = "" }) => {
    const newTime = this.timeFormat({ time }).split(":");
    return `${String(
      Number(newTime[0]) > 12 ? Number(newTime[0]) - 12 : Number(newTime[0])
    ).padStart(2, "0")}:${String(newTime[1]).padStart(2, "0")} ${
      Number(newTime[0]) > 12 ? "PM" : "AM"
    }-${String(
      Number(newTime[0]) < 7
        ? 12 - (6 - Number(newTime[0]))
        : Number(newTime[0]) > 18
        ? Number(newTime[0]) - 18
        : Number(newTime[0]) - 6
    ).padStart(2, "0")}:${String(newTime[1]).padStart(2, "0")} ${
      Number(newTime[0]) < 6
        ? "ሌሊት"
        : Number(newTime[0]) < 12
        ? "ጠዋት"
        : Number(newTime[0]) < 18
        ? "ከሰዓት"
        : "ምሽት"
    }`;
  };

  departure = ({ bus }) => {
    const departureTime = [
      ...new Set(bus.map((b) => b.departureTime.data).flat()),
    ];
    let departure = sortData
      .sortData(departureTime)
      .filter((d) => d.includes(":"));
    let newdeparture = departure.map((d) => {
      return this.changeTime({ time: d });
    });
    return newdeparture;
  };

  departureTime = ({ buses, routes, city1, city2, city }) => {
    const bus = buses.filter((b) => {
      const route = routes.find((r) => r.Id === b.routeId);
      let result =
        city1 === ""
          ? route.city1 === city.Id && route.city2 === city2.Id
          : route.city1 === city1.Id && route.city2 === city.Id;
      return result;
    });
    return this.departure({ bus });
  };
  toEthiopianCalendar = ({ date }) => {
    const ethiopianMonths = [
      "መስከ",
      "ጥቅም",
      "ኅዳር",
      "ታኅሳ",
      "ጥር",
      "የካቲ",
      "መጋቢ",
      "ሚያዝ",
      "ግንቦ",
      "ሰኔ",
      "ሐምሌ",
      "ነሐሴ",
      "ጳጉሜ",
    ];
    const ethiopianDays = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

    const ethiopianDate = toEthiopian(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    return `${ethiopianDays[date.getDay()]} ${
      ethiopianMonths[ethiopianDate[1] - 1]
    } ${ethiopianDate[2]} ${ethiopianDate[0]} `;
  };
  addTimes = ({ time1, time2 }) => {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    let totalMinutes = m1 + m2;
    let totalHours = h1 + h2 + Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${String(totalHours).padStart(2, "0")}:${String(
      totalMinutes
    ).padStart(2, "0")}:${String(s1 + s2).padStart(2, "0")}`;
  };
  timeFormat = ({ time = "" }) => {
    let changeTime = "";
    if (time.includes("AM")) {
      changeTime = time.split(" ")[0] + ":00";
    } else if (time.includes("PM")) {
      let newTime = time.split(" ")[0];
      let times = newTime.split(":");
      changeTime = `${Number(times[0]) + 12}:${times[1]}:00`;
    } else {
      let times = time.split(":");
      if (times.length !== 3) {
        changeTime = time + ":00";
      } else {
        changeTime = time;
      }
    }
    return changeTime;
  };
}

export default CustomerPage;
