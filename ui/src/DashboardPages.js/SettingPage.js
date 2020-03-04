import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, List, ListItem, ListItemText, Divider, Switch, LinearProgress, ButtonBase, Select, InputLabel, FormControl, MenuItem, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';
import { updateStorageService, userProfileService, updateProfileService, changePasswordService } from '../service';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    header: {
        padding: theme.spacing(3),
        alignItems: 'center',
        elavation: theme.spacing(0.5),
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.type === 'dark' ? '#3e4042' : '#bbbdbf',
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1)

    },
    paper: {
        position: 'absolute',
        top: 'calc( 50% - 200px )',
        left: 'calc( 50% - 300px )',
        width: 600,
        [theme.breakpoints.down('md')]: {
            width: 360,
            left: 'calc( 50% - 180px )',
        },
        [theme.breakpoints.up('md')]: {
            width: 600,
            left: 'calc( 50% - 300px )',
        },
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: theme.spacing(1),
        padding: theme.spacing(0),
        outline: 0,
    },
    menu: {
        height: 300,
        borderRight: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    modal: {
        outline: 0
    },
    listitem: {
        height: theme.spacing(4),
        marginBottom: theme.spacing(1),
    },
    container: {
        alignItems: 'center',
        padding: '1rem',
        borderBottom: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
        justifyContent: 'space-around'
    },
    subtext: {
        fontSize: 11
    },
    btn: {
        fontSize: 11.5,
        fontWeight: theme.typography.fontWeightMedium,
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        color: theme.palette.primary.main
    },
    top: {
        height: '4rem'
    },
    subtitle: {
        fontSize: theme.spacing(1.5),
        color: theme.palette.primary,
        marginRight: theme.spacing(4),
        marginBottom: theme.spacing(1)
    }
}));

const View = (props) => {
    return (
        props.mode === 'general' ? <GeneralView /> : <AccountView />
    );
}

const AccountView = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState({});
    const [mode, setMode] = React.useState('idle');
    const [values, setValues] = React.useState({ ...profile });
    const [updateEmail, setUpdateEmail] = React.useState(false);
    const [passVal, setPassVal] = React.useState({ previous_password: '', new_password: '', confirm_password: '' })
    const [updateUsername, setUpdateUsername] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    React.useEffect(() => {
        if (loading) {
            userProfileService().then(data => { setProfile(data.data); setValues(data.data); setLoading(false) })
        }
    })
    const handleProfileUpdate = () => {
        let data = { name: values.name, age: parseInt(values.age) };
        if (updateEmail) data.email = values.email;
        if (updateUsername) data.username = values.username;
        updateProfileService(data).then(res => {
            closeSnackbar();
            if (res.status.code !== 200) {
                enqueueSnackbar('Profile update failed. ' + res.status.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Profile updated successfully', { variant: 'success' });
                if (updateUsername)
                    Cookies.set('auth', res.data.token);
                setLoading(true);
            }
        });
    }
    const handlePasswordChange = () => {
        changePasswordService(passVal).then(res => {
            closeSnackbar();
            if (res.status.code !== 200) {
                enqueueSnackbar('Failed. ' + res.status.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Password changed successfully', { variant: 'success' });
            }
        })
    }

    return (
        <Grid container column style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <Grid item className={classes.top} style={{ width: '100%' }}>
                <Grid container className={classes.container}>
                    <Grid item xs={6} sm={6}>
                        <Button onClick={() => setMode('editProfile')} color='primary' variant='outlined' size='small'>Edit Profile</Button>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button onClick={() => setMode('changePassword')} color='primary' variant='outlined' size='small'>Change Password</Button>
                    </Grid>
                </Grid>
            </Grid>
            {mode === 'idle' ? Object.keys(profile).map((item) =>
                <Grid item style={{ width: '100%' }}>
                    <Grid container className={classes.container}>
                        <Grid item xs={4}><Typography>{item}</Typography></Grid>
                        <Grid item xs={8}><Typography>{profile[item]}</Typography></Grid>
                    </Grid>
                </Grid>
            ) : mode === 'editProfile' ?
                    <Grid item style={{ width: '100%', height: '100%' }}>
                        <Grid container style={{ justifyContent: 'center', alignItems: 'space-between', padding: '1rem' }} direction="column">
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <OutlinedInput

                                        style={{ height: '2.4rem', margin: '8px 0' }}
                                        value={values.name}
                                        type='text'
                                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                                        labelWidth={50}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="age">Age</InputLabel>
                                    <OutlinedInput
                                        style={{ height: '2.4rem', margin: '8px 0' }}
                                        value={values.age}
                                        type='number'
                                        onChange={(e) => setValues({ ...values, age: e.target.value })}
                                        labelWidth={50}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="name">Email</InputLabel>
                                    {updateEmail ?
                                        <OutlinedInput
                                            style={{ height: '2.4rem', margin: '8px 0' }}
                                            value={values.email}
                                            type='text'
                                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                                            labelWidth={50}
                                        /> :
                                        <OutlinedInput
                                            disabled
                                            style={{ height: '2.4rem', margin: '8px 0' }}
                                            value={values.email}
                                            type='text'
                                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                                            labelWidth={50}
                                        />}
                                </FormControl>
                                <Typography className={classes.subtitle} onClick={() => setUpdateEmail(!updateEmail)}>{updateEmail ? "Not email?" : 'Change email?'}</Typography>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    {updateUsername ?
                                        <OutlinedInput
                                            style={{ height: '2.4rem', margin: '8px 0' }}
                                            value={values.username}
                                            type='text'
                                            onChange={(e) => setValues({ ...values, username: e.target.value })}
                                            labelWidth={50}
                                        /> :
                                        <OutlinedInput
                                            disabled
                                            style={{ height: '2.4rem', margin: '8px 0' }}
                                            value={values.username}
                                            type='text'
                                            onChange={(e) => setValues({ ...values, username: e.target.value })}
                                            labelWidth={50}
                                        />}
                                </FormControl>
                                <Typography className={classes.subtitle} onClick={() => setUpdateUsername(!updateUsername)}>{updateUsername ? "Not username?" : 'Change username?'}</Typography>
                            </Grid>
                            <Grid item style={{ margin: '4px' }}>
                                <Button onClick={() => setMode('idle')} style={{ marginRight: '8px' }} color="secondary" variant="contained" size="small">Cancel</Button>
                                <Button onClick={() => handleProfileUpdate()} color="primary" variant="contained" size="small">Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <Grid item style={{ width: '100%', height: '100%' }} >
                        <Grid container style={{ justifyContent: 'center', alignItems: 'space-between', padding: '1rem' }} direction="column">
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="password">Current Password</InputLabel>
                                    <OutlinedInput
                                        style={{ height: '2.4rem', margin: '8px 0' }}
                                        type={showPassword ? 'text' : 'password'}
                                        value={passVal.previous_password}
                                        onChange={(e) => setPassVal({ ...passVal, previous_password: e.target.value })}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={50}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="password">New Password</InputLabel>
                                    <OutlinedInput
                                        style={{ height: '2.4rem', margin: '8px 0' }}
                                        type={showPassword ? 'text' : 'password'}
                                        value={passVal.new_password}
                                        onChange={(e) => setPassVal({ ...passVal, new_password: e.target.value })}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={50}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="password">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        style={{ height: '2.4rem', margin: '8px 0' }}
                                        type={showPassword ? 'text' : 'password'}
                                        value={passVal.confirm_password}
                                        onChange={(e) => setPassVal({ ...passVal, confirm_password: e.target.value })}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={50}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item style={{ margin: '4px' }}>
                                <Button onClick={() => setMode('idle')} style={{ marginRight: '8px' }} color="secondary" variant="contained" size="small">Cancel</Button>
                                <Button onClick={handlePasswordChange} color="primary" variant="contained" size="small">Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
            }
        </Grid >
    );
}

const GeneralView = (props) => {
    const classes = useStyles();
    const darkMode = useSelector(state => state.auth.darkMode);
    const storage = useSelector(state => state.storage);
    const [storageMenuOpen, toggleStorageMenu] = React.useState(false);
    const [storageOption, changeOption] = React.useState('20');
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleStorageUpdate = () => {
        updateStorageService({ size: storageOption }).then(data => {
            if (data.status.code !== 200) {
                enqueueSnackbar('Storage upgrade failed', { variant: 'error' });
            } else {
                enqueueSnackbar('Storage upgrade successful', { variant: 'success' });
                dispatch({ type: 'LOAD_STORAGE' });
            }
        });
    }
    return (
        <Grid container column style={{ width: '100%' }}>
            <Grid item style={{ width: '100%' }}>
                <Grid container className={classes.container}>
                    <Grid item xs={4}><Typography>Dark Mode</Typography></Grid>
                    <Grid item xs={8}> <Switch checked={darkMode} color="primary" onChange={() => dispatch({ type: 'TOGGLE_MODE', payload: !darkMode })} /> </Grid>
                </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
                <Grid container className={classes.container}>
                    <Grid item xs={4}><Typography>Storage</Typography></Grid>
                    <Grid item xs={8}>
                        <LinearProgress variant="determinate" value={(storage.used * 100 / storage.alloted)} style={{ marginTop: 2, marginBottom: 2, width: '50%' }} />
                        <Typography variant="subtitle2" className={classes.subtext}>{`${storage.used} Mb of ${storage.alloted} Mb used`}</Typography>
                        <ButtonBase className={classes.btn} onClick={() => toggleStorageMenu(!storageMenuOpen)}>UPGRADE STORAGE</ButtonBase>
                        <FormControl variant="filled" style={{ display: storageMenuOpen ? 'block' : 'none' }} className={classes.formControl}>
                            <InputLabel>Storage</InputLabel>
                            <Select
                                value={storageOption}
                                onChange={(e) => changeOption(e.target.value)}
                            >
                                <MenuItem value={'20'}>20 Mb</MenuItem>
                                <MenuItem value={'40'}>40 Mb</MenuItem>
                                <MenuItem value={'60'}>60 Mb</MenuItem>
                            </Select>
                            <br />
                            <Button size="small" onClick={handleStorageUpdate} variant="outlined" color='primary'>Upgrade</Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default function SettingDialog(props) {
    const classes = useStyles();
    return (
        <Modal
            open={props.open}
            closeAfterTransition
            className={classes.modal}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <Transition in={props.open}>
                <Grid container className={classes.paper}>
                    <Grid item xs={12}>
                        <Grid container className={classes.header} style={{ justifyContent: 'space-between' }}>
                            <Grid item xs={6}><Typography variant="h5">Settings</Typography></Grid>
                            <Grid item xs={2}><Button onClick={() => props.close(false)} color='primary' variant='contained' disableElevation>Done</Button></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container column className={classes.menu}>
                            <List>
                                <ListItem
                                    button
                                    selected={props.mode === 'general'}
                                    className={classes.listitem}
                                    onClick={() => props.changeMode('general')}
                                >
                                    <ListItemText primary={<Typography variant="title" className={classes.text}>General</Typography>} />
                                </ListItem>
                                <ListItem
                                    button
                                    selected={props.mode === 'account'}
                                    className={classes.listitem}
                                    onClick={() => props.changeMode('account')}
                                >
                                    <ListItemText primary={<Typography variant="title" className={classes.text}>Account</Typography>} />
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <View mode={props.mode} changeMode={props.changeMode} />
                    </Grid>
                </Grid>
            </Transition>
        </Modal>
    );
}