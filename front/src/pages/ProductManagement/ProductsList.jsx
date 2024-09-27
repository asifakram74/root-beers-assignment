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
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../../layouts/components/common/Page';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserMoreMenu, UserListHead } from "../../sections/index";
import { getProduct, deleteProduct } from "../../store/services/ProductServices";
import Swal from "sweetalert2";

//__________________________________________________________

// Table Titles
let TABLE_HEAD = [
  { id: 'id', label: '#', alignRight: false },
  { id: 'airlines', label: 'Airlines', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'stock', label: 'Stock', alignRight: false },
  { id: 'sector', label: 'Sector', alignRight: false },
  { id: 'pnr', label: 'PNR', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
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
        (_products) => _products.airlines && _products.airlines.toLowerCase().includes(query.toLowerCase())
      );
  }
  return stabilizedThis.map((el) => el[0]);
}

const Product = () => {
  const [product, setProduct] = useState([]);

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - product.length) : 0;

  const filteredProduct = applySortFilter(
    product,
    getComparator(order, orderBy),
    filterName,
  );

  const isProductNotFound = filteredProduct.length === 0;

  // Get Products
  const getProductApi = () => {
    setLoading(true);
    let params = {
      page: page + 1,
      limit: rowsPerPage,
      search: filterName
    }
    if (typeof orderBy == 'string') {
      params.order_by = order;
      params.column_name = orderBy;
    }
    getProduct(params)
      .then((r) => {
        if (r && r.products.data) {
          setProduct(r.products.data);
          let clone = Object.assign({}, r.products);
          delete clone.data;
          setPageData(clone);
        } else {
          setProduct([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setProduct([]);
        setLoading(false);
      });
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
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
          deleteProduct(id)
            .then((r) => {
              toast.success("Product Deleted");
              getProductApi();
            });
        }
      });
  }

  useEffect(() => {
    getProductApi();
  }, [page, rowsPerPage, orderBy, order, filterName]);

  return (
    <>
      <Page title="Product">
        <Container className="ContainerPagePadding">
          <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className='h2_tag'>Products </h2>
            <Button sx={{ textTransform: 'uppercase', fontWeight: '500', }} component={Link} to="/add-product" variant='contained'>
              Add Product
            </Button>
          </Box>
          <Card sx={{ mt: 5 }}>
            <Box sx={{ p: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className='h2_tag'>Products List</h2>
              <Box>
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
                      filteredProduct?.map((row, index) => {
                        const {
                          id,
                          airlines,
                          price,
                          stock,
                          sector,
                          pnr,
                          category
                        } = row;
                        return (
                          <TableRow hover key={row.id} className="table-body">
                            <TableCell align="left">{index + 1 ?? "N/A"}</TableCell>
                            <TableCell align="left">{airlines ?? "N/A"}</TableCell>
                            <TableCell align="left">{price ?? "N/A"}</TableCell>
                            <TableCell align="left">{stock ?? "N/A"}</TableCell>
                            <TableCell align="left">{sector ?? "N/A"}</TableCell>
                            <TableCell align="left">{pnr ?? "N/A"}</TableCell>
                            <TableCell align="left">{category ?? "N/A"}</TableCell>
                            <TableCell align="right">
                              <UserMoreMenu
                                callbackDelete={() => handleDeleteProduct(id)}
                                editLink={`/edit-product/${id}`}
                              />
                            </TableCell>
                          </TableRow>
                        )
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
                    {!loading && filteredProduct.length == 0 && (
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
export default Product;