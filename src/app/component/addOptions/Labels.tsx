'use client'
import { LabelData, RootState } from '@/app/Redux/cards.Type';
import { FETCH_ALL_CARDS_DATA } from '@/app/Redux/CardsReducer';
import { Box, Button, Checkbox, IconButton, Tooltip } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Poppers from '../reusableComponents/Popper';

export const LABEL_OPTIONS = [
  { value: "green", label: "Green", color: "#61bd4f" },
  { value: "yellow", label: "Yellow", color: "#f2d600" },
  { value: "orange", label: "Orange", color: "#ff9f1a" },
  { value: "red", label: "Red", color: "#eb5a46" },
  { value: "purple", label: "Purple", color: "#c377e0" },
  { value: "blue", label: "Blue", color: "#0079bf" },
  { value: "sky", label: "Sky", color: "#00c2e0" },
  { value: "lime", label: "Lime", color: "#51e898" },
  { value: "pink", label: "Pink", color: "#ff78cb" },
  { value: "black", label: "Black", color: "#344563" },
];

interface LabelsProps {
  cardId: string;
  onClose?: () => void;
}

const Labels: React.FC<LabelsProps> = ({ cardId, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<LabelData[]>([]);
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.board);
  const currentCard = columns.flatMap(col => col.cards).find(card => card._id === cardId);
  const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
  const [editText, setEditText] = useState('');
  const [editColor, setEditColor] = useState<string | null>(null);
  
  useEffect(() => {
    if (currentCard?.label && Array.isArray(currentCard.label)) {
      const validLabels = currentCard.label.filter((label): label is LabelData => 
        label !== null && 
        label !== undefined && 
        typeof label === 'object' &&
        'labelColor' in label && 
        'labelTitle' in label
      );
      setSelectedLabels(validLabels);
      
      const titlesMap: Record<string, string> = {};
      validLabels.forEach(label => {
        if (label.labelColor && label.labelTitle) {
          titlesMap[label.labelColor] = label.labelTitle;
        }
      });
      setCustomTitles(titlesMap);
    } else {
      setSelectedLabels([]);
      setCustomTitles({});
    }
  }, [currentCard]);

  const getLabelTitle = (color: string) => {
    return customTitles[color] ||'';
  };

  const isLabelSelected = (labelColor: string) => {
    return selectedLabels.some(label => 
      label && label.labelColor === labelColor
    );
  };

  const handleLabelToggle = (labelColor: string) => {
    const isSelected = isLabelSelected(labelColor);
    
    if (isSelected) {
      setSelectedLabels(prev => 
        prev.filter(label => label && label.labelColor !== labelColor)
      );
    } else {
      const labelTitle = customTitles[labelColor] ||'';
      setSelectedLabels(prev => [...prev, { labelColor, labelTitle }]);
    }
  };

  const handleSaveLabels = async () => {
    setLoading(true);
    
    // Update selected labels with custom titles before saving
    const validLabels = selectedLabels.map(label => {
      const hasCustomTitle = customTitles.hasOwnProperty(label.labelColor) && customTitles[label.labelColor].trim() !== '';
      return {
        labelColor: label.labelColor,
        labelTitle: hasCustomTitle ? customTitles[label.labelColor] : ''
      };
    }).filter(label => 
      label.labelColor
    );
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://127.0.0.1:5000/api/addcards/label/${cardId}`,
        { labels: validLabels },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        const boardResponse = await axios.get('http://127.0.0.1:5000/api/board', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (boardResponse.data.status === 'SUCCESS') {
          dispatch({ type: FETCH_ALL_CARDS_DATA, payload: boardResponse.data.columns });
        }
        
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error saving labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (event: React.MouseEvent<HTMLElement>, color: string) => {
    setEditAnchorEl(event.currentTarget);
    setEditText('');
    setEditColor(color);
  };

  const handleCloseEdit = () => {
    setEditAnchorEl(null);
    setEditText('');
    setEditColor(null);
  };

  const handleSaveEdit = () => {
    if (!editColor) return;

    // Update custom titles map
    setCustomTitles(prev => ({
      ...prev,
      [editColor]: editText
    }));

    // Update selected labels with new title
    setSelectedLabels(prev =>
      prev.map(l =>
        l.labelColor === editColor ? { ...l, labelTitle: editText } : l
      )
    );

    handleCloseEdit();
  };

  const filteredLabels = LABEL_OPTIONS.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Box>
        <input 
          type='text' 
          placeholder='Search labels...' 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </Box>
      <Box>
        <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>Labels</p>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Selected: {selectedLabels.length} labels
        </div>
        
        {filteredLabels.map((item, index) => {
          const displayTitle = getLabelTitle(item.color);
          const isSelected = isLabelSelected(item.color);
          
          return (
            <Box key={index}>
              <Tooltip title={item.label}>
                <Box 
                  sx={{ 
                    display: "flex", 
                    marginBottom: '10px', 
                    cursor: 'pointer',
                    alignItems: 'center'
                  }} 
                >
                  <Checkbox 
                    size='medium'
                    checked={isSelected}
                    onChange={() => handleLabelToggle(item.color)}
                  />
                  <Box 
                    sx={{
                      backgroundColor: item.color,
                      padding: '16px 12px',
                      borderRadius: '3px',
                      width: '100%',
                      color: item.color === '#f2d600' ? '#000' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    <span>{displayTitle}</span>
                  </Box>
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={(e) => handleOpenEdit(e, item.color)}
                  >
                    <BorderColorIcon fontSize="inherit"/>
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          );
        })}
        
        <Button 
          variant="contained" 
          sx={{ width: '100%', margin: '0.7rem 0rem' }}
          onClick={handleSaveLabels} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
      
      <Poppers anchorEl={editAnchorEl} onClose={handleCloseEdit} title="Edit Label">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter label title"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleCloseEdit}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
          </Box>
        </Box>
      </Poppers>
    </div>
  )
}

export default Labels;