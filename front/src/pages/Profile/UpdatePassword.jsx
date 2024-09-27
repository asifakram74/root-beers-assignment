/** @format */

//React Imports
import { useState } from "react";
import toast from "react-hot-toast";

// @mui
import {
    Grid,
    Button,
    FormControl,
    InputLabel,
    Box,
    IconButton,
    OutlinedInput,
    FormHelperText,
    InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Icon Imports
import DoneIcon from "@mui/icons-material/Done";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

//Compnents
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Instance from "../../store/axios";


const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
        return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters`;
    } else {
        return "";
    }
};

const UpdatePasswordModal = ({ handleClose = () => { }, show = false, id }) => {
    const navigate = useNavigate();
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const schemas = yup.object().shape({
        old_password: yup
            .string()
            .required()
            .min(5),
            new_password: yup
            .string()
            .required()
            .min(5),
        password_confirmation: yup.string()
            .min(5)
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schemas),
    });

    const onUpdatePassword = async (value) => {
        console.log("value", value)
        await Instance.patch(`/changePassword/`, value)
            .then((res) => {
                if (res.data) {
                    toast.success("Password Updated Successfully");
                    handleClose();
                } else {
                    toast.error("Password Update Failed");
                    handleClose();
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
    }

    return (
        <>
            <Grid
                container
                justifyContent="start"
                alignItems="center"
                item
                xs={12}
                className="RoleCardButton">
                <Dialog onClose={handleClose} className="passwordModal" aria-labelledby='customized-dialog-title' open={show}>
                    <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
                        <Typography variant='h6' component='span'>
                            Change Password
                        </Typography>
                        <IconButton
                            aria-label='close'
                            onClick={handleClose}
                            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
                        >
                            {/* <Icon icon='mdi:close' /> */}
                        </IconButton>
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onUpdatePassword)} id="different">
                        <DialogContent dividers sx={{ p: 4 }}>

                        <Box className="BoxWidth">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel
                                        id="validation-schema-old_password"
                                        error={Boolean(errors.password)}
                                        htmlFor="validation-schema-old_password">
                                        Old Password
                                    </InputLabel>
                                    <Controller
                                        name="old_password"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <OutlinedInput
                                                value={value}
                                                onChange={onChange}
                                                id="validation-schema-old_password"
                                                type={showOldPassword ? "text" : "password"}
                                                error={Boolean(errors.password)}
                                                labelid="validation-schema-old_password"
                                                aria-describedby="validation-schema-old_password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle old password visibility"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() =>
                                                                setShowOldPassword(!showOldPassword)
                                                            }
                                                            edge="end">
                                                            {showOldPassword ? (
                                                                <EyeOutline />
                                                            ) : (
                                                                <EyeOffOutline />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Old Password "
                                            />
                                        )}
                                    />
                                    {errors.old_password && (
                                        <FormHelperText
                                            sx={{ color: "error.main" }}
                                            id="validation-schema-old_password">
                                            {errors.old_password.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <Box className="BoxWidth">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel
                                        id="validation-schema-new_password"
                                        error={Boolean(errors.new_password)}
                                        htmlFor="validation-schema-new_password">
                                        Password
                                    </InputLabel>
                                    <Controller
                                        name="new_password"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <OutlinedInput
                                                value={value}
                                                onChange={onChange}
                                                id="validation-schema-new_password"
                                                type={showPassword ? "text" : "new_password"}
                                                error={Boolean(errors.new_password)}
                                                labelid="validation-schema-new_password"
                                                aria-describedby="validation-schema-new_password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle new_password visibility"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
                                                            edge="end">
                                                            {showPassword ? (
                                                                <EyeOutline />
                                                            ) : (
                                                                <EyeOffOutline />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        )}
                                    />
                                    {errors.new_password && (
                                        <FormHelperText
                                            sx={{ color: "error.main" }}
                                            id="validation-schema-new_password">
                                            {errors.new_password.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <Box className="BoxWidth">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel
                                        id="validation-schema-password_confirmation"
                                        error={Boolean(errors.password_confirmation)}
                                        htmlFor="validation-schema-password_confirmation">
                                        Confirm Password
                                    </InputLabel>
                                    <Controller
                                        name="password_confirmation"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <OutlinedInput
                                                value={value}
                                                onChange={onChange}
                                                id="validation-schema-password_confirmation"
                                                type={showConformPassword ? "text" : "password"}
                                                error={Boolean(errors.password_confirmation)}
                                                labelid="validation-schema-password_confirmation"
                                                aria-describedby="validation-schema-password_confirmation"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() =>
                                                                setShowConformPassword(
                                                                    !showConformPassword,
                                                                )
                                                            }
                                                            edge="end">
                                                            {showConformPassword ? (
                                                                <EyeOutline />
                                                            ) : (
                                                                <EyeOffOutline />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Confirm Password"
                                            />
                                        )}
                                    />
                                    {errors.password_confirmation && (
                                        <FormHelperText
                                            sx={{ color: "error.main" }}
                                            id="validation-schema-password_confirmation">
                                            {errors.password_confirmation.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <DialogActions  >
                                <Button variant="outlined" onClick={handleClose} className="DeleteButton">Cancel</Button>
                                <Button variant="contained" className="SaveButton" startIcon={<DoneIcon />} type="submit"> Save </Button>
                            </DialogActions>
                        </DialogContent>
                    </form>
                </Dialog>
            </Grid>

        </>
    )
};
export default UpdatePasswordModal;