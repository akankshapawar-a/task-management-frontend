'use client'
import { Box, Button, IconButton } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
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
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DateSelector from '../addOptions/Date';
interface CardBodyProps {
  cardId: string;
}

interface Attachment {
  _id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CardBody: React.FC<CardBodyProps> = ({ cardId }) => {
  const addTaskBtnLabel = [
    { label: 'Labels', value: 'labels', icon: <LabelIcon /> },
    { label: 'Date', value: 'date', icon: <AccessTimeIcon /> },
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
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentCard = useMemo(() => {
    for (const column of columns) {
      const card = column.cards.find(c => c._id === cardId);
      if (card) return card;
    }
    return null;
  }, [columns, cardId]);

  // Function to fetch fresh attachment data from API
  const fetchAttachmentsFromAPI = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attachments/${cardId}`);
      const fetchedAttachments = response.data.attachments || [];
      
      setAttachments(fetchedAttachments);
      setAttachmentCount(fetchedAttachments.length);
      
      if (fetchedAttachments.length > 0) {
        setUsedButton(prev => prev.includes('attachment') ? prev : [...prev, 'attachment']);
      } else {
        setUsedButton(prev => prev.filter(btn => btn !== 'attachment'));
      }
      
      return fetchedAttachments;
    } catch (err) {
      console.error('Error fetching attachments:', err);
      return [];
    }
  }, [cardId]);

  // Initial load and when cardId changes
  useEffect(() => {
    fetchAttachmentsFromAPI();
  }, [cardId, fetchAttachmentsFromAPI, refreshKey]);

  useEffect(() => {
    if (currentCard) {
      // Labels
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

      // Dates
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

      // Attachments - only update if local state is empty (first load)
      if (currentCard.attachments && currentCard.attachments.length > 0) {
        if (attachments.length === 0) {
          setAttachments(currentCard.attachments);
          setAttachmentCount(currentCard.attachments.length);
          setUsedButton(prev => prev.includes('attachment') ? prev : [...prev, 'attachment']);
        }
      } else if (attachments.length === 0) {
        setAttachments([]);
        setAttachmentCount(0);
      }

      // Description
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
    setActiveBtn(null);
  };

  // Callback when attachments are added/deleted from popup
  const handleAttachmentChange = useCallback(async () => {
    await fetchAttachmentsFromAPI();
    setRefreshKey(prev => prev + 1);
  }, [fetchAttachmentsFromAPI]);

  const handleDownload = async (attachmentId: string, fileName: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/attachments/${cardId}/${attachmentId}/download`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    }
  };

  const handleDeleteFromCard = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    const previousAttachments = [...attachments];
    const updatedAttachments = attachments.filter(att => att._id !== attachmentId);
    
    setAttachments(updatedAttachments);
    setAttachmentCount(updatedAttachments.length);
    
    if (updatedAttachments.length === 0) {
      setUsedButton(prev => prev.filter(btn => btn !== 'attachment'));
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/attachments/${cardId}/${attachmentId}`
      );
      
      if (response.data && response.data.card && response.data.card.attachments) {
        const serverAttachments = response.data.card.attachments;
        setAttachments(serverAttachments);
        setAttachmentCount(serverAttachments.length);
        
        if (serverAttachments.length === 0) {
          setUsedButton(prev => prev.filter(btn => btn !== 'attachment'));
        }
      }
      
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      console.error('Delete error:', err);
      console.error('Error details:', err.response?.data);
      
      setAttachments(previousAttachments);
      setAttachmentCount(previousAttachments.length);
      setUsedButton(prev => prev.includes('attachment') ? prev : [...prev, 'attachment']);
      
      alert(err.response?.data?.message || 'Failed to delete attachment. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handlePOpperScreen = (activeBtn: string | null) => {
    switch (activeBtn) {
      case 'labels':
        return <Labels cardId={cardId} onClose={handleClose} />;
      case 'date':
        return <Date cardId={cardId} onClose={handleClose} />;
      case 'attachment':
        return <AttachmentComponent cardId={cardId} onClose={handleClose} onAttachmentChange={handleAttachmentChange} />;
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

            <div className='align-middle my-10 flex'>
              <div>{ShowDate(selectedStartDate, selectDueDate)}</div>
            </div>

            {/* Display Attachments Section with Files */}
            {attachmentCount > 0 && (
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center space-x-2'>
                    <AttachFileIcon sx={{ color: '#626f86' }} />
                    <p className='text-xl'>Attachments</p>
                  </div>
                  <IconButton
                    sx={{ backgroundColor: '#0515240F', borderRadius: '5px' }}
                    onClick={(event) => handleOpen(event, 'attachment')}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </div>
                
               <div className='space-y-2 ml-8'>
  {attachments.map((attachment) => {
    const uploadDate = new globalThis.Date(attachment.uploadedAt);
    return (
      <div
        key={attachment._id}
        className='border rounded-lg p-3 hover:bg-gray-50 transition-colors'
      >
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <InsertDriveFileIcon sx={{ fontSize: 40, color: '#626f86' }} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {attachment.fileName}
            </p>
            <p className='text-xs text-gray-500'>
              {formatFileSize(attachment.fileSize)} • {uploadDate.toLocaleDateString()}
            </p>
          </div>
          <div className='flex space-x-1'>
            <IconButton
              size='small'
              onClick={() => handleDownload(attachment._id, attachment.fileName)}
              title='Download'
            >
              <DownloadIcon fontSize='small' />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => handleDeleteFromCard(attachment._id)}
              title='Delete'
              sx={{ color: '#e53e3e' }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </div>
        </div>
      </div>
    );
  })}
</div>
              </div>
            )}
          </div>

          <div className='flex justify-between pt-2'>
            <div className='flex space-x-2 pt-2'>
              <DescriptionOutlinedIcon sx={{ color: '#626f86' }} />
              <p className='text-xl'>Description</p>
            </div>
            <div>
              <Button sx={{ background: "#0515240F", textTransform: "capitalize" }} onClick={() => setShowEditior(true)}>Edit</Button>
            </div>
          </div>
          {!description || showEditor ? <TipTapFullEditor cardId={cardId} showEditor={showEditor} setShowEditior={setShowEditior} initalValue={description} type='description' /> : <div className='ml-8 mt-3'>
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

