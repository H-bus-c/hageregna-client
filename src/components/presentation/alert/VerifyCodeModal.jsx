import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField,
  Button, Stack
} from '@mui/material';
import { verifySMSCode } from '../../../services/API';

const style = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const VerifyCodeModal = ({ open, setOpen, phone, onResend,handleSendData }) => {
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown

  useEffect(() => {
    if (!open) return;

    setTimeLeft(120); // reset timer on modal open
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // clean up on close
  }, [open]);

  const handleVerify = async () => {
    setVerifying(true);
    setError('');
     try {
       const value = { phone, code };
       const res = await verifySMSCode(value);
       console.log(res);
      if (!res.verify) throw new Error(res.message || 'Verification failed');
      // alert('✅ Verification successful!');
      handleSendData();
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    onResend(phone);       // calls parent resend logic
    setTimeLeft(120); // reset countdown
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <Box sx={style}>
        <Stack spacing={2}>
          <Typography variant="h6">Verify Code</Typography>
          <Typography variant="body2" color="text.secondary">
            Code expires in: <strong>{formatTime()}</strong>
          </Typography>

          <TextField
            label="Enter 6-digit Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 6 }}
            disabled={timeLeft === 0}
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={verifying || code.length !== 6 || timeLeft === 0}
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleResend}
            disabled={timeLeft !== 0}
          >
            Resend Code
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default VerifyCodeModal;
