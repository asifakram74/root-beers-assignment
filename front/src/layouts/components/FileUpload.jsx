/** @format */
// React Imports
import React, { useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onFileSelect }) => {
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFilePath(file);
      setLoading(true);
      setTimeout(() => {
        onFileSelect(file);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={loading}
      >
         {loading ? <CircularProgress size={24} /> : 'Upload slip'}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {!loading && filePath && (
        <Typography variant="body2">File selected: {filePath.name}</Typography>
      )}
      
    </div>
  );
};

export default FileUpload;
