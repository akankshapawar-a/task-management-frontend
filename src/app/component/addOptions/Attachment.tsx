/* eslint-disable @typescript-eslint/no-explicit-any */
// components/addOptions/Attachment.tsx
import React, { useState, useRef } from 'react';
import { Box, Button, LinearProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

interface AttachmentProps {
  cardId: string;
  onClose: () => void;
  onAttachmentChange?: () => void; // Callback to notify parent of changes
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

const Attachment: React.FC<AttachmentProps> = ({ cardId, onClose, onAttachmentChange }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchAttachments();
  }, [cardId]);

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attachments/${cardId}`);
      setAttachments(response.data.attachments || []);
    } catch (err) {
      console.error('Error fetching attachments:', err);
      setError('Failed to load attachments');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_URL}/api/attachments/${cardId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      setAttachments(response.data.card.attachments);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component of the change
      if (onAttachmentChange) {
        onAttachmentChange();
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/attachments/${cardId}/${attachmentId}`
      );
      setAttachments(response.data.card.attachments);
      setError(null);

      // Notify parent component of the change
      if (onAttachmentChange) {
        onAttachmentChange();
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete attachment');
    }
  };

  const handleDownload = async (attachmentId: string, fileName: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/attachments/${cardId}/${attachmentId}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: 320, p: 2 }}>
      <div className="flex justify-between items-center mb-4">
       
        {/* <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton> */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
      />

      <Button
        fullWidth
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleFileSelect}
        disabled={uploading}
        sx={{
          mb: 2,
          backgroundColor: '#0079BF',
          '&:hover': {
            backgroundColor: '#026AA7',
          },
        }}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>

      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <p className="text-sm text-center mt-1">{uploadProgress}%</p>
        </Box>
      )}

      {/* <div className="space-y-2 max-h-96 overflow-y-auto">
        {attachments.length === 0 && !uploading && (
          <p className="text-center text-gray-500 py-4">No attachments yet</p>
        )}

        {attachments.map((attachment) => (
          <div
            key={attachment._id}
            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <InsertDriveFileIcon sx={{ fontSize: 40, color: '#626f86' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.fileSize)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-1">
                <IconButton
                  size="small"
                  onClick={() => handleDownload(attachment._id, attachment.fileName)}
                  title="Download"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(attachment._id)}
                  title="Delete"
                  sx={{ color: '#e53e3e' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </Box>
  );
};

export default Attachment;