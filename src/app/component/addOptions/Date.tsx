'use client'
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { FETCH_ALL_CARDS_DATA } from '@/app/Redux/CardsReducer';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { RootState } from '@/app/Redux/cards.Type';
interface DateProps {
  cardId: string;
  onClose?: () => void;
}

const Date: React.FC<DateProps> = ({ cardId, onClose }) => {
  const [selectStartDate, setSelectStartDate] = React.useState<Dayjs | null>(null);
  const [selectDueDate, setSelectDueDate] = React.useState<Dayjs | null>(null);
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.board);
  const card = columns.flatMap(col => col.cards).find(card => card._id === cardId);

  const refreshBoard = async (token: string) => {
    const boardResponse = await axios.get('http://127.0.0.1:5000/api/board', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (boardResponse.data.status === 'SUCCESS') {
      dispatch({ type: FETCH_ALL_CARDS_DATA, payload: boardResponse.data.columns });
    }
  };

React.useEffect(()=>{
  if (card) {
    setSelectStartDate(card.startDate ? dayjs(card.startDate) : null);
    setSelectDueDate(card.dueDate ? dayjs(card.dueDate) : null);
  }
},[card]);

  const handleSaveDates = async () => {
    const payload = {
      startDate: selectStartDate ? selectStartDate.toISOString() : null,
      dueDate: selectDueDate ? selectDueDate.toISOString() : null,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        `http://127.0.0.1:5000/api/cards/dates/${cardId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'SUCCESS') {
        await refreshBoard(token);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error updating dates:', error);
    }
  };

    const handleRemoveDate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.delete(
        `http://127.0.0.1:5000/api/cards/delete/date/${cardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'SUCCESS') {
        await refreshBoard(token);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error updating dates:', error);
    }
  };

    
  return (
    <>
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Start Date"
            value={selectStartDate}
            onChange={(newValue) => setSelectStartDate(newValue)}
            slotProps={{
              field: { clearable: true }, 
            }}
          />
        </DemoContainer>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Due Date"
            value={selectDueDate}
            onChange={(newValue) => setSelectDueDate(newValue)}
            slotProps={{
              field: { clearable: true }, 
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

      <Box>
        <Button
          variant="contained"
          sx={{ width: '100%', margin: '0.7rem 0rem' }}
          onClick={handleSaveDates}
        >
          Save
        </Button>
        <Button sx={{backgroundColor:'#d2d6dc4f', color:'black',width:'100%'}} onClick={handleRemoveDate}>Remove</Button>

      </Box>
      </Box>
     
    </>
  );
};

export default Date;
