import React, { useEffect, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UserTable from "../presentation/userPage/UserTable";
import UserCreate from "../presentation/userPage/UserCreate";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import Alerts from "../presentation/alert/Alerts";
import { jwtDecode } from "jwt-decode";
import {
  useAddUser,
  useBusTypes,
  useCitys,
  useRoles,
  useUpdateUser,
  useUsers,
} from "../../services/FetchAllData";
import { addUserUpdateHistory } from "../../services/API";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Validation
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(
      /^[A-Za-z]+\s+[A-Za-z]+$/,
      "Full name should be at least two words."
    )
    .min(8, "Too Short!")
    .max(50, "Too Long")
    .required("Full name is required."),
  userName: Yup.string()
    .matches(
      /^[A-Za-z0-9]{3,15}$/,
      "Username must be 3-15 alphanumeric characters."
    )
    .required("Username is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits.")
    .required("Phone number is required."),
  roleId: Yup.string().required("Role is required"),
});

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const UserPage = () => {
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
  const loginUser = jwtDecode(localStorage?.getItem("token")) || {
    Id: 0,
    roleId: 0,
  };
  const {
    data: userData=[],
    isLoading: userLoading,
    isError: userIsError,
  } = useUsers();
  const {
    data: roles=[],
    isLoading: roleLoading,
    isError: roleIsError,
  } = useRoles();
  const {
    data: citys=[],
    isLoading: cityLoading,
    isError: cityIsError,
  } = useCitys();
  const {
    data: busTypes=[],
    isLoading: busTypeLoading,
    isError: busTypeIsError,
  } = useBusTypes();
  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const users = useMemo(() => userData?.filter(u=>u?.isActive), [userData]);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      userName: "",
      phoneNumber: "",
      roleId: "",
      admin: "",
      workPlace: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const checkUsername = users.find(
            (user) => user.userName === values.userName
          );
          const checkPhone = users.find(
            (user) => user.phoneNumber === values.phoneNumber
          );
          const checkEmail = users.find((user) => user.email === values.email);

          if (checkEmail || checkPhone || checkUsername) {
            formik.setErrors({
              email: checkEmail ? "Duplicate email not allowed!" : "",
              phoneNumber: checkPhone
                ? "Duplicate phone number not allowed!"
                : "",
              userName: checkUsername ? "You can't use this Username!" : "",
              workPlace:
                values.roleId === 4 && values.workPlace === ""
                  ? "Work Place is required"
                  : "",
            });
            setIsLoading(false);
            return;
          }
          if (loginUser.roleId === 1) {
            values.admin = 1;
          } else if (loginUser.roleId === 2) {
            values.admin = loginUser.Id;
          } else {
            const user = users((u) => u.Id === loginUser.Id);
            values.admin = user.admin;
          }

        await  addUser(values);
          setAlertMessage("User Data Added Successfully!");
          setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage(false);
        } else {
          const checkUsername = users.find(
            (user) => user.userName === values.userName && user.Id !== Id
          );
          const checkPhone = users.find(
            (user) => user.phoneNumber === values.phoneNumber && user.Id !== Id
          );
          const checkEmail = users.find(
            (user) => user.email === values.email && user.Id !== Id
          );

          if (checkEmail || checkPhone || checkUsername) {
            formik.setErrors({
              email: checkEmail ? "Duplicate email not allowed!" : "",
              phoneNumber: checkPhone
                ? "Duplicate phone number not allowed!"
                : "",
              userName: checkUsername ? "You can't use this Username!" : "",
            });
            setIsLoading(false);
            return;
          }
          values.Id = Id;
          await addUserUpdateHistory({ changeType: values, userId: Id });
         await updateUser(values);
          setAlertMessage("User Data Update Successfully!");
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

  const handleOpenCreatePage = () => {
    formik.resetForm();
    setId("");
    setOpenCreatePage(!openCreatePage);
  };
  const handleOpenUpdatePage = (data) => {
    const user = users.find((u) => u.Id === data.Id);
    setId(user.Id);
    formik.setValues({
      fullName: user?.fullName,
      userName: user?.userName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      roleId: user?.roleId,
    });
    setOpenCreatePage(true);
  };
  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    try {
      let deleteUser = users.find((user) => user.Id === id);
    deleteUser.isActive = false;
    await addUserUpdateHistory({changeType:deleteUser,userId:id});
   await updateUser(deleteUser);
    setAlertMessage("User Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");

    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
    };  

  if (isLoading || userLoading || roleLoading || cityLoading||busTypeLoading)
    return <LoadingPage />;
  if (isError || userIsError || roleIsError || cityIsError||busTypeIsError)
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
              <UserTable
                users={
                  loginUser.roleId === 1
                    ? users.filter((u) => u.roleId < 3 && u.isActive)
                    : loginUser.roleId === 2
                    ? users.filter(
                        (u) =>
                          u.roleId > 2 && u.isActive && u.admin === loginUser.Id
                      )
                    : users.filter(
                        (u) =>
                          u.roleId > 2 &&
                          u.isActive &&
                          u.admin === loginUser.admin
                      )
                }
                roles={roles}
                handleCreate={handleOpenCreatePage}
                handleUpdate={handleOpenUpdatePage}
                handleDelete={handleDeleteUser}
                citys={citys}
                loginUser={loginUser}
                busTypes={busTypes}
              />
            )}
            {openCreatePage && (
              <UserCreate
                roles={
                  loginUser.roleId === 1
                    ? roles.filter((r) => r.Id < 3)
                    : roles.filter((r) => r.Id > 2)
                }
                handleCreate={handleOpenCreatePage}
                formik={formik}
                isLoading={isLoading}
                Id={Id}
                citys={citys.filter(city=>city.statusId===1)}
              />
            )}
          </ThemeProvider>
        </Box>{" "}
      </center>
    </div>
  );
};

export default UserPage;
