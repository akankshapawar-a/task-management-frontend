'use client'
import { Box, Button, Typography } from '@mui/material'
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React from 'react'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Comments from './Comments';
import Poppers from '../reusableComponents/Popper';

const CardBody = () => {
    const addTaskBtnLabel=[
    {label:'Labels',value:'labels', icon:<AddIcon/>},
    {label:'Date',value:'date',icon:<AccessTimeIcon/>},
    {label:'Checklist',value:'checklist',icon:<ChecklistIcon/>},
    {label:'Attachment',value:'attachment',icon:<AttachFileIcon/>},
];
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen=(event:React.MouseEvent<HTMLButtonElement>)=>{
    setOpen((prev)=>!prev);
    setAnchorEl(event.currentTarget);
  }
  return (
  <div className='flex space-x-9'>
    <div>
    <div className='flex space-x-2.5 pl-8'>
      {addTaskBtnLabel.map((btn,index)=>{
     const Icon=btn.icon;
     return(<Box key={index} sx={{paddingTop:'1rem'}}>
        <Button key={btn.value} startIcon={Icon} sx={{color:'#626f86',backgroundColor:'#FFFFFF',
          border:'1px solid #DADADA'
        }} onClick={handleOpen}>{btn.label}</Button>
      </Box>
      
      )
    })}
    
    </div>
    <div>
      <div className='flex space-x-2 pt-14'>
        <DescriptionOutlinedIcon sx={{color:'#626f86'}}/>
        <p className=' text-xl'>Description</p>
      </div>
      <div>
      {/* textarea */}
      </div>
    </div> 
    </div>
    <div className=' ml-4'>
      <Comments/>
    </div>
 </div>
  );
}

export default CardBody
