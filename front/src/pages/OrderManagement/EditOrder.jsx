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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useParams, useNavigate } from 'react-router-dom';

// Components Imports
import Page from '../../layouts/components/common/Page';
import FileUpload from '../../layouts/components/FileUpload';

// Icon
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// Api Services
import { viewBooking, updateBooking } from '../../store/services/OrdersServices';

// Third Party Imports
import toast from 'react-hot-toast';

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form';

// Yup Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserListHead } from "../../sections/index";

// __________________________________________________________

// Table Titles
let TABLE_HEAD = [
  { id: 'id', label: '#', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'fname', label: 'First Name', alignRight: false },
  { id: 'lname', label: 'Last Name', alignRight: false },
  { id: 'passport', label: 'Passport', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
];

// Sorting
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "asc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  if (!Array.isArray(array)) {
    return [];
  }
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter(
      (_Booking) => _Booking.name.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

// Validation Schema
const schema = yup.object().shape({
  status: yup.string().required('Status is required'), 
});

const UpdateBooking = () => {
  const [Booking, setBooking] = useState([]);
  const [file, setFile] = useState();

  // Pagination
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageData, setPageData] = useState({
    total: 0,
    totalPages: 0,
  });

  const handleRequestSort = (event, property) => {
    const isAsc = order !== 'asc';
    setOrder(isAsc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Booking.length) : 0;

  const filteredBookings = applySortFilter(
    Booking,
    getComparator(order, orderBy),
    filterName,
  );

  const isUserNotFound = filteredBookings.length === 0;

  // States
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const navigate = useNavigate();

  // File upload handler
  const handleFileSelect = (filePath) => {
    setValue('slip', filePath);
    setFile(filePath);
  };

  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  console.log('Form errors:', errors);
  console.log('Is form valid:', isValid);  
  // Load Booking data for editing
  useEffect(() => {
    setLoading(true);
    let params = {
      page: page + 1,
      limit: rowsPerPage,
    };
    if (typeof orderBy === 'string') {
      params.order_by = order;
      params.column_name = orderBy;
    }
    const fetchBooking = async () => {
      try {
        const Booking = await viewBooking(routeParams.id);
        setBooking(Booking);
        reset(Booking);
      } catch (error) {
        toast.error('Failed to load Booking data');
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.id) {
      fetchBooking();
    }
  }, [routeParams.id, reset]);

  const onSubmit = async (data) => {
    console.log('Form data:', data);

    const sendData = {};

    if (file) {
      sendData.slip = file;
    }
    sendData.status = data.status;

    const encodedData = JSON.stringify(sendData);

    setLoading(true);
    try {
      await updateBooking(routeParams.id, encodedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Order Updated Successfully');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Update Booking">
      <Grid container spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="h2_tag">Update Order</h2>
        </Box>
        <Grid item xs={12} sx={{ mt: 5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="MainCard" sx={{ mb: 5 }}>
                <Grid container spacing={2} className="CardPadding">

                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth>
                        <Controller
                          name="id"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="number"
                              value={value}
                              onChange={onChange}
                              label="ID"
                              placeholder="ID"
                              disabled
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
                          name="product.id"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="number"
                              value={value}
                              onChange={onChange}
                              label="Product ID"
                              placeholder="Product ID"
                              disabled
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
                          name="user.id"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="number"
                              value={value}
                              onChange={onChange}
                              label="User ID"
                              placeholder="User ID"
                              disabled
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel
                          id="validation-basic-status"
                          htmlFor="validation-basic-status"
                        >
                          Status
                        </InputLabel>
                        <Controller
                          name="status"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              defaultValue="Status"
                              value={value}
                              label="Status"
                              placeholder="Status"
                              onChange={onChange}
                              labelId="validation-basic-status"
                              aria-describedby="validation-basic-status"
                            >
                              <MenuItem value='Confirm'>Confirm</MenuItem>
                              <MenuItem value='Pending'>Pending</MenuItem>
                              <MenuItem value='Reject'>Reject</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.status && (
                          <Typography color="error">{errors.status.message}</Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box className="BoxWidth">


                      {Booking.slip ?
                        <Button
                          download target="_blank"
                          variant="contained"
                          component="a"
                          startIcon={<CloudDownloadIcon />}
                          disabled={loading}
                          href={Booking?.slip || '#'}
                        >
                          Download Slip
                        </Button>
                        :
                        <FileUpload onFileSelect={handleFileSelect} />

                      }

                    </Box>
                  </Grid>
                </Grid>
                <Grid item sx={6} className="CardButtonPadding">
                  <div className="buttons_right">
                    <Button
                      sx={{ textTransform: 'uppercase', fontWeight: '500' }}
                      className="button_margin_right"
                      variant="outlined"
                      onClick={() => navigate('/orders')}
                    >
                      Cancel
                    </Button>

                    <Button sx={{ textTransform: 'uppercase', fontWeight: '500' }} variant="contained" type="submit">
                      Update
                    </Button>
                  </div>
                </Grid>
              </Card>


            </form>
          )}

          <Box sx={{ mb: 6 }}>
            <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className='h2_tag'>Booking Items</h2>
            </Box>

            <Card sx={{ mt: 5 }}>
              <Scrollbar>
                <TableContainer>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {!loading &&
                        Booking.Booking_items?.map((row) => {
                          const {
                            id,
                            title,
                            fname,
                            lname,
                            passport,
                            type
                          } = row;
                          return (
                            <TableRow hover key={row.id} className="table-body">
                              <TableCell align="left">{id ?? "N/A"}</TableCell>
                              <TableCell align="left">{title ?? "N/A"}</TableCell>
                              <TableCell align="left">{fname ?? "N/A"}</TableCell>
                              <TableCell align="left">{lname ?? "N/A"}</TableCell>
                              <TableCell align="left">{passport ?? "N/A"}</TableCell>
                              <TableCell align="left">{type ?? "N/A"}</TableCell>
                            </TableRow>
                          );
                        })}
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      )}
                      {!loading && Booking.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No data
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={pageData.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Rows per page:"
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </Scrollbar>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

export default UpdateBooking;