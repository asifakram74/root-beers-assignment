/** @format */
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Table,
  Button,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  Typography,
  FormControl,
  TableContainer,
  TablePagination,
} from '@mui/material';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Modal } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Page from '../../layouts/components/common/Page';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserMoreMenu, UserListHead } from "../../sections/index";
import { viewDrink, updateDrinks } from '../../store/services/DrinksService';
import { getReview, postReview, deleteReview } from '../../store/services/ReviewService';


// Table Titles
let TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'review', label: 'Review', alignRight: false },
  { id: 'Action', label: 'Action', alignRight: true }
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
    return stabilizedThis
      .map((el) => el[0])
      .filter(
        (_reviews) => _reviews.name && _reviews.name.toLowerCase().includes(query.toLowerCase())
      );
  }
  return stabilizedThis.map((el) => el[0]);
}

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const AddUpdateDrinks = () => {
  const REACT_APP_SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  const navigate = useNavigate();
  const routeParams = useParams();
  const [reviews, setReviews] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState({ user_name: '', description: '', rating: '' });

  // PAgination
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
    const query = event.target.value;
    setFilterName(query);
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reviews.length) : 0;

  const filteredReviews = applySortFilter(
    reviews,
    getComparator(order, orderBy),
    filterName,
  );

  const isReviewsNotFound = filteredReviews.length === 0;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const product = await viewDrink(routeParams.id);
        reset(product);
        setPictures(product.Pictures || []);
      } catch (error) {
        toast.error('Failed to load Product data');
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.id) {
      fetchProduct();
    }
  }, [routeParams.id, reset]);


  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const drinkId = data.id;
      const drinkData = {
        name: data.name,
        description: data.description,
      };

      await updateDrinks(drinkId, drinkData);
      toast.success('Drink updated successfully');
      navigate('/drinks-list');
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to update drink');
    } finally {
      setLoading(false);
    }
  };

  // Delete Review
  const handleDeleteReview = (drinkId, reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview(drinkId, reviewId)
          .then(() => {
            toast.success("Review deleted successfully");
            getReviewApi(drinkId);
          })
          .catch((error) => {
            toast.error("Failed to delete review");
            console.error("Delete review error:", error);
          });
      }
    });
  };
  

  const getReviewApi = (drinkId) => {
    setLoading(true);
  
    // Define parameters for pagination and search
    let params = {
      offset: page * rowsPerPage,
      length: rowsPerPage,
      search: filterName
    };
  
    if (typeof orderBy === 'string') {
      params.order_by = order;
      params.column_name = orderBy;
    }
  
    getReview(drinkId, params)
      .then((r) => {
        if (r) {
          setReviews(r.items);
          let clone = { ...r };
          delete clone.items;
          setPageData(clone);
        } else {
          setReviews([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  };

  // Open modal to add a new review
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentReview({ user_name: '', description: '', rating: '' });
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Submit the review
  const handleSubmitReview = async () => {
    try {
      await postReview(routeParams.id, currentReview);
      toast.success('Review added successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };
  
  useEffect(() => {
    if (routeParams.id) {
      getReviewApi(routeParams.id);
    }
  }, [routeParams.id, page, rowsPerPage, filterName, orderBy, order]);

  return (
    <Page title='Update Drinks'>
      <Grid container spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Update Drinks</h2>
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
                    {pictures.length > 0 ? (
                      <img
                        className="rl-img"
                        width={171}
                        height={150}
                        alt='Drink Image'
                        src={`${REACT_APP_SECRET_KEY}/${pictures[0].path}`}
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                      />
                    ) : (
                      <Typography>No Image Available</Typography>
                    )}
                  </Grid>

                </Grid>
                <Grid item sx={6} className="CardButtonPadding">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                    <Button variant="outlined" onClick={() => navigate('/drinks-list')}>Cancel</Button>
                    <Button variant="contained" type="submit">
                      UPDATE DRINKS
                    </Button>
                  </Box>
                </Grid>
              </form>
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid sx={{ mt: 8 }}>
        <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', mb: 4 }}>
          <Button sx={{ textTransform: 'uppercase', fontWeight: '500', }} onClick={handleOpenModal} variant='contained'>
            Add Reviews
          </Button>
        </Box>
        <Card>

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
                    filteredReviews?.map((row, index) => {
                      const {
                        id,
                        user_name,
                        description,
                        review,
                      } = row;
                      return (
                        <TableRow hover key={row.id} className="table-body">
                          <TableCell align="left">{id ?? "N/A"}</TableCell>
                          <TableCell align="left">{user_name ?? "N/A"}</TableCell>
                          <TableCell align="left">{description ?? "N/A"}</TableCell>
                          <TableCell align="left">{review ?? "N/A"}</TableCell>
                          <TableCell align="right">
                            <UserMoreMenu
                              callbackDelete={() => handleDeleteReview(drinkId, id)}
                              editLink={`/edit-reviews/${id}`}
                            />
                          </TableCell>
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
                  {!loading && filteredReviews.length === 0 && (
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

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              padding: '20px',
              width: '400px',
              margin: 'auto',
              borderRadius: '8px',
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Add Review</Typography>
            <TextField
              label="Name"
              value={currentReview.user_name}
              onChange={(e) => setCurrentReview({ ...currentReview, user_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={currentReview.description}
              onChange={(e) => setCurrentReview({ ...currentReview, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rating"
              value={currentReview.rating}
              onChange={(e) => setCurrentReview({ ...currentReview, rating: e.target.value })}
              fullWidth
              type="number"
              inputProps={{ min: 0, max: 5 }} // Rating between 0 and 5
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmitReview}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>

      </Grid>
    </Page>
  );
};

export default AddUpdateDrinks;