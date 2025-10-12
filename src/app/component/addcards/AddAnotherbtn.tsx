'use client'
import { Button } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
interface Props{
  onClick:()=>void;
}
const AddAnotherbtn:React.FC<Props> = ({onClick}) => {
    
  
  return (
     <div className='w-2xs'>
             <Button startIcon={<AddIcon />} sx={{
                      textTransform: 'capitalize', color: 'black', backgroundColor: '#ffffff3d',
                     width: '100%',
                      borderRadius: '10px',
                      justifyContent: 'left',
                      padding: '4px 10px',
                      border:'2px solid #ffffff3d',
                      '& hover': {
                          backgroundColor: 'transparent'
                      }
                  }}
                  onClick={onClick}>Add another Card</Button>
          </div>
  )
}

export default AddAnotherbtn
