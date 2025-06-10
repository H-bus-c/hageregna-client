import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  addCity,
  addRegion,
  addZone,
  fetchCity,
  fetchRegion,
  fetchZone,
} from "../../services/API";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../../Header";
import CityTable from "../presentation/cityPage/cityTable";
import CityCreate from "../presentation/cityPage/CityCreate";
import ZoneTable from "../presentation/cityPage/ZoneTable";
import ZoneCreate from "../presentation/cityPage/ZoneCreate";
import RegionTable from "../presentation/cityPage/RegionTable";
import RegionCreate from "../presentation/cityPage/RegionCreate";
import Alerts from "../presentation/alert/Alerts";
import { useAddCity, useAddRegion, useAddZone, useCitys, useRegions, useUpdateCity, useUpdateRegion, useUpdateZone, useZones } from "../../services/FetchAllData";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Validation
const validationSchemaRegion = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z+ ]{3,20}$/, "Region Name must be 3-20 alpha characters.")
    .required("Region Name is required."),
});
const validationSchemaZone = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z+ ]{3,20}$/, "Zone Name must be 3-20 alpha characters.")
    .required("Zone Name is required."),
  regionId: Yup.string().required("Region is required"),
});
const validationSchemaCity = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z+ ]{3,20}$/, "City Name must be 3-20 alpha characters.")
    .required("City Name is required."),
  regionId: Yup.string().required("Region is required"),
  zoneId: Yup.string().required("Zone is required"),
});

// Typology respanse by customer

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 769, lg: 1024, xl: 1440 } },
});
const CityPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openCreatePage, setOpenCreatePage] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [Id, setId] = useState("");

  const { id } = useParams();
  const activePage = useMemo(() => {
    return parseInt(id);
  }, [id]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isUnderMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { data: citys=[], isLoading: cityIsLoading, isError: cityIsError } = useCitys();
  const { data: regions=[], isLoading: regionIsLoading, isError: regionIsError } = useRegions();
  const { data: zones=[], isLoading: zoneIsLoading, isError: zoneIsError } = useZones();
  const { mutateAsync: addCity } = useAddCity();
  const { mutateAsync: addRegion } = useAddRegion();
  const { mutateAsync: addZone } = useAddZone();
  const { mutateAsync: updateCity } = useUpdateCity();
  const { mutateAsync: updateRegion } = useUpdateRegion();
  const { mutateAsync: updateZone } = useUpdateZone();

  const formikRegion = useFormik({
    initialValues: {
      name: "",
      statusId:""
    },
    validationSchema: validationSchemaRegion,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const region = regions.find(
            (r) => r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (region) {
            setIsLoading(false);
            formikRegion.setErrors({ name: "Duplicate Region not allowed!" });
            return;
          }
          values.statusId = 1;
         await addRegion(values)
            setAlertMessage("Region Data Added Successfully!");
            setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage()
          
        } else {
          const region = regions.find(
            (r) =>Id!==r.Id&& r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (region) {
            setIsLoading(false);
            formikRegion.setErrors({ name: "Duplicate Region not allowed!" });
            return;
          }
          values.Id = Id;
          await updateRegion(values);
          setAlertMessage("Region Data Update Successfully!");
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
  const formikZone = useFormik({
    initialValues: {
      name: "",
      regionId: "",
      statusId:""
    },
    validationSchema: validationSchemaZone,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const zone = zones.find(
            (r) => r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (zone) {
            setIsLoading(false);
            formikZone.setErrors({ name: "Duplicate Zone not allowed!" });
            return;
          }
          values.statusId = 1;
          await addZone(values);
            setAlertMessage("Zone Data Added Successfully!");
            setAlertOpen(true);
            setAlertType("success");
          handleOpenCreatePage()
        } else {
          const zone = zones.find(
            (r) => r.Id!==Id&& r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (zone) {
            setIsLoading(false);
            formikZone.setErrors({ name: "Duplicate Zone not allowed!" });
            return;
          }
          values.Id = Id;
          await updateZone(values);
          setAlertMessage("Zone Data Update Successfully!");
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
  const formikCity = useFormik({
    initialValues: {
      name: "",
      regionId: "",
      zoneId: "",
      statusId:"",
    },
    validationSchema: validationSchemaCity,
    onSubmit: async (values) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (Id === "") {
          const city = citys.find(
            (r) => r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (city) {
            setIsLoading(false);
            formikCity.setErrors({ name: "Duplicate City not allowed!" });
            return;
          }
          values.statusId = 1;
          await addCity(values);
            setAlertMessage("City Data Added Successfully!");
            setAlertOpen(true);
          setAlertType("success");
          handleOpenCreatePage();
       
        } else {
          const city = citys.find(
            (r) => r.Id!==Id&& r.name.toLowerCase() === values.name.toLowerCase()
          );
          if (city) {
            setIsLoading(false);
            formikCity.setErrors({ name: "Duplicate City not allowed!" });
            return;
          }
          values.Id = Id;
          await updateCity(values);
          setAlertMessage("City Data Update Successfully!");
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

  const handleDeleteCity = async (id) => {
    setIsLoading(true);
    try {
      let deleteCity = citys.find((city) => city.Id === id);
    deleteCity.statusId = 2;
    await updateCity(deleteCity);
    setAlertMessage("City Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };
  const handleDeleteZone = async (id) => {
    setIsLoading(true);
    try {
        let deleteZone = zones.find((zone) => zone.Id === id);
    deleteZone.statusId = 2;
    await updateZone(deleteZone);
    setAlertMessage("Zone Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
    } catch (error) {
      setIsError(true)
    }
    setIsLoading(false);
  
  };
  const handleDeleteRegion = async (id) => {
    setIsLoading(true);
    try {
      let deleteRegion = regions.find((region) => region.Id === id);
    deleteRegion.statusId = 2;
    await updateRegion(deleteRegion);
    setAlertMessage("Region Data Delete Successfully!");
    setAlertOpen(true);
    setAlertType("success");
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleOpenCreatePage = () => {
    formikRegion.resetForm();
    formikZone.resetForm();
    formikCity.resetForm();
    setOpenCreatePage(!openCreatePage);
  };
  const handleOpenCityUpdatePage = (data) => {
    const { name, regionId, zoneId, Id } = data;
    setId(Id);
    formikCity.setValues({
      name,
      regionId,
      zoneId,
    });
    setOpenCreatePage(true);
  };
  const handleOpenZoneUpdatePage = (data) => {
    const { name, regionId, Id } = data;
    setId(Id);
    formikZone.setValues({
      name,
      regionId,
    });
    setOpenCreatePage(true);
  };
  const handleOpenRegionUpdatePage = (data) => {
    const { name, Id } = data;
    setId(Id);
    formikRegion.setValues({
      name,
    });
    setOpenCreatePage(true);
  };

  if (isLoading||cityIsLoading||regionIsLoading||zoneIsLoading) return <LoadingPage/>;
  if (isError||cityIsError||regionIsError||zoneIsError) return <ErrorPage/>;

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
            {activePage === 1 && (
              <>
                {!openCreatePage ? (
                  <CityTable
                    citys={citys}
                    zones={zones}
                    regions={regions}
                    handleCreate={handleOpenCreatePage}
                    handleUpdate={handleOpenCityUpdatePage}
                    handleDeleteCity={handleDeleteCity}
                  />
                ) : (
                  <CityCreate
                    zones={zones.filter((data) => data.statusId === 1)}
                    regions={regions.filter((data) => data.statusId === 1)}
                    handleCreate={handleOpenCreatePage}
                    formik={formikCity}
                    isLoading={isLoading}
                    Id={Id}
                  />
                )}
              </>
            )}
            {activePage === 2 && (
              <>
                {!openCreatePage ? (
                  <ZoneTable
                    zones={zones.filter((data) => data.statusId === 1)}
                    regions={regions}
                    handleCreate={handleOpenCreatePage}
                    handleUpdate={handleOpenZoneUpdatePage}
                    handleDeleteZone={handleDeleteZone}
                  />
                ) : (
                  <ZoneCreate
                    regions={regions.filter((data) => data.statusId === 1)}
                    handleCreate={handleOpenCreatePage}
                    formik={formikZone}
                    isLoading={isLoading}
                    Id={Id}
                  />
                )}
              </>
            )}
            {activePage === 3 && (
              <>
                {!openCreatePage ? (
                  <RegionTable
                    regions={regions.filter((data) => data.statusId === 1)}
                    handleCreate={handleOpenCreatePage}
                    handleUpdate={handleOpenRegionUpdatePage}
                    handleDeleteRegion={handleDeleteRegion}
                  />
                ) : (
                  <RegionCreate
                    handleCreate={handleOpenCreatePage}
                    formik={formikRegion}
                    isLoading={isLoading}
                    Id={Id}
                  />
                )}
              </>
            )}
          </ThemeProvider>
        </Box>{" "}
      </center>
    </div>
  );
};

export default CityPage;
