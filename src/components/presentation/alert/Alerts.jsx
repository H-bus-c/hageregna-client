import { Alert, Snackbar } from "@mui/material";
import React from "react";

const Alerts = ({ open, setOpen, message, type }) => {
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={type}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Alerts;
