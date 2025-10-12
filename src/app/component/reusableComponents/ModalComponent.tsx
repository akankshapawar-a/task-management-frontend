'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { Checkbox, Divider, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateCardStatus } from '@/app/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_ALL_CARDS_DATA } from '@/app/Redux/CardsReducer';
import { RootState } from '@/app/Redux/cards.Type';
interface Props{
  open:boolean,
  onClose:()=>void;
  title?:string;
  children:React.ReactNode;
  cardId:string;
  initialComplete?:boolean
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

const ModalComponent:React.FC<Props>=({open, onClose,title,children,cardId,initialComplete=false})=>{
   const [complete, setComplete] = React.useState(initialComplete);
   const dispatch=useDispatch();
     const { columns } = useSelector((state: RootState) => state.board);
  const handleClose=()=>{
  onClose();
  };
  const currentCard = React.useMemo(() => {
      for (const column of columns) {
        const card = column.cards.find(c => c._id === cardId);
        if (card) return card;
      }
      return null;
    }, [columns, cardId]);

React.useEffect(() => {
  if (currentCard) {
    setComplete(currentCard.complete ?? false);
  }
}, [currentCard]);

const handleToggleComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const newStatus = e.target.checked;
  setComplete(newStatus);

  const res = await updateCardStatus(cardId, newStatus);
  if (res.status === "SUCCESS") {
    // Update Redux locally (optional optimization)
    dispatch({
      type: FETCH_ALL_CARDS_DATA,
      payload: columns.map(col => ({
        ...col,
        cards: col.cards.map(card =>
          card._id === cardId ? { ...card, complete: newStatus } : card
        )
      })),
    });
  } else {
    console.error("Error updating card status");
  }
};

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style}>
          {/* <CloseIcon sx={{float:'right'}}/> */}
           <IconButton aria-label="delete" sx={{float:'right'}} onClick={handleClose}>
        <CloseIcon/>
      </IconButton>
                {title && (
        <><FormControlLabel
              label={title}
              control={<Checkbox
                icon={<PanoramaFishEyeIcon />}
                checkedIcon={<CheckCircleIcon sx={{ color: 'green' }} />}
                checked={complete}
                onChange={handleToggleComplete} />}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: '2rem',
                }
              }} /><Divider sx={{ my: 2 }} /></>
      )}
      {children}
          </Box>
     
      </Modal>
    </div>
  );
}
export default ModalComponent;