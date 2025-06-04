import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ErrorPage = ({ message = "Something went wrong!", onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography color="error" variant="h5">
        ❌ {message}
      </Typography>
      {onRetry && (
        <Button onClick={onRetry} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorPage;
