'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

interface Props{
  open:boolean;
  anchorEl:HTMLButtonElement|null;
children:React.ReactNode;
}
const Poppers:React.FC<Props>=({open,anchorEl,children})=>{
//   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
//   const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  
  return (
    <Box sx={{ width: 500 }}>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
            <Paper>
              {children}
            </Paper>
      </Popper>
    </Box>
  );
}

export default Poppers;