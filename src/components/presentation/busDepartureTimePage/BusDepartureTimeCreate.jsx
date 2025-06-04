import {
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import {
  AddOutlined,
  CancelOutlined,
  PunchClockOutlined,
} from "@mui/icons-material";
import { Col, Row } from "react-bootstrap";

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "15px",
  backdropFilter: "blur(5px)",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  maxWidth: "500px",
  margin:"10px 5px"
}));
const BusDepartureTimeCreate = ({
  routes,
  handleCreate,
  formik,
  isLoading,
  Id,
  departureTimes,
  busNumbers,
  handleAddDeparture,
  handleSubDeparture,
  setDepartureTimes,
  setBusNumbers,
}) => {
  return (
    <FormPaper>
      <Grid container spacing={2}>
        <Grid item sm={8} md={9} xl={11} lg={10}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "1976d2" }}>
            {Id === "" ? "Add New Departure Time" : "Edit Departure Time Data"}
          </Typography>
        </Grid>
        <Grid item sm={4} md={3} xl={1} lg={2}>
          <Button
            variant="outlined"
            sx={{
              float: "right",
              borderColor: "rgba(119, 2, 165, 0.77)",
              color: "white",
              backgroundColor: "rgba(119, 2, 165, 0.77)",
              width: { xs: "80px", lg: "90px" },
              height: { xs: "30px", md: "35px", lg: "40px" },
              "&:hover": {
                color: "white",
                borderColor: "info.main",
                backgroundColor: "info.main",
              },
            }}
            onClick={handleCreate}
          >
            <KeyboardReturnRoundedIcon fontWeight="small" />
            <Typography
              sx={{
                marginLeft: "5px",
                fontSize: { xs: "0.85rem", lg: "1.1rem" },
              }}
            >
              Back
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <hr />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1}>
          <Grid container>
            <Autocomplete
              options={routes}
              getOptionLabel={(option) =>
                `From      ${option.origin}      To      ${option.destination} `
              }
              value={!formik.values.routeId ? null : formik.values.routeId}
              onChange={(_, value) => formik.setFieldValue("routeId", value)}
              onBlur={formik.handleBlur}
              // isOptionEqualToValue={(option, value) =>
              //   option.name === value?.name
              // }
              size="small"
              sx={{
                width: "90vw",
                margin: "10px",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Route"
                  name="routeId"
                  error={
                    formik.touched.routeId && Boolean(formik.errors.routeId)
                  }
                  helperText={
                    formik.touched.routeId && formik.errors.routeId
                      ? `${formik.errors.routeId}`
                      : ""
                  }
                />
              )}
            />
          </Grid>
            <Grid container>
                      <TextField
                        required
                        type="number"
                        label="Price"
                        size="small"
                        sx={{
                          width: "90vw",
                          margin: "10px",
                        }}
                        name="basePrice"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.basePrice}
                        error={formik.touched.basePrice && formik.errors.basePrice}
                        helperText={
                          formik.touched.basePrice && formik.errors.basePrice
                            ? `${formik.errors.basePrice}`
                            : ""
                        }
                      />
                    </Grid>
          <Grid container>
            {departureTimes.map((d, i) => {
              return (
                <Row style={{ display: "flex", justifyContent: "center",textAlign:"center" }}>
                  <Col xs={1} md={1}>
                    {departureTimes.length === i + 1 ? (
                      <AddOutlined
                        onClick={(e) => handleAddDeparture()}
                        fontSize="large"
                        color="primary"
                        sx={{
                          marginLeft: {xs:"0",sm:"15px"},
                          cursor: "pointer",
                          marginTop: "10px",
                          "&: hover": {
                            backgroundColor: "rgba(255, 254, 254, 0.5)",
                            borderRadius: "20px",
                          },
                        }}
                      />
                    ) : (
                      <span style={{ marginLeft: "50px" }}></span>
                    )}
                  </Col>
                  <Col xs={5} md={4}>
                    <TextField
                      required
                      id={`kjdfs${i}`}
                      type="time"
                      label="Departure Time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      sx={{
                        margin: "10px",
                      }}
                      value={
                        departureTimes[i] === "" ? null : departureTimes[i]
                      }
                      onChange={(e) => {
                        departureTimes[i] = e.target.value;
                        setDepartureTimes([...departureTimes]);
                      }}
                    />
                  </Col>
                  <Col xs={5} md={4}>
                    <TextField
                      required
                      id={`ggdf${i}`}
                      type="number"
                      label="Bus Number"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        margin: "10px",
                      }}
                      value={busNumbers[i] === "" ? null : busNumbers[i]}
                      onChange={(e) => {
                        if (e.target.value < 0 || e.target.value > 10) {
                          busNumbers[i] = 1;
                          setBusNumbers(busNumbers);
                          return;
                        }
                        busNumbers[i] = e.target.value;
                        setBusNumbers([...busNumbers]);
                      }}
                    />
                  </Col>
                  <Col xs={1} md={1}>
                    {departureTimes.length === i + 1 && i !== 0 && (
                      <CancelOutlined
                        onClick={(e) => handleSubDeparture(i)}
                        fontSize="large"
                        color="error"
                        sx={{
                          marginLeft:{xs:"-25px"},
                          cursor: "pointer",
                          marginTop: "10px",
                          "&: hover": {
                            backgroundColor: "rgba(255, 254, 254, 0.5)",
                            borderRadius: "20px",
                          },
                        }}
                      />
                    )}
                  </Col>
                </Row>
              );
            })}
          </Grid>
          <Grid container>
            <Button
              variant="outlined"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                width: "90vw",
                margin: "10px",
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "white",
                },
              }}
            >
              {Id === "" ? "Add" : "Edit"} Bus
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormPaper>
  );
};

export default BusDepartureTimeCreate;
