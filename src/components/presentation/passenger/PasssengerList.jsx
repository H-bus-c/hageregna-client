import React, { useState } from 'react'
import TablePage from '../table/TablePage';

const PasssengerList = ({ passenger, reserves, reserveSeats}) => {
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "route",
      headerName: "Route",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "travelDate",
      headerName: "Travel Date",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "departureTime",
      headerName: "Departure Time",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "leavingBus",
      headerName: "Leaving Bus",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "licensePlate",
      headerName: "License Plate",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalBooked",
      headerName: "Total Booked",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
  ];
  const datacolumns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "customerName",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "customerPhone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => `+251${params}`,
    },
    {
      field: "seatNumber",
      headerName: "Seat No",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "ticketNumber",
      headerName: "Ticket No",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        params.match(new RegExp(".{1," + 4 + "}", "g")).join("−"),
    },
    {
      field: "bookedDate",
      headerName: "Booked Date",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "statusId",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => params===7?"Travelled":"Untravelled"
    },
  ];
  const handleView = (row) => {
    const data = row.data?.map(d => {
      return reserveSeats.filter(rs => rs.reserveId === d);
    }).flat();
    setViewData(data.map((d,i) => {
      d.id = i + 1;
      return d;
    }));
    setOpenView(true);
  }
  return (
    <div>
     {openView? <TablePage
        rows={viewData}
        columns={datacolumns}
        datas={viewData}
        openCreate={false}
        width={{ lg: "100vw", md: "100vw", sm: "700px", xs: "500px" }}
        openBack={true}
        handleBack={()=>setOpenView(false)}
      />: <TablePage
        rows={passenger}
        columns={columns}
        datas={passenger}
        openCreate={false}
        width={{ lg: "100vw", md: "100vw", sm: "700px", xs: "500px" }}
        openView={true}
        handleView={handleView}
      />}
    </div>
  );
}

export default PasssengerList