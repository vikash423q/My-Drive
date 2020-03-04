import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import { TextField, Button } from '@material-ui/core';
import { useFormState } from 'react-use-form-state';
import { signUpService } from '../service';
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

const handleSignUp = (data, props, dispatch) => {
    props.toggleLoading(true);
    data.values = { ...data.values, age: parseInt(data.values.age, 10) };
    signUpService(data.values).then(res => {
        props.toggleLoading(false);
        props.closeSnack();
        props.makeSnack(res.status.message, { variant: res.status.code === 200 ? 'success' : 'error' });
        if (res.status.code === 200) setTimeout(() => dispatch({ type: 'AUTHENTICATION', payload: true, token: res.data.token }), 1000);
        Cookies.set('auth', res.data.token);
    })
}

const SignupPage = (props) => {
    const classes = useStyle();
    const [formState, { text, email, password, number }] = useFormState();
    const dispatch = useDispatch();
    return (
        <Box className={classes.box}>
            <form onSubmit={((e) => { e.preventDefault(); handleSignUp(formState, props, dispatch) })}>
                <TextField
                    label='Name'
                    variant="outlined"
                    {...text('name')}
                    className={classes.textField}
                    margin="dense"
                />
                <TextField
                    required
                    variant="outlined"
                    {...text('username')}
                    minLength="4"
                    label='Username'
                    className={classes.textField}
                    margin="dense"
                />
                <TextField
                    required
                    variant="outlined"
                    {...number('age')}
                    label='Age'
                    className={classes.textField}
                    margin="dense"
                />
                <TextField
                    required
                    variant="outlined"
                    {...email('email')}
                    label='Email'
                    className={classes.textField}
                    margin="dense"
                />
                <TextField
                    required
                    variant="outlined"
                    {...password('password')}
                    label='Password'
                    className={classes.textField}
                    margin="dense"
                />
                <Button variant="contained" type="submit" size="medium" style={{ width: '100%', marginTop: 16, marginBottom: 8 }} color="primary" className={classes.button}>
                    Sign Up
            </Button>
            </form>
        </Box>
    );

}

export default SignupPage;