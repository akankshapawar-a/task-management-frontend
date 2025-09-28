'use client'
import { LabelData, RootState } from '@/app/Redux/cards.Type';
import { FETCH_ALL_CARDS_DATA } from '@/app/Redux/CardsReducer';
import { Box, Button, Checkbox, Tooltip } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.board);
  const currentCard = columns.flatMap(col => col.cards).find(card => card._id === cardId);

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
    } else {
      setSelectedLabels([]);
    }
  }, [currentCard]);

  const isLabelSelected = (labelColor: string, labelTitle: string) => {
    return selectedLabels.some(label => 
      label && 
      label.labelColor === labelColor && 
      label.labelTitle === labelTitle
    );
  };

  const handleLabelToggle = (labelColor: string, labelTitle: string) => {
    const isSelected = isLabelSelected(labelColor, labelTitle);
    
    if (isSelected) {
      // Remove the label if it's already selected
      setSelectedLabels(prev => 
        prev.filter(label => 
          label && !(label.labelColor === labelColor && label.labelTitle === labelTitle)
        )
      );
    } else {
      // Add the label if it's not selected
      setSelectedLabels(prev => [...prev, { labelColor, labelTitle }]);
    }
  };

  const handleSaveLabels = async () => {
    setLoading(true);
    
    // Filter out any null/undefined labels before sending
    const validLabels = selectedLabels.filter(label => 
      label && 
      label.labelColor && 
      label.labelTitle
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
        
        {/* Debug info - remove this in production */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Selected: {selectedLabels.length} labels
        </div>
        
        {filteredLabels.map((item, index) => (
          <Box key={index}>
            <Tooltip title={item.label}>
              <Box 
                sx={{ 
                  display: "flex", 
                  marginBottom: '10px', 
                  cursor: 'pointer',
                  alignItems: 'center'
                }} 
                // onClick={() => handleLabelToggle(item.color, item.label)}
              >
                <Checkbox 
                  size='medium'
                  checked={isLabelSelected(item.color, item.label)}
                  onChange={() => handleLabelToggle(item.color, item.label)}
                />
                <Box 
                  sx={{
                    backgroundColor: item.color,
                    padding: '8px 12px',
                    borderRadius: '3px',
                    width: '100%',
                    color: item.color === '#f2d600' ? '#000' : '#fff',
                    fontWeight: 'bold'
                  }}
                >
                  <span>{item.label}</span>
                </Box>
              </Box>
            </Tooltip>
          </Box>
        ))}
        
        <Button 
          variant="contained" 
          sx={{ width: '100%', margin: '0.7rem 0rem' }}
          onClick={handleSaveLabels} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </div>
  )
}

export default Labels;