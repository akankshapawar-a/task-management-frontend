 import React from 'react'
 import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
 const Comments = () => {
   return (
     <div>
         <div className='flex space-x-2 '>
        <ChatOutlinedIcon sx={{color:'#626f86'}}/>
        <p className=' text-xl'>Comments</p>
      </div>
       <textarea/>
     </div>
   )
 }
 
 export default Comments
 