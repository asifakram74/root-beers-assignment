import { useEffect, useState } from "react";
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
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Iconify from '../../layouts/components/common/Iconify';
import { useNavigate } from 'react-router-dom';
import Page from '../../layouts/components/common/Page';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserListHead } from "../../sections/index";

// Api
import { getBookings, updateBooking } from '../../store/services/OrdersServices';

// Icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Third Party Imports
import toast from 'react-hot-toast';

// __________________________________________________________

// Table Titles
let TABLE_HEAD = [
    { id: 'id', label: '#', alignRight: false },
    { id: 'airlines', label: 'Airlines', alignRight: false },
    { id: 'flight_number', label: 'Flight Number', alignRight: false },
    { id: 'sector', label: 'Sector', alignRight: false },
    { id: 'price', label: 'Price', alignRight: false },
    { id: 'Booking_seats', label: 'Seats', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'name', label: 'name', alignRight: false },
    { id: 'status', label: 'status', alignRight: false },
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
        return array.filter(
            (_Bookings) => _Bookings.product?.airlines && _Bookings.product.airlines.toLowerCase().indexOf(query.toLowerCase()) !== -1,
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

const Bookings = () => {
    const [Bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    // Pagination
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
    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirm':
                return 'active_cell';
            case 'Pending':
                return 'pending_cell';
            case 'Reject':
                return 'block_cell';
            case 'Cancel':
                return 'cancel_cell';
            default:
                return '';
        }
    };

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Bookings.length) : 0;

    const filteredBookings = applySortFilter(
        Bookings,
        getComparator(order, orderBy),
        filterName,
    );

    const isBookingNotFound = filteredBookings.length === 0;

    const updateStatus = async (id, newStatus) => {
        setLoading(true);
        try {
            await updateBooking(id, { status: newStatus });
            toast.success('Status Updated Successfully');
            setBookings((prevBookings) =>
                prevBookings.map((Booking) =>
                    Booking.id === id ? { ...Booking, status: newStatus } : Booking
                )
            );
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order');
        } finally {
            setLoading(false);
        }
    };

    // Get Bookings
    const getBookingsApi = () => {
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
        getBookings(params)
            .then((r) => {
                if (r && r.Bookings.data) {
                    setBookings(r.Bookings.data);
                    let clone = Object.assign({}, r.Bookings);
                    delete clone.data;
                    setPageData(clone);
                } else {
                    setBookings([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                setBookings([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        getBookingsApi();
    }, [page, rowsPerPage, orderBy, order, filterName]);

    return (
        <>
            <Page title="Bookings">
                <Container className="ContainerPagePadding">
                    <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className='h2_tag'>Bookings </h2>
                    </Box>
                    <Card sx={{ mt: 5 }}>
                        <Box sx={{ p: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 className='h2_tag'>Bookings List</h2>
                            <Box>
                                <TextField
                                    variant="outlined"
                                    label="Search Booking"
                                    placeholder="Search Booking"
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
                                            filteredBookings?.map((row, index) => {
                                                const {
                                                    id,
                                                    product,
                                                    user,
                                                    status,
                                                } = row;
                                                return (
                                                    <TableRow hover key={row.id} className="table-body">
                                                        <TableCell align="left">{index + 1 ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{product?.airlines ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{product?.flight_number ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{product?.sector ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{product?.price ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{row?.Booking_seats ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{user?.email ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{user?.name ?? "N/A"}</TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={getStatusClass(status)}
                                                        >
                                                            <p>{status ?? 'N/A'}</p>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {status === 'Reject' ? null : status !== 'Confirm' ? (
                                                                <>
                                                                    <IconButton className="edit_button" onClick={() => navigate(`/edit-order/${id}`)}>
                                                                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => updateStatus(id, 'Confirm')}
                                                                        disabled={loading}
                                                                    >
                                                                        <CheckCircleOutlineIcon />
                                                                    </IconButton>
                                                                </>
                                                            ) : (
                                                                <IconButton className="edit_button" onClick={() => navigate(`/edit-order/${id}`)}>
                                                                    <Iconify icon="eva:edit-fill" width={24} height={24} />
                                                                </IconButton>
                                                            )}

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
                                        {!loading && filteredBookings.length == 0 && (
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
export default Bookings;