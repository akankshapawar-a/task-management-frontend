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
import AttachmentComponent from '../addOptions/Attachment';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/Redux/cards.Type';
import AddIcon from '@mui/icons-material/Add';
import moment from "moment";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TipTapFullEditor from './TextArea';

interface CardBodyProps {
  cardId: string;
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
  const [selectedStartDate, setSelectStartDate] = useState('');
  const [selectDueDate, setSelectDueDate] = useState('');
  const { columns } = useSelector((state: RootState) => state.board);
  const [description, setDescription] = useState('');
  const [showEditor, setShowEditior] = useState(false);
  
  const [attachmentCount, setAttachmentCount] = useState(0); // Track attachments

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
      } else {
        setSelectedLabels([]);
        setUsedButton(prev => prev.filter(btn => btn !== 'labels'));
      }

      if (currentCard.startDate) {
        setSelectStartDate(currentCard.startDate);
        setUsedButton(prev => prev.includes('date') ? prev : [...prev, 'date']);
      } else {
        setSelectStartDate('');
      }

      if (currentCard.dueDate) {
        setSelectDueDate(currentCard.dueDate);
        setUsedButton(prev => prev.includes('date') ? prev : [...prev, 'date']);
      } else {
        setSelectDueDate('');
      }

    if (!currentCard.startDate && !currentCard.dueDate) {
      setUsedButton(prev => prev.filter(btn => btn !== 'date'));
    }

     // Check for attachments
      if (currentCard.attachments && currentCard.attachments.length > 0) {
        setAttachmentCount(currentCard.attachments.length);
        setUsedButton(prev => prev.includes('attachment') ? prev : [...prev, 'attachment']);
      } else {
        setAttachmentCount(0);
        setUsedButton(prev => prev.filter(btn => btn !== 'attachment'));
      }

    console.log(currentCard.description);
    if(currentCard.description){
      setDescription(currentCard.description);
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
        return <Date cardId={cardId} onClose={handleClose} />;
      case 'checklist':
        return <p>Checklist</p>;
      case 'attachment':
        return <AttachmentComponent cardId={cardId} onClose={handleClose} />;
      default:
        return null;
    }
  };

  const ShowDate = (startDate?: string, dueDate?: string) => {
    if (!startDate && !dueDate) return null;
    if (!startDate) return <><p className='text-sm text-gray-400'>Due Date</p><div className=" flex space-x-1" style={{backgroundColor:'#DADADA',alignItems:'center',borderRadius:'6px'}}><p className='text-base pt-0.5 pl-2'>{moment(dueDate).format('MMM DD')}</p> <IconButton sx={{ backgroundColor: 'transparent', borderRadius: '5px' }} onClick={(event) => handleOpen(event, 'date')}>
      <KeyboardArrowDownIcon />
    </IconButton></div></>;
    else if (!dueDate) return <><p className='text-sm text-gray-400'>Start Date</p><div className=" flex space-x-1"style={{backgroundColor:'#DADADA',alignItems:'center',borderRadius:'6px'}} ><p className='text-base pt-0.5 pl-2' >{moment(startDate).format('MMM DD')}</p> <IconButton sx={{ backgroundColor: 'transparent', borderRadius: '5px' }} onClick={(event) => handleOpen(event, 'date')}>
      <KeyboardArrowDownIcon />
    </IconButton></div></>;
    else return <><p className='text-sm text-gray-400'>Dates</p><div className=" flex space-x-1" style={{backgroundColor:'#DADADA',alignItems:'center',borderRadius:'6px'}}><p className='text-base pt-0.5 pl-2'>{moment(startDate).format('MMM DD')}-{moment(dueDate).format('MMM DD')}</p> <IconButton sx={{ backgroundColor: 'transparent', borderRadius: '5px' }} onClick={(event) => handleOpen(event, 'date')}>
      <KeyboardArrowDownIcon />
    </IconButton></div></>;
  }

  const availableBtn = addTaskBtnLabel.filter(btn => !usedButton.includes(btn.value));

  return (
    <div className='flex gap-8 w-full h-[50vh] overflow-hidden'>
      <div className="w-1/2 pr-8 border-r border-gray-200 overflow-y-auto ">
        <div className='flex space-x-2.5'>
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
                  <IconButton sx={{ backgroundColor: 'transparent', borderRadius: '5px' }} onClick={(event) => handleOpen(event, 'labels')}>
                    <AddIcon />
                  </IconButton>
                </div>
              </div>}

            <div className=' align-middle my-10 flex'>
              <p>{ShowDate(selectedStartDate, selectDueDate)}</p>
            </div>

            {/* Display Attachments Section */}
            {attachmentCount > 0 &&
              <div className='mb-6'>
                <p className='text-sm text-gray-400'>Attachments</p>
                <div className='flex items-center space-x-2 pt-1.5'>
                  <div className='flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-2'>
                    <AttachFileIcon sx={{ fontSize: 20, color: '#626f86' }} />
                    <span className='text-sm font-medium'>{attachmentCount} file{attachmentCount > 1 ? 's' : ''}</span>
                  </div>
                  <IconButton
                    sx={{ backgroundColor: 'transparent', borderRadius: '5px' }}
                    onClick={(event) => handleOpen(event, 'attachment')}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
            }
          </div>

          <div className='flex justify-between pt-2'>
            <div className='flex space-x-2 pt-2'>
              <DescriptionOutlinedIcon sx={{ color: '#626f86' }} />
              <p className=' text-xl'>Description</p>
            </div>
            <div>
              <Button sx={{ background: "#0515240F", textTransform: "capitalize" }} onClick={() => setShowEditior(true)}>Edit</Button>
            </div>
          </div>
          {!description || showEditor ?<TipTapFullEditor cardId={cardId} showEditor={showEditor} setShowEditior={setShowEditior} initalValue={description} type='description' />:  <div className='ml-8 mt-3'>
        <div dangerouslySetInnerHTML={{ __html: description}} />
      </div>}
        </div>
      </div>

      <div className=' w-2/5 pl-4 overflow-y-auto'>
        <Comments cardIds={cardId}/>
      </div>
      <Poppers anchorEl={anchorEl} onClose={handleClose} title={activeBtn}>
        {handlePOpperScreen(activeBtn)}
      </Poppers>
    </div>
  );
}

export default CardBody;

