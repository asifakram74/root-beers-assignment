import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../../layouts/components/common/Page';
import Scrollbar from '../../layouts/components/common/Scrollbar';
import { UserMoreMenu, UserListHead } from "../../sections/index";
import { getUsers, deleteUser } from "../../store/services/usersService";
import Swal from "sweetalert2";


// __________________________________________________________

// Table Titles
let TABLE_HEAD = [
    { id: 'id', label: '#', alignRight: false },
    { id: 'name', label: 'User', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone', label: 'Phone', alignRight: false },
    { id: 'agency', label: 'Agency Name', alignRight: false },
    { id: 'role', label: 'Role', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
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
                (_users) =>
                    (_users.name && _users.name.toLowerCase().includes(query.toLowerCase())) ||
                    (_users.email && _users.email.toLowerCase().includes(query.toLowerCase())) ||
                    (_users.phone && _users.phone.toLowerCase().includes(query.toLowerCase()))
            );
    }
    return stabilizedThis.map((el) => el[0]);
}

const Users = () => {
    const [users, setUsers] = useState([]);

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
            case 'Active':
                return 'active_cell';
            case 'Block':
                return 'block_cell';
            case 'Pending':
                return 'pending_cell';
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
        getUsersApi();
    };

    const handleFilterByName = (event) => {
        const query = event.target.value;
        setFilterName(query);
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const filteredUsers = applySortFilter(
        users,
        getComparator(order, orderBy),
        filterName,
    );

    const isUserNotFound = filteredUsers.length === 0;

    // Get Users
    const getUsersApi = () => {
        setLoading(true);
        let params = {
            page: page + 1,
            limit: rowsPerPage,
            search: filterName
        }
        if (typeof orderBy == 'tring') {
            params.order_by = order;
            params.column_name = orderBy;
        }
        getUsers(params)
            .then((r) => {
                if (r && r.users.data) {
                    setUsers(r.users.data);
                    let clone = Object.assign({}, r.users);
                    delete clone.data;
                    setPageData(clone);
                    setPage(clone.current_page - 1);
                } else {
                    setUsers([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                setUsers([]);
                setLoading(false);
            });
    };

    // Delete User
    const handleDeleteUser = (id) => {
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
                    deleteUser(id)
                        .then((r) => {
                            toast.success("User Deleted");
                            getUsersApi();
                        });
                }
            });
    }

    useEffect(() => {
        getUsersApi();
    }, [page, rowsPerPage, orderBy, order, filterName]);

    return (
        <>
            <Page title="Users">
                <Container className="ContainerPagePadding">
                    <Box sx={{ pb: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className='h2_tag'>Users</h2>
                    </Box>
                    <Card sx={{ mt: 5 }}>
                        <Box sx={{ p: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 className='h2_tag'>Users List</h2>
                            <Box>
                                <TextField
                                    variant="outlined"
                                    label="Search User"
                                    placeholder="Search User"
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
                                            filteredUsers?.map((row, index) => {
                                                const {
                                                    id,
                                                    name,
                                                    email,
                                                    phone,
                                                    role,
                                                    status,
                                                    agency
                                                } = row;
                                                return (
                                                    <TableRow hover key={row.id} className="table-body">
                                                        <TableCell align="left">{index + 1 ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{name ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{email ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{phone ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{agency ?? "N/A"}</TableCell>
                                                        <TableCell align="left">{role ?? "N/A"}</TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={getStatusClass(status)}
                                                        >
                                                            <p>{status ?? 'N/A'}</p>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <UserMoreMenu
                                                                callbackDelete={() => handleDeleteUser(id)}
                                                                editLink={`/edit-user/${id}`}
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
                                        {!loading && filteredUsers.length == 0 && (
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
                                    page={pageData.current_page - 1}
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
export default Users;