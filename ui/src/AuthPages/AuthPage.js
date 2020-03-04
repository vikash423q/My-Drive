import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';
import { Button, Paper, IconButton } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { withSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
    mode: {
        marginBottom: 30
    },
    box: {
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh'
    },
    form: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 7,
        width: 450,
        height: 560,
        [theme.breakpoints.down('md')]: {
            width: 360,
        },
    }
}));

const Progress = (props) => {
    return (
        <React.Fragment>
            {!props.loading ? null :
                <LinearProgress style={{ marginBottom: -4 }} />}
        </React.Fragment>
    );
}


const App = (props) => {
    const classes = useStyles();
    const [login, toggleType] = useState(true);
    const [loading, toggleLoading] = useState(false);

    return (
        <Box className={classes.box}>
            <IconButton className={classes.mode} onClick={() => { props.closeSnackbar(); props.enqueueSnackbar('Dark Mode ' + (props.darkMode ? 'OFF' : 'ON'), { variant: 'info' }); props.dispatch({ type: 'TOGGLE_MODE', payload: !props.darkMode }) }} ><WbIncandescentIcon style={{ fontSize: '50', color: props.darkMode ? 'grey' : '#dfdfdf' }} /></IconButton>
            <Box>
                <Progress loading={loading} />
                <Paper className={classes.form}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" width="100" />
                    </div>
                    {login ? <LoginPage makeSnack={props.enqueueSnackbar} closeSnack={props.closeSnackbar} toggleLoading={toggleLoading} loading={loading} /> :
                        <SignupPage makeSnack={props.enqueueSnackbar} closeSnack={props.closeSnackbar} toggleLoading={toggleLoading} loading={loading} />}
                    <Button variant="outlined" color="primary" size="small" onClick={() => { toggleType(!login) }}>{login ? 'Sign Up?' : 'Login?'}</Button>
                </Paper>
            </Box>
        </Box>
    );
}

export default withSnackbar(App);