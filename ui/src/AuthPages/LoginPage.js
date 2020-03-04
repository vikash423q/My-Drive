import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import { TextField, Button } from '@material-ui/core';
import { loginService } from '../service';
import { useFormState } from 'react-use-form-state';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const useStyle = makeStyles(theme => ({
    box: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 240,
    }
}));

const handleLogin = (data, email, props, dispatch) => {
    data = data.values;
    props.toggleLoading(true);
    let req = { password: data.password };
    email ? req.email = data.user : req.username = data.user;
    loginService(req).then(res => {
        props.toggleLoading(false);
        props.closeSnack();
        props.makeSnack(res.status.message, { variant: res.status.code === 200 ? 'success' : 'error' });
        if (res.status.code === 200) {
            setTimeout(() => dispatch({ type: 'AUTHENTICATION', payload: true, token: res.data.token }), 1000)
            Cookies.set('auth', res.data.token);
        }
    });
}

const LoginPage = (props) => {
    const classes = useStyle();
    const [email, toggleField] = useState(true);
    const [formState, { text, password }] = useFormState();
    const dispatch = useDispatch();
    return (
        <Box className={classes.box}>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(formState, email, props, dispatch) }}>
                <Box>
                    <TextField
                        required
                        variant="outlined"
                        {...text('user')}
                        label={email ? 'Email' : 'Username'}
                        className={classes.textField}
                        margin="dense"
                    />
                    <TextField
                        required
                        {...password('password')}
                        variant="outlined"
                        label="Password"
                        className={classes.textField}
                        margin="dense"
                    />
                </Box>
                <Button variant="contained" type="submit" size="medium" style={{ width: '100%', marginTop: 16, marginBottom: 8 }} color="primary" className={classes.button}>
                    Login
            </Button>
            </form>
            <Button variant="outlined" color="primary" size="small" onClick={() => toggleField(!email)}>login with{email ? ' username' : ' email'} </Button>
        </Box>
    );

}

export default LoginPage;