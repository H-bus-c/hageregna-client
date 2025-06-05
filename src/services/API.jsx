import axios from "axios";
const api = "https://hageregna-server.onrender.com";

export const fetchDate = async () => {
  const response = await axios.get(`${api}/date`).catch((err) => err);
  return response.data.serverDate;
};
export const fetchBus = async () => {
  const response = await axios.get(`${api}/bus`).catch((err) => err);
  return response.data;
};
export const fetchBusDepartureTime = async () => {
  const response = await axios
    .get(`${api}/bus_departure_time`)
    .catch((err) => err);
  return response.data;
};
export const fetchBusType = async () => {
  const response = await axios.get(`${api}/bus_type`).catch((err) => err);
  return response.data;
};
export const fetchCity = async () => {
  const response = await axios.get(`${api}/city`).catch((err) => err);
  return response.data;
};
export const fetchPayment = async () => {
  const response = await axios.get(`${api}/payment`).catch((err) => err);
  return response.data;
};
export const fetchRegion = async () => {
  const response = await axios.get(`${api}/region`).catch((err) => err);
  return response.data;
};
export const fetchReserve = async () => {
  const response = await axios.get(`${api}/reserve`).catch((err) => err);
  return response.data;
};
export const fetchReserveSeat = async () => {
  const response = await axios.get(`${api}/reserve_seat`).catch((err) => err);
  return response.data;
};
export const fetchRole = async () => {
  const response = await axios.get(`${api}/role`).catch((err) => err);
  return response.data;
};
export const fetchRoute = async () => {
  const response = await axios.get(`${api}/route`).catch((err) => err);
  return response.data;
};
export const fetchStatus = async () => {
  const response = await axios.get(`${api}/status`).catch((err) => err);
  return response.data;
};
export const fetchUser = async () => {
  const response = await axios.get(`${api}/user`).catch((err) => err);
  return response.data;
};
export const fetchZone = async () => {
  const response = await axios.get(`${api}/zone`).catch((err) => err);
  return response.data;
};

// Add New Data

export const addBus = async (values) => {
  const response = await axios
    .post(`${api}/bus/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addBusDepartureTime = async (values) => {
  const response = await axios
    .post(`${api}/bus_departure_time/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addBusUpdateHistory = async (values) => {
  const response = await axios
    .post(`${api}/bus_update_history/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addBusType = async (values) => {
  const response = await axios
    .post(`${api}/bus_type/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addCity = async (values) => {
  const response = await axios
    .post(`${api}/city/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addPayment = async (values) => {
  const response = await axios
    .post(`${api}/payment/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addRegion = async (values) => {
  const response = await axios
    .post(`${api}/region/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addReserve = async (values) => {
  const response = await axios
    .post(`${api}/reserve/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addReserveSeat = async (values) => {
  const response = await axios
    .post(`${api}/reserve_seat/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addRole = async (values) => {
  const response = await axios
    .post(`${api}/role/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addRoute = async (values) => {
  const response = await axios
    .post(`${api}/route/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addStatus = async (values) => {
  const response = await axios
    .post(`${api}/status/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addUser = async (values) => {
  const response = await axios
    .post(`${api}/user/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addUserUpdateHistory = async (values) => {
  const response = await axios
    .post(`${api}/user_update_history/add`, values)
    .catch((err) => err);
  return response.data;
};
export const addZone = async (values) => {
  const response = await axios
    .post(`${api}/zone/add`, values)
    .catch((err) => err);
  return response.data;
};

// Update existing data
export const updateBus = async (values) => {
  const response = await axios
    .put(`${api}/bus/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateBusDepartureTime = async (values) => {
  const response = await axios
    .put(`${api}/bus_departure_time/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateBusType = async (values) => {
  const response = await axios
    .put(`${api}/bus_type/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateCity = async (values) => {
  const response = await axios
    .put(`${api}/city/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updatePayment = async (values) => {
  const response = await axios
    .put(`${api}/payment/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateRegion = async (values) => {
  const response = await axios
    .put(`${api}/region/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateReserve = async (values) => {
  const response = await axios
    .put(`${api}/reserve/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateReserveSeat = async (values) => {
  const response = await axios
    .put(`${api}/reserve_seat/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateRole = async (values) => {
  const response = await axios
    .put(`${api}/role/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateRoute = async (values) => {
  const response = await axios
    .put(`${api}/route/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateStatus = async (values) => {
  const response = await axios
    .put(`${api}/status/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateUser = async (values) => {
  const response = await axios
    .put(`${api}/user/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};
export const updateZone = async (values) => {
  const response = await axios
    .put(`${api}/zone/update/${values.Id}`, values)
    .catch((err) => err);
  return response.data;
};

// Delete existing data
export const deleteBus = async (values) => {
  const response = await axios
    .delete(`${api}/bus/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteBusDepartureTime = async (values) => {
  const response = await axios
    .delete(`${api}/bus_departure_time/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteBusType = async (values) => {
  const response = await axios
    .delete(`${api}/bus_type/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteCity = async (values) => {
  const response = await axios
    .delete(`${api}/city/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deletePayment = async (values) => {
  const response = await axios
    .delete(`${api}/payment/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteRegion = async (values) => {
  const response = await axios
    .delete(`${api}/region/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteReserve = async (values) => {
  const response = await axios
    .delete(`${api}/reserve/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteReserveSeat = async (values) => {
  const response = await axios
    .delete(`${api}/reserve_seat/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteRole = async (values) => {
  const response = await axios
    .delete(`${api}/role/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteRoute = async (values) => {
  const response = await axios
    .delete(`${api}/route/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteStatus = async (values) => {
  const response = await axios
    .delete(`${api}/status/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteUser = async (values) => {
  const response = await axios
    .delete(`${api}/user/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};
export const deleteZone = async (values) => {
  const response = await axios
    .delete(`${api}/zone/delete/${values.Id}`)
    .catch((err) => err);
  return response.data;
};

///

export const startPay = async (values) => {
  await axios
    .post(`${api}/create/order`, values)
    .then((response) => {
      const paymentUrl = response.data;
      if (!paymentUrl) return;
      let a = document.createElement("a");
      a.href = paymentUrl;
      a.target = "_blank";
      a.click();
    })
    .catch((error) => {
      console.error("Payment error:", error);
    });
};

export const sendVerificationCode = async (values) => {
  const response = await axios
    .post(`${api}/verification_code/sms`, values)
    .catch((err) => err);
  return response.data;
};
export const verifySMSCode = async (values) => {
  const response = await axios
    .post(`${api}/verification_code/sms_verify`, values)
    .catch((err) => err);
  return response.data;
};
