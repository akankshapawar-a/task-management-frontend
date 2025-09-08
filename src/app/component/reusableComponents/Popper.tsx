'use client'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface Props {
 onClose:()=>void;
  anchorEl: HTMLElement | null; // ✅ broader type
  children: React.ReactNode;
  title?:string|null;
}

const Poppers: React.FC<Props>=({ anchorEl, children,onClose,title })=> {

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
         <Paper sx={{ padding: 2, minWidth: 300, bgcolor: "white", border: "1px solid black" ,overflow:'auto' }}>
          <Box sx={{display:'flex',justifyContent:'space-between'}}>
          <Typography variant='h5'>{title}</Typography>
            <IconButton aria-label="delete" sx={{float:'right'}} onClick={onClose}>
        <CloseIcon/>
      </IconButton>
          </Box>
       {children}
       </Paper>
      </Popover>
    </div>
  );
}

export default Poppers;