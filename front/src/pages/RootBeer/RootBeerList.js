import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../../layouts/components/common/Page';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserMoreMenu, UserListHead } from "../../sections/index";
import { getDrinksWithPictures, deleteDrinkWithPicture } from "../../store/services/DrinksService";
import Swal from "sweetalert2";

//__________________________________________________________

// Table Titles
let TABLE_HEAD = [
  { id: 'id', label: '#', alignRight: false },
  { id: 'picture', label: 'Picture', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'reviewCount', label: 'Review Count', alignRight: false },
  { id: 'reviewAverageRating', label: 'Review Average Rating', alignRight: false },
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
        (_drinks) => _drinks.name && _drinks.name.toLowerCase().includes(query.toLowerCase())
      );
  }
  return stabilizedThis.map((el) => el[0]);
}

const Drinks = () => {
  const [drinks, setDrinks] = useState([]);
  const REACT_APP_SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  // PAgination
  const [loading, setLoading] = useState(false);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - drinks.length) : 0;

  const filteredDrinks = applySortFilter(
    drinks,
    getComparator(order, orderBy),
    filterName,
  );

  const isDrinksNotFound = filteredDrinks.length === 0;

  // Get Drinks
  const getDrinksApi = () => {
    setLoading(true);
    let params = {
      offset: page * rowsPerPage,
      length: rowsPerPage,
      search: filterName
    };
    if (typeof orderBy === 'string') {
      params.order_by = order;
      params.column_name = orderBy;
    }

    getDrinksWithPictures(params)
      .then((r) => {
        if (r) {
          setDrinks(r);
          let clone = Object.assign({}, r);
          delete clone.data;
          setPageData(clone);
        } else {
          setDrinks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching drinks:", error);
        setLoading(false);
      });
  };

  // Delete Drinks
  const handleDeleteDrinkWithPicture = (id) => {
    Swal.fire({
      title: "Are You Sure?",
      text: "you can't undo this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteDrinkWithPicture(id)
            .then((r) => {
              toast.success("Drinks Deleted");
              getDrinksApi();
            });
        }
      });
  }

  useEffect(() => {
    getDrinksApi();
  }, [page, rowsPerPage, orderBy, order, filterName]);

  return (
    <>
      <Page title="Drinks">
        <Container className="ContainerPagePadding">
          <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className='h2_tag'>Drinks </h2>
            <Button sx={{ textTransform: 'uppercase', fontWeight: '500', }} component={Link} to="/add-drinks" variant='contained'>
              Add Drinks
            </Button>
          </Box>
          <Card sx={{ mt: 5 }}>
            <Box sx={{ p: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className='h2_tag'>Drinks List</h2>
                <TextField
                  variant="outlined"
                  label="Search Product"
                  placeholder="Search Product"
                  value={filterName}
                  onChange={handleFilterByName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
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
                        filteredDrinks?.map((row, index) => {
                          const {
                            id,
                            name,
                            description,
                            reviewCount,
                            reviewAverageRating,
                            Pictures,
                          } = row;
                          const picture = Pictures && Pictures.length > 0 ? `${REACT_APP_SECRET_KEY}/${Pictures[0].path}` : null;
                          return (
                            <TableRow hover key={row.id} className="table-body">
                              <TableCell align="left">{id ?? "N/A"}</TableCell>
                              <TableCell align="left">
                                {picture ? (
                                  <img
                                    src={picture}
                                    alt={name}
                                    style={{ width: '50px', height: '50px' }}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell align="left">{name ?? "N/A"}</TableCell>
                              <TableCell align="left">{description ?? "N/A"}</TableCell>
                              <TableCell align="left">{reviewCount ?? "N/A"}</TableCell>
                              <TableCell align="left">{reviewAverageRating ?? "N/A"}</TableCell>
                              <TableCell align="right">
                                <UserMoreMenu
                                  callbackDelete={() => handleDeleteDrinkWithPicture(id)}
                                  editLink={`/edit-drinks/${id}`}
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
                      {!loading && filteredDrinks.length === 0 && (
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
        </Container>
      </Page>
    </>
  );
};
export default Drinks;