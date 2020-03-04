import React from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Close from '@material-ui/icons/Close';
import White from '@material-ui/core/colors/common'
import MediaManager from './MediaManager';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    modal: {
        top: 0,
        left: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        opacity: 0.95,
        padding: theme.spacing(2),
    },
    text: {
        width: '100%',
        fontWeight: 600,
        fontSize: 24,
        color: '#fdfdfd'
    },
    close: {
        color: "rgba(255, 255, 255, 1)"
    }
}));

const Overlay = (props) => {
    const classes = useStyles();
    const state = useSelector(state => state.media);
    const dispatch = useDispatch();

    console.log(state);

    const handleClose = (event) => {
        event.preventDefault();
        console.log(event.currentTarget);
        if (event.target === event.currentTarget) {
            dispatch({ type: 'CLOSE_MEDIA' });
        }
    };

    return (
        <Modal
            open={state.open}
            onClose={handleClose}
        >
            <Grid container onClick={handleClose} direction="column" className={classes.modal}>
                <Grid container item style={{ height: '10%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid item></Grid>
                    <Grid item>
                        <Typography noWrap className={classes.text}>{state.file.name}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton size="medium" className={classes.close} onClick={() => dispatch({ type: 'CLOSE_MEDIA' })}><Close fontSize="large" /></IconButton>
                    </Grid>
                </Grid>
                <Grid container item style={{ height: '85%' }}>
                    <MediaManager file={state.file} close={() => dispatch({ type: 'CLOSE_MEDIA' })} />
                </Grid>
            </Grid>
        </Modal >
    );

}

export default Overlay;