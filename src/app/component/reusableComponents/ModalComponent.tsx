'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { Checkbox, FormControlLabel } from '@mui/material';
import Comments from '../cardbody/Comments';

interface Props{
  open:boolean,
  onClose:()=>void;
  title?:string;
  children:React.ReactNode;
}   
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65%',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius:'10px',
  boxShadow: 24,
  padding:'1rem 2rem',
 outline:'none',
};

const ModalComponent:React.FC<Props>=({open, onClose,title,children})=>{

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
      
        <Box sx={style}>
                {title && (
        <FormControlLabel
          label={title}
          control={
            <Checkbox
              icon={<PanoramaFishEyeIcon />}
              checkedIcon={<CheckCircleIcon sx={{color:'green'}}/>}
            />
          }
          sx={{"& .MuiFormControlLabel-label":{
            fontSize:'2rem',
          }}}
        />
      )}
      {children}
          </Box>
     
      </Modal>
    </div>
  );
}
export default ModalComponent;