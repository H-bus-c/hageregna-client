import React from "react";
import TablePage from "../table/TablePage";

const BookingList = ({
  reserveSeats,
}) => {
  const columns = [
    {
      field: "index",
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
      field: "route",
      headerName: "Route",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
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
      field: "travelDate",
      headerName: "Travel Date",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      //  valueGetter: (params) =>
      //    roles.find((role) => role.Id === params)?.roleName || "",
    },
    {
      field: "departureTime",
      headerName: "Departure Time",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      //  valueGetter: (params) =>
      //    citys.find((city) => city.Id === params)?.name || "____",
    },
    {
      field: "statusId",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => (params === 1 ? "Booked" : "Cancelled"),
    },

    //  {
    //    field: "action",
    //    headerName: "Action",
    //    headerAlign: "center",
    //    align: "center",
    //    width:100,
    //    headerClassName: "super-app-theme--header",
    //    renderCell: (params) => (
    //      <div className="row ">
    //        <center>  <GridActionsCellItem className="col-6 "
    //          icon={
    //            <Tooltip title="Edit User Data">
    //              <Edit color="primary" />
    //            </Tooltip>
    //          }
    //          onClick={() => handleUpdate(params.row)}
    //          label="Edit"
    //        />
    //        <GridActionsCellItem className="col-6 "
    //          icon={
    //            <Tooltip title="Delete User Data">
    //              <Delete color="error" />
    //            </Tooltip>
    //          }
    //          onClick={() => handleDelete(params.row.Id)}
    //          label="Delete"
    //        /></center>

    //      </div>
    //    ),
    //  },
  ];
  const rows = reserveSeats.map((rs, index) => {
    let newReserveSeat = rs;
    newReserveSeat.index = index + 1;
    return newReserveSeat;
  });
  return (
    <div>
      <TablePage
        rows={rows}
        columns={columns}
        datas={reserveSeats}
        openCreate={false}
        width={{ lg: "100vw", md: "100vw", sm: "700px", xs: "500px" }}
        
      />
    </div>
  );
};

export default BookingList;
