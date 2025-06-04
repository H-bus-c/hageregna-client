import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress color="primary" />
      <Typography mt={2} fontSize={18}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingPage;
