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
  addBus,
  fetchCity,
  fetchBus,
  fetchZone,
  fetchRegion,
  fetchBusType,
  fetchUser,
  addBusUpdateHistory,
} from "../../services/API";
import BusTable from "../presentation/busPage/BusTable";
import BusCreate from "../presentation/busPage/BusCreate";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import Alerts from "../presentation/alert/Alerts";
import { jwtDecode } from "jwt-decode";
import { useAddBus, useBuss, useBusTypes, useUpdateBus, useUsers } from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Validation
const validationSchema = Yup.object().shape({
  licensePlate: Yup.string()
    .required("License plate is required")
    .matches(
      /^[A-Z]{1}[0-9]{5,8}$/,
      "Invalid license plate format (e.g., A12345 or B82345)"
    ),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(10, "Capacity must be at least 10 ")
    .max(100, "Capacity must be less than 100 ")
    .integer("Must be a whole number")
    .typeError("Must be a valid number"),
  userId: Yup.object().required("User is required"),
});

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const BusPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openCreatePage, setOpenCreatePage] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [Id, setId] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isUnderMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  
  const { data: userData=[], isLoading: userIsLoading, isError: userIsError } = useUsers();
  const { data: busData=[], isLoading: busIsLoading, isError: busIsError } = useBuss();
  const { data: busTypes=[], isLoading: busTypeIsLoading, isError: busTypeIsError } = useBusTypes()
  const { mutateAsync: addBus } = useAddBus();
  const { mutateAsync: updateBus } = useUpdateBus();
  const loginUser = useMemo(() => {
    const login = localStorage.getItem("token");
    if (login) return jwtDecode(login);
    return null;
  },[]) 
  const users = useMemo(() => {
    return userData?.filter(u => u.roleId === 5);
  }, [userData]);
  
  const buses = useMemo(() => {
    return busData?.filter(b => b?.admin === loginUser?.admin);
  }, [busData, loginUser]);
  
  const formik = useFormik({
    initialValues: {
      licensePlate: "",
      capacity: "",
      busTypeId: "",
      userId: "",
      statusId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const busType = busTypes.find(b=>b.userId===loginUser.admin);
        if (Id === "") {
          const checkBusTargaNumber = buses.find(
            (bus) => bus.licensePlate === values.licensePlate
          );
          const checkUser = buses.find(bus => bus.userId === values.userId.Id);
          if (checkBusTargaNumber||checkUser) {
            formik.setErrors({
              licensePlate:checkBusTargaNumber&& "Duplicate License Plate not allowed!",
              userId:checkUser&&"Duplicate User not allowed!"
            }
            );
            setIsLoading(false);
            return;
          }
          values.busTypeId = busType.Id
          values.statusId = 1;
          values.userId = values.userId.Id;

         await addBus(values)
            setAlertMessage("Bus Data Added Successfully!");
            setAlertOpen(true);
            setAlertType("success"); handleOpenCreatePage(false)
          
        } else {
          const checkBusTargaNumber = buses.find(
            (bus) =>bus.Id!==Id&& bus.licensePlate === values.licensePlate
          );
          
          const checkUser = buses.find((bus) => bus.Id!==Id&&bus.userId === values.userId.Id);
          if (checkBusTargaNumber || checkUser) {
            formik.setErrors({
              licensePlate:
                checkBusTargaNumber && "Duplicate License Plate not allowed!",
              userId: checkUser && "Duplicate User not allowed!",
            });
            setIsLoading(false);
            return;
          }
          values.Id = Id;
          values.busTypeId = busType.Id;
          values.userId = values.userId.Id;
          await addBusUpdateHistory({ changeType: values, busId: Id });
         await updateBus(values);
          setAlertMessage("Bus Data Update Successfully!");
          setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage(false);
        }
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    },
  });

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
       let deleteBus = buses.find((bus) => bus.Id === id);
    deleteBus.statusId = 2;
    await addBusUpdateHistory({ changeType: deleteBus, busId: id });
   await updateBus(deleteBus);
    setAlertMessage("Bus Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };
  const handleOpenCreatePage = () => {
    formik.resetForm();
    
      const busType = busTypes.find(b=>b.userId===loginUser.admin);
      if (!busType) {
        setAlertMessage(
          "You need to permission to perform this action. please contact owner!"
        );
        setAlertOpen(true);
        setAlertType("warning");
        return;
      }
    
    setId("");
    setOpenCreatePage(!openCreatePage);
  };
  const handleOpenUpdatePage = (data) => {
    const bus = buses.find((u) => u.Id === data.Id);
    setId(bus.Id);
    formik.setValues({
      licensePlate: bus?.licensePlate,
      capacity: bus?.capacity,
      departureTime: bus?.departureTime,
      busTypeId: bus?.busTypeId,
      userId: users.find((r) => r.Id === bus.userId),
      statusId: bus?.statusId,
    });
    setOpenCreatePage(true);
  };

  if (isLoading||userIsLoading||busIsLoading||busTypeIsLoading) return <LoadingPage/>;
  if (isError||userIsError||busIsError||busTypeIsError) return <ErrorPage/>;

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
      <Header /><center>
      <Box maxWidth="1200px">
        <Alerts
          open={alertOpen}
          setOpen={setAlertOpen}
          message={alertMessage}
          type={alertType}
        />
          <ThemeProvider theme={theme}>
            {!openCreatePage && (
              <BusTable
                buss={buses}
                users={users}
                handleCreate={handleOpenCreatePage}
                handleUpdate={handleOpenUpdatePage}
                handleDelete={handleDelete}
              />
            )}
            {openCreatePage && (
              <BusCreate
                users={users}
                handleCreate={handleOpenCreatePage}
                formik={formik}
                isLoading={isLoading}
                Id={Id}
              />
            )}
          </ThemeProvider>
       
      </Box> </center>
    </div>
  );
};

export default BusPage;
