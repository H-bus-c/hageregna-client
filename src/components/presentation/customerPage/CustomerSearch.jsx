import React from "react";
//import EtDatePicker from "mui-ethiopian-datepicker";
import { styled } from "@mui/system";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Slide,
  Fade,
  Grow,
  MenuItem,
  Autocomplete,
  Box,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  DirectionsBus,
  DepartureBoardOutlined,
  SwapHorizontalCircleOutlined,
} from "@mui/icons-material";
import {
  EthiopianCalendarPicker,
  menuItem,
} from "../../../services/InputValue";

const CustomerSearch = ({
  formik,
  originCitys,
  destinationCitys,
  handleOriginCity,
  handleDestinationCity,
  buss,
  citys,
  swapLocations,
  isLoading,
  responsive,
  userType
}) => {
  const AnimatedPaper = styled(Paper)(({ theme }) => {
    return {
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 3px 5px 2px rgba(0,0,0,0.2)",
      },
    };
  });
  return (
    <Container maxWidth="lg" >
      <Grid container spacing={3} >
        <Grid item xs={12} >
          <Slide direction="down" in timeout={800}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                color: "rgb(255, 255, 255)",
                fontWeight: 900,
                fontSize: {
                  xs: 36,
                  sm: 40, //500
                  md: 44, //768
                  lg: 48, //1024
                },

                textShadow: "2px 2px 4px rgb(0, 0, 0)",
                letterSpacing: "1.5px",
              }}
            >
              Book Bus Tickets
            </Typography>
          </Slide>

          <Fade in timeout={1200}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "rgb(255, 255, 255)",
                mb: 4,
                fontWeight: 500,
                fontSize: {
                  xs: 24,
                  sm: 26, //500
                  md: 32, //768
                  lg: 36, //1024
                },
                textShadow: "2px 2px 4px rgb(0, 0, 0)",
              }}
            >
              Safe, Affordable & Reliable Bus Travel
            </Typography>
          </Fade>

          <Grow in timeout={1600} >
            <div>
              <AnimatedPaper
                elevation={6}
                sx={{
                  pl: 3,
                  py: 4,
                  pr: responsive.isTablet ? 3 : 1,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  minWidth:340
                }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <Grid
                    container
                    spacing={
                      responsive.isTablet && !responsive.isMobile ? 3 : 1
                    }
                    alignItems="center"
                  >
                    <Grid
                      item
                      lg={2.5}
                      xs={responsive.isTablet ? 12 : 0}
                      md={responsive.isTablet ? 5 : 0}
                      sm={responsive.isTablet ? 5 : 0}
                      mt={responsive.isTablet ? 1 : 0}
                    >
                      <Autocomplete
                        readOnly={!(userType===1||userType===4)}
                        options={originCitys||[]}
                        getOptionLabel={(option) => option?.name}
                        value={
                          !formik.values.origin ? null : formik.values.origin
                        }
                        onChange={(_, value) => {
                          handleOriginCity(value);
                          return formik.setFieldValue("origin", value);
                        }}
                        onBlur={formik.handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "rgba(0,0,0,0.5)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(207, 49, 255, 0.9)",
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="From"
                            name="origin"
                            error={
                              formik.touched.origin &&
                              Boolean(formik.errors.origin)
                            }
                            helperText={
                              formik.touched.origin && formik.errors.origin
                                ? `${formik.errors.origin}`
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={responsive.isTablet ? 12 : 0}
                      mt={responsive.isTablet ? 1 : 0}
                      md={responsive.isTablet ? 2 : 0}
                      sm={responsive.isTablet ? 2 : 0}
                      lg={1}
                      sx={{
                        textAlign: "center",
                        margin: { lg: "0 -20px 0 -20px" },
                      }}
                    >
                      <center>
                        <IconButton onClick={() => {
                          if (userType !==1) return;
                          swapLocations();
                        }}>
                          <SwapHorizontalCircleOutlined
                            sx={{
                              fontSize: 32,

                              color: "rgba(3, 26, 158, 0.91)",
                              transition: "all 0.3s ease", // Optional: Add a smooth transition for the color change

                              "&:hover": {
                                color: "rgba(156, 3, 202, 0.95)", // Change to your desired color
                                transform: "scale(1.2)",
                              },
                            }}
                          />
                        </IconButton>
                      </center>
                    </Grid>

                    <Grid
                      item
                      lg={2.5}
                      xs={responsive.isTablet ? 12 : 0}
                      md={responsive.isTablet ? 5 : 0}
                      sm={responsive.isTablet ? 5 : 0}
                      mt={responsive.isTablet ? 1 : 0}
                    >
                      <Autocomplete
                        readOnly={userType===2?true:false}
                        options={
                          (!formik.values.origin ? citys : destinationCitys)||[]
                        }
                        getOptionLabel={(option) => option?.name}
                        value={
                          !formik.values.destination
                            ? null
                            : formik.values.destination
                        }
                        onChange={(event, value) => {
                          handleDestinationCity(value);
                          return formik.setFieldValue("destination", value);
                        }}
                        onBlur={formik.handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(0,0,0,0.5)" },
                            "&:hover fieldset": {
                              borderColor: "rgba(207, 49, 255, 0.9)",
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="To"
                            name="destination"
                            error={
                              formik.touched.destination &&
                              Boolean(formik.errors.destination)
                            }
                            helperText={
                              formik.touched.destination &&
                              formik.errors.destination
                                ? `${formik.errors.destination}`
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      lg={2}
                      xs={responsive.isTablet ? 12 : 0}
                      md={responsive.isTablet ? 4 : 0}
                      sm={responsive.isTablet ? 6 : 0}
                      mt={responsive.isTablet ? 1 : 0}
                    >
                      <EthiopianCalendarPicker
                        name="travelDate"
                        value={formik.values.travelDate}
                        label="Travel Date"
                        pastDay={false}
                        onBlur={(valid) =>
                          formik.setFieldTouched("travelDate", valid)
                        }
                        onChange={(val) =>
                          formik.setFieldValue("travelDate", val)
                        } // val = ISO string
                        error={
                          formik.touched.travelDate &&
                          Boolean(!formik.values.travelDate)
                        }
                        errorText={
                          formik.touched.travelDate &&
                          Boolean(!formik.values.travelDate)
                            ? formik.errors.travelDate
                            : ""
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      lg={2}
                      xs={responsive.isTablet ? 12 : 0}
                      md={responsive.isTablet ? 4 : 0}
                      sm={responsive.isTablet ? 6 : 0}
                      mt={responsive.isTablet ? 1 : 0}
                    >
                      <TextField
                        fullWidth
                        label="Departure Time"
                        type="time"
                        variant="outlined"
                        value={formik.values.departureTime}
                        name="departureTime"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        select
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DepartureBoardOutlined color="success" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(0,0,0,0.5)" },
                            "&:hover fieldset": {
                              borderColor: "rgba(207, 49, 255, 0.9)",
                            },
                          },
                        }}
                        error={
                          formik.touched.departureTime &&
                          Boolean(formik.errors.departureTime)
                        }
                        helperText={
                          formik.touched.departureTime &&
                          formik.errors.departureTime
                        }
                      >
                        {buss?.map((bus, index) => (
                          <MenuItem key={index} value={index} sx={menuItem()}>
                            {`${bus.split("-")[1]} (${bus.split("-")[0]})`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid
                      item
                      lg={2}
                      xs={responsive.isTablet ? 12 : 0}
                      md={responsive.isTablet ? 4 : 0}
                      sm={responsive.isTablet ? 12 : 0}
                      mt={responsive.isTablet ? 4 : 3}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        size="medium"
                        type="submit"
                        disabled={isLoading}
                        sx={{
                          marginTop: "-25px",
                          width: { sm: "100%", xs: "100%" },
                          py: 2,
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, 0.3)",
                          },
                        }}
                        startIcon={<DirectionsBus />}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </AnimatedPaper>
            </div>
          </Grow>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerSearch;
