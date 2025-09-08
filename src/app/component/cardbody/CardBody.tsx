'use client'
import { Box, Button, IconButton } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState, useMemo } from 'react'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Comments from './Comments';
import Poppers from '../reusableComponents/Popper';
import LabelIcon from '@mui/icons-material/Label';
import Labels from '../addOptions/Labels';
import Date from '../addOptions/Date';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/Redux/cards.Type';
import AddIcon from '@mui/icons-material/Add';

interface CardBodyProps {
  cardId: string,
}

const CardBody: React.FC<CardBodyProps> = ({ cardId }) => {
  const addTaskBtnLabel = [
    { label: 'Labels', value: 'labels', icon: <LabelIcon /> },
    { label: 'Date', value: 'date', icon: <AccessTimeIcon /> },
    { label: 'Checklist', value: 'checklist', icon: <ChecklistIcon /> },
    { label: 'Attachment', value: 'attachment', icon: <AttachFileIcon /> },
  ];

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [usedButton, setUsedButton] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<{ labelColor: string, labelTitle: string }[]>([]);
  const { columns } = useSelector((state: RootState) => state.board);

  const currentCard = useMemo(() => {
    for (const column of columns) {
      const card = column.cards.find(c => c._id === cardId);
      if (card) return card;
    }
    return null;
  }, [columns, cardId]);

useEffect(() => {
  if (currentCard) {
    if (currentCard.label && currentCard.label.length > 0) {
      setSelectedLabels(currentCard.label.map(l => ({
        labelColor: l.labelColor,
        labelTitle: l.labelTitle
      })));
      setUsedButton(prev => {
        if (!prev.includes('labels')) {
          return [...prev, 'labels'];
        }
        return prev;
      });
    }
  }
}, [currentCard]);


  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    if (activeBtn === value) {
      setActiveBtn(null);
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
      setActiveBtn(value);
      if (!usedButton.includes(value)) {
        setUsedButton(prev => [...prev, value]);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePOpperScreen = (activeBtn: string | null) => {
    switch (activeBtn) {
      case 'labels':
        return <Labels cardId={cardId} onClose={handleClose} />;
      case 'date':
        return <Date />;
      case 'checklist':
        return <p>Checklist</p>;
      case 'attachment':
        return <p>Attachments</p>;
      default:
        return null;
    }
  };

  const availableBtn = addTaskBtnLabel.filter(btn => !usedButton.includes(btn.value));

  return (
    <div className='flex space-x-9'>
      <div>
        <div className='flex space-x-2.5 pl-8'>
          {availableBtn.map((btn, index) => {
            const Icon = btn.icon;
            return (
              <Box key={index} sx={{ paddingTop: '1rem' }}>
                <Button
                  key={btn.value}
                  startIcon={Icon}
                  sx={{
                    color: '#626f86',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DADADA'
                  }}
                  onClick={(event) => handleOpen(event, btn.value)}
                >
                  {btn.label}
                </Button>
              </Box>
            )
          })}
        </div>

        <div>
          {selectedLabels.length > 0 &&
            <div>
              <p className='pt-2 text-gray-400'>Labels</p>
              <div className='flex space-x-1 pt-1.5'>
                {selectedLabels.map((label, index) => (
                  <div key={index} style={{
                    backgroundColor: label.labelColor,
                    borderRadius: '5px',
                    padding: '0.6rem 1rem'
                  }}>
                    {label.labelTitle}
                  </div>
                ))}
                <IconButton sx={{ backgroundColor: 'transparent', borderRadius: '5px' }}  onClick={(event) => handleOpen(event , 'labels')}>
                  <AddIcon />
                </IconButton>
              </div>
            </div>}
          <div className='flex space-x-2 pt-14'>
            <DescriptionOutlinedIcon sx={{ color: '#626f86' }} />
            <p className=' text-xl'>Description</p>
          </div>
        </div>
      </div>

      <div className=' ml-4'>
        <Comments />
      </div>

      <Poppers anchorEl={anchorEl} onClose={handleClose} title={activeBtn}>
        {handlePOpperScreen(activeBtn)}
      </Poppers>
    </div>
  );
}

export default CardBody;
