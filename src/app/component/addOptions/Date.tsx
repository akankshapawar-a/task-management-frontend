'use client'
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button } from '@mui/material';

const Date=()=> {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Start Date" />
      </DemoContainer>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Due Date" />
      </DemoContainer>
    </LocalizationProvider>
    <Box>
        <Box>
<Button variant="contained" sx={{width:'100%',margin:'0.7rem 0rem'}}>Save</Button>
<Button sx={{backgroundColor:'#d2d6dc4f', color:'black',width:'100%'}}>Remove</Button>
  </Box>
    </Box>
    </>
  );
}
export default Date;