import React, { useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useAddRoute, useCitys, useRegions, useRoutes, useUpdateRoute, useZones } from "../..//services/FetchAllData"
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import Alerts from "../presentation/alert/Alerts";
import RouteTable from "../presentation/routePage/RouteTable";
import RouteCreate from "../presentation/routePage/RouteCreate";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

// Validation
const validationSchema = Yup.object().shape({
  city1: Yup.object().required("City1 location is required"),
  city2: Yup.object()
    .required("City2 location is required")
    .test(
      "is-after-city1",
      "city2 must be different from city1",
      function (value) {
        const city1 = this.parent.city1;
        if (!city1 || !value) return true;
        return value.name !== city1.name || value.zoneId !== city1.zoneId;
      }
    ),
  distance: Yup.number()
    .required("Distance is required")
    .positive("Distance must be positive")
    .max(2000, "Maximum distance is 2000 km")
    .min(50, "Minimum distance is 50 km")
    .typeError("Must be a valid number"),

  
});

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const RoutePage = () => {
  
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
  const { data: routeData, isLoading: routeIsLoading, isError:routeIsError } = useRoutes();
  const { data: citys=[], isLoading: cityIsLoading, isError: cityIsError } = useCitys();
  const { data: zones=[], isLoading: zoneIsLoading, isError: zoneIsError } = useZones();
  const { data: regions=[], isLoading: regionIsLoading, isError: regionIsError } = useRegions();
  const { mutateAsync: addRoute } = useAddRoute();
  const { mutateAsync: updateRoute } = useUpdateRoute();
  const routes = useMemo(() => routeData?.filter(route=>route?.statusId===1), [routeData]);
 
  const formik = useFormik({
    initialValues: {
      city1: "",
      city2: "",
      distance: "",
      duration: "",
      statusId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const checkRoute = routes.find(
            (route) =>
              (route.city1 === values.city1.Id &&
                route.city2 === values.city2.Id) ||
              (route.city2 === values.city1.Id &&
                route.city1 === values.city2.Id)
          );
          if (checkRoute) {
            setAlertMessage(
              "Duplicate Departure Place and Arraival Place not allowed! change one of them!"
            );
            setAlertOpen(true);
            setAlertType("error");
            setIsLoading(false);
            return;
          }
          values.distance = Number(values.distance).toFixed();
          values.duration = (Number(values.distance) / 40).toFixed(2);
          const time = values.duration.toString().split(".");
          let minuets = (Number(time[1]) * 60) / 100;
          values.city2 = values.city2.Id;
          values.city1 = values.city1.Id;
          values.duration = `${time[0] - 1}:${minuets.toFixed(0)}:00`;
          values.statusId = 1;
        await  addRoute(values);
         await addRoute({
            city1: values.city2,
            city2: values.city1,
            distance: values.distance,
            duration: values.duration,
            statusId: values.statusId,
          });
          setAlertMessage("Route Data Added Successfully!");
          setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage(false);
        } else {
          const checkRoute = routes.find(
            (route) =>
              (route.city1 === values.city1.Id &&
                route.city2 === values.city2.Id) && Id!==route.Id
          );
          if (checkRoute) {
            setAlertMessage(
              "Duplicate Departure Place and Arraival Place not allowed! change one of them!"
            );
            setAlertOpen(true);
            setAlertType("error");
            setIsLoading(false);
            return;
          }
          values.Id = Id;
         await updateRoute(values);
          setAlertMessage("Route Data Update Successfully!");
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
      const deleteRoute = routes.map(route => route.Id === id);
    deleteRoute.statusId = 2;
    updateRoute(deleteRoute);
    setAlertMessage("Route Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
    
  }

  const handleOpenCreatePage = () => {
    setId("")
    formik.resetForm();
    setOpenCreatePage(!openCreatePage);
  };
  const handleOpenUpdatePage = (data) => {
    const route = routes.find((u) => u.Id === data.Id);
    setId(route.Id);
    formik.setValues({
      city1: citys.find((c) => c.Id === route.city1),
      city2: citys.find((c) => c.Id === route.city2),
      duration: route?.duration,
      distance: route?.distance,

    });
    setOpenCreatePage(true);
  };

  if (isLoading || routeIsLoading || cityIsLoading || zoneIsLoading || regionIsLoading) return <LoadingPage />;
  if (isError || routeIsError || cityIsError || zoneIsError || regionIsError) return <ErrorPage />;

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
      <Header />{" "}
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
              <RouteTable
                routes={routes}
                citys={[
                  ...citys.map((c) => {
                    const zone = zones.find((z) => z.Id === c.zoneId);
                    const region = regions.find((r) => r.Id === zone.regionId);
                    let city = c;
                    city.zone = zone.name;
                    city.region = region.name;
                    return city;
                  }),
                ]}
                handleCreate={handleOpenCreatePage}
                handleUpdate={handleOpenUpdatePage}
                handleDelete={handleDelete}
              />
            )}
            {openCreatePage && (
              <RouteCreate
                citys={citys.filter((data) => data.statusId === 1)}
                zones={zones.filter((data) => data.statusId === 1)}
                regions={regions.filter((data) => data.statusId === 1)}
                handleCreate={handleOpenCreatePage}
                formik={formik}
                isLoading={isLoading}
                Id={Id}
              />
            )}
          </ThemeProvider>
        </Box>{" "}
      </center>
    </div>
  );
};

export default RoutePage;
