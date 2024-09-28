/** @format */
// React Imports
import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';

// Component 
import Page from '../../layouts/components/common/Page';
import FileUpload from '../../layouts/components/FileUpload';

// Api Services
import { postDrinks, viewDrinks, updateDrinks } from '../../store/services/DrinksService';
import { postPictureAPI } from "../../store/api";
import axios from 'axios';

// Third Party Imports
import toast from 'react-hot-toast';

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form';

// Validation Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//__________________________________________________________

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const AddUpdateDrinks = () => {
  const [mode, setMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const routeParams = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
  }, [routeParams.id, reset]);

  const handleFileSelect = (filePath) => {
    setValue('file', filePath);
    setFile(filePath);
  };

  const onSubmit = async (data) => {
    setLoading(true);
  
    try {
      const drinkData = {
        name: data.name,
        description: data.description,
      };
  
      const drinkResponse = await postDrinks(drinkData);
      const drinkId = drinkResponse.data?.id;
  
      if (file && drinkId) {
        let formData = new FormData();
        formData.append('file', file, file.name);
  
        console.log('Form Data (file):', formData.get('file'));
  
        const imageResponse = await axios.post(`${API_URL}${postPictureAPI}/${drinkId}/pictures`, formData, {
          headers: {
            Accept: 'application/json',
          },
        });
        
        console.log('Image uploaded successfully:', imageResponse.data);
      }
  
      toast.success('Drink added successfully');
      navigate('/drinks-list');
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to add drink');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Page title={mode === 'create' ? 'Add Drinks' : 'Update Drinks'}>
      <Grid container spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>{mode === 'create' ? 'Add Drinks' : 'Update Drinks'}</h2>
        </Box>
        <Grid item xs={12} sx={{ mt: 5 }}>
          <Card sx={{ padding: '30px' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} className="CardPadding">
                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="text"
                              value={value}
                              onChange={onChange}
                              label="Name"
                              placeholder="Name"
                              error={!!errors.name}
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="string"
                                value={value}
                                onChange={onChange}
                                label="Description"
                                placeholder="Description"
                                error={!!errors.description}
                              />
                              {errors.description && <Typography color="error">{errors.description.message}</Typography>}
                            </>
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FileUpload onFileSelect={handleFileSelect} />
                    </Box>
                  </Grid>

                </Grid>
                <Grid item sx={6} className="CardButtonPadding">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                    <Button variant="outlined" onClick={() => navigate('/drinks-list')}>Cancel</Button>
                    <Button variant="contained" type="submit">
                      {mode === 'create' ? 'ADD DRINKS' : 'UPDATE DRINKS'}
                    </Button>
                  </Box>
                </Grid>
              </form>
            )}
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default AddUpdateDrinks;