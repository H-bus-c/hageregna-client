import  { useState } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {  Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import TablePage from "../table/TablePage";
import CustomerPage from "../../../services/CustomerPage";

const BusDepartureTimeTable = ({
  busDepartureTimes,
  allRoutes,
  handleCreate,
  handleUpdate,handleDelete
}) => {
  const [open, setOpen] = useState(false);
  const [viewData, setViewData] = useState([]);
  const customerPage = new CustomerPage();
  const columns = [
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "origin",
      headerName: "Departure Place",
      headerAlign: "center",
      align: "center",
      flex: 0.13,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip
          title={`Zone : ${params.row?.zone1 || ""}, Region : ${
            params.row?.region1 || ""
          }`}
          arrow
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "destination",
      headerName: "Arraival Place",
      headerAlign: "center",
      align: "center",
      flex: 0.13,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip
          title={`Zone : ${params.row?.zone2 || ""}, Region : ${
            params.row?.region2 || ""
          }`}
          arrow
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "basePrice",
      headerName: "Price (Birr)",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => Number(params).toLocaleString(),
    },
    {
      field: "distance",
      headerName: "Distance (KM)",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => Number(params).toFixed(2),
    },
    {
      field: "duration",
      headerName: "Estimate Time",
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      headerClassName: "super-app-theme--header",
      
    },    
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
     width:100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="row ">
          <center><GridActionsCellItem className="col-6"
            icon={
              <Tooltip title="Edit">
                <Edit color="primary" />
              </Tooltip>
            }
            onClick={() => handleUpdate(params.row)}
            label="Edit"
          />
          <GridActionsCellItem className="col-6"
            icon={
              <Tooltip title="Delete">
                <Delete color="error" />
              </Tooltip>
            }
             onClick={() => handleDelete(params.id)}
            label="Delete"
          /></center>
          
        </div>
      ),
    },
  ];

  const dataColumns = [
     {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
    },
     {
      field: "route",
      headerName: "Routes",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },
      {
      field: "time",
      headerName: "Departure Time",
      headerAlign: "center",
      align: "center",
      flex: 0.13,
      headerClassName: "super-app-theme--header",
    },
      {
      field: "arrivalTime",
      headerName: "Arrival Time",
      headerAlign: "center",
      align: "center",
      flex: 0.13,
      headerClassName: "super-app-theme--header",
    },
       {
      field: "leave",
      headerName: "Total Leaving Bus",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
    },
  ]
  const rows = busDepartureTimes.map((bus, index) => {
    const route = allRoutes.find((r) => r.Id === bus.routeId);
    const { data } = bus.departureTime;
    let departureTime = [], leaveBus = [];
    data?.map((d, i) => {
      if (i % 2 === 0) departureTime.push(customerPage.changeTime({ time: d }).split("-")[1]);
      else return leaveBus.push(d);
      return d;
    });
  //  console.log(departureTime);
    let newBus = bus;
    newBus.index = index + 1;
    newBus.origin = route?.origin;
    newBus.destination = route?.destination;
    newBus.zone1 = route?.zone1;
    newBus.zone2 = route?.zone2;
    newBus.region1 = route?.region1;
    newBus.region2 = route?.region2;
    newBus.time = departureTime;
    newBus.leaveBus = leaveBus;
    newBus.distance = route.distance;
    newBus.duration = route.duration;
    newBus.estimateTime = route.duration;
    return newBus;
  });
  
  const handleView = (rows) => {
    
    const data = rows?.leaveBus?.map((l, i) => {
       const changeTime = customerPage.addTimes({time1:rows.duration,time2:rows.departureTime.data[i*2]})
      let temp = {};
       temp.Id = i;
      temp.index = i + 1;
      temp.route = `${rows.origin} To ${rows.destination}`;
      temp.arrivalTime = customerPage.changeTime({ time: changeTime }).split("-")[1];
      temp.time = customerPage.changeTime({ time: rows.departureTime.data[i*2]}).split("-")[1];
       temp.leave = l;
       
      return temp;
    });
    setViewData(data);
    setOpen(true);
  }
  
  return (
    <div>
      {open?<TablePage
        rows={viewData}
        columns={dataColumns}
        datas={viewData}
        openBack={true}
        handleBack={()=>setOpen(false)}
        
      />:<TablePage
        rows={rows}
        columns={columns}
          datas={busDepartureTimes}
          openView={true}
          handleView={handleView}
          handleCreate={handleCreate}
          minWidth={"600px"}
      />}
    </div>
  );
};

export default BusDepartureTimeTable;
