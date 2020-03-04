import React, { useEffect } from 'react';
import TopBar from './AppBar';
import SideMenu from './SideMenu';
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/styles';
import MainView from './MainView';
import { useSelector, useDispatch } from 'react-redux';
import { listFolderService } from '../service';
import uploadManager from '../service/upload';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)'
        },
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100% - 56px)'
        }
    },
    sidebar: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block'
        }
    },
    mainview: {
        padding: theme.spacing(3),
        overflowY: 'auto'
    }
}));

const SideDrawer = (open, dispatch) => (
    <SwipeableDrawer
        open={open}
        onOpen={() => { }}
        onClose={() => dispatch({ type: 'TOGGLE_MENU' })}
    >
        <SideMenu />
    </SwipeableDrawer>
);

const Dashboard = (props) => {
    const classes = useStyles();
    const state = useSelector(state => state.dash);
    const dispatch = useDispatch();

    return (
        <div style={{ height: '100vh' }}>
            <TopBar makeSnack={props.enqueueSnackbar} cancelSnacks={props.closeSnackbar} />
            <Grid container className={classes.container}>
                <Grid item lg={2} md={3} className={classes.sidebar}><SideMenu /></Grid>
                <Grid item lg={10} md={9} sm={12} xs={12}>
                    <MainView />
                </Grid>
                {SideDrawer(state.menu, dispatch)}
            </Grid>
        </div>
    );
}

export default withSnackbar(Dashboard);