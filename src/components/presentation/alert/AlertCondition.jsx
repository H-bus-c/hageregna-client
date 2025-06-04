import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const AlertCondition = ({ open, setOpen, message, title, handleClick ,color="textPrimary"}) => {
  return (
    <center>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle color={color}>{title}</DialogTitle>
        <DialogContent color="textPrimary">
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="primary"
            sx={{
              "&:hover": {
                border: "solid 1px rgb(2, 2, 197)",
                borderRadius: "5px",
              },
            }}
          >
            <strong>No</strong>
          </Button>
          <Button
            onClick={handleClick}
            color="error"
            sx={{
              "&:hover": {
                border: "solid 1px rgb(197, 2, 2)",
                borderRadius: "5px",
              },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </center>
  );
};

export default AlertCondition;
