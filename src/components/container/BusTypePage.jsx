import React, {  useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import BusTypeCreate from "../presentation/busTypePage/BusTypeCreate";
import BusTypeTable from "../presentation/busTypePage/BusTypeTable";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import Alerts from "../presentation/alert/Alerts";
import { useAddBusType, useBusTypes, useUpdateBusType, useUsers } from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z ]+$/, "Bus name should be letter.")
    .min(3, "Too Short!")
    .max(30, "Too Long")
    .required("Bus name is required."),
  contactName: Yup.string()
    .matches(/^[A-Za-z ]+$/, "contact name should be letter.")
    .min(3, "Too Short!")
    .max(30, "Too Long")
    .required("contact name is required."),
  contactEmail: Yup.string()
    .email("Invalid contactEmail address.")
    .max(40, "Too Long")
    .required("Email is required."),
  contactPhone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits.")
    .required("Phone number is required."),
  userId: Yup.string().required("User is required"),
});

const BusTypePage = () => {
  const [openCreatePage, setOpenCreatePage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [Id, setId] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isUnderMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const { data: userData=[], isLoading: userIsLoading, isError: userIsError } = useUsers();
  const { data: busTypeData=[], isLoading: busTypeIsLoading, isError: busTypeIsError } = useBusTypes();
  const { mutateAsync: addBusType } = useAddBusType();
  const { mutateAsync: updateBusType } = useUpdateBusType();
  const users = useMemo(() => {
    return userData?.filter(u => u?.roleId === 2&&u.isActive);
  }, [userData]);
  const busTypes = useMemo(() => {
    return busTypeData?.filter(busType => busType?.statusId === 1);
  }, [busTypeData]);

  const formik = useFormik({
    initialValues: {
      name: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      userId: "",
      statusId: "",
    },
    validationSchema,
    onSubmit:  async(values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const checkPhone = busTypes.find(
            (busType) => busType.contactPhone === values.contactPhone
          );
          const checkEmail = busTypes.find(
            (busType) => busType.contactEmail === values.contactEmail
          );
          const checkName = busTypes.find(
            (busType) => busType.contactName === values.contactName
          );
          const checkAdmin = busTypes.find(busType => busType.userId === values.userId);

          if (checkEmail || checkPhone || checkName||checkAdmin) {
            formik.setErrors({
              contactEmail: checkEmail
                ? "Duplicate contactEmail not allowed!"
                : "",
              contactPhone: checkPhone
                ? "Duplicate phone number not allowed!"
                : "",
              contactName: checkName ? "Duplicate Name not allowed!" : "",
              userId: checkAdmin ? "Duplicate User not allowed!" : "",
            });
            setIsLoading(false);
            return;
          }
          values.statusId = 1;
         await addBusType(values)
            setAlertMessage("Bus Type Data Added Successfully!");
            setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage()
        } else {
          const checkPhone = busTypes.find(
            (busType) => busType.Id!==Id&& busType.contactPhone === values.contactPhone 
          );
          const checkEmail = busTypes.find(
            (busType) => busType.Id!==Id&& busType.contactEmail === values.contactEmail
          );
          const checkName = busTypes.find(
            (busType) => busType.Id!==Id&& busType.contactName === values.contactName
          );
          const checkAdmin = busTypes.find(
            (busType) => busType.Id!==Id&& busType.userId === values.userId
          );

          if (checkEmail || checkPhone || checkName || checkAdmin) {
            formik.setErrors({
              contactEmail: checkEmail
                ? "Duplicate contactEmail not allowed!"
                : "",
              contactPhone: checkPhone
                ? "Duplicate phone number not allowed!"
                : "",
              contactName: checkName ? "Duplicate Name not allowed!" : "",
              userId: checkAdmin ? "Duplicate User not allowed!" : "",
            });
            setIsLoading(false);
            return;
          }
          values.Id = Id;
         await updateBusType(values);
          setAlertMessage("Bus Type Data Update Successfully!");
          setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage();
        }
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    },
  });
  const handleDelete = async (id) => {
    setIsLoading(true)
   try {
     let deleteBusType = busTypes.find((busType) => busType.Id === id);
    deleteBusType.statusId = 2;
  
   await updateBusType(deleteBusType);
    setAlertMessage("Bus Type Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
   } catch (error) {
     setIsError(true);
   }
   setIsLoading(false)
  };
  const handleOpenCreatePage = () => {
    formik.resetForm();
    setOpenCreatePage(!openCreatePage);
  };
  const handleOpenUpdatePage = (data) => {
    const busType = busTypes.find((u) => u.Id === data.Id);
    setId(busType.Id);
    formik.setValues({
      name: busType?.name,
      contactName: busType?.contactName,
      contactEmail: busType?.contactEmail,
      contactPhone: busType?.contactPhone,
      userId: busType?.userId,
    });
    setOpenCreatePage(true);
  };

  if (isLoading||userIsLoading||busTypeIsLoading) return <LoadingPage/>;
  if (isError||userIsError||busTypeIsError) return <ErrorPage/>;
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
            <Typography
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "14px", //500
                  md: "16px", //768
                  lg: "18px", //1024
                },
              }}
            >
              
                {!openCreatePage && (
                  <BusTypeTable
                    users={users}
                    busTypes={busTypes}
                    handleCreate={handleOpenCreatePage}
                  handleUpdate={handleOpenUpdatePage}
                  handleDelete={handleDelete}
                  />
                )}
                {openCreatePage && (
                  <BusTypeCreate
                    users={users}
                    handleCreate={handleOpenCreatePage}
                    formik={formik}
                    isLoading={isLoading}
                    Id={Id}
                  />
                )}
             
            </Typography>
          </ThemeProvider>
       
      </Box> </center>
    </div>
  );
};

export default BusTypePage;
