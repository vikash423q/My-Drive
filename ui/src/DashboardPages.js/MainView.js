import React from 'react';
import Paper from '@material-ui/core/Paper';
import Detail from './Detail';
import Content from './Content';
import TopLinks from './TopLinks';
import makeStyles from '@material-ui/styles/makeStyles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Overlay from '../MediaViewer/Overlay';
import { useSelector, useDispatch } from 'react-redux';


const useStyles = makeStyles(theme => ({
    mainview: {
        borderRadius: 0,
        overflowY: 'auto',
        width: '100%',
        height: '100%'
    },
    divider: {
        width: '100%'
    },
    content: {
        height: 'calc(100% - 64px)'
    },
    container: {
        height: 'calc(100vh - 64px)'
    },
    details: {
        height: 'calc(100% - 64px)',
        display: 'block',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        }
    }
}));

const SideDrawer = (open, matches, toggleDetails) => (
    <SwipeableDrawer
        anchor="right"
        onOpen={() => { }}
        open={open && !matches}
        onClose={toggleDetails}
    >
        <Detail />
    </SwipeableDrawer>
);

const MainView = () => {
    const classes = useStyles();
    const state = useSelector(state => state.dash);
    const files = useSelector(state => state.content.data.list);
    const dispatch = useDispatch();
    const toggleDetails = () => dispatch({ type: 'TOGGLE_DETAIL' });
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    return (
        <Paper className={classes.mainview}>
            <Overlay />
            <Grid container className={classes.container}>
                <Grid item className={classes.link} xs={12}>
                    <TopLinks toggleDetails={toggleDetails} />
                </Grid>
                <Divider className={classes.divider} />
                <Grid item className={classes.content} xs={12} md={state.detail ? 9 : 12}>
                    <Content />
                </Grid>
                {!state.detail && matches ? null :
                    <Grid item className={classes.details} md={3}>
                        {state.detail ? <Detail /> : null}
                    </Grid>}
            </Grid>
            {SideDrawer(state.detail, matches, toggleDetails)}
        </Paper >
    );
}

export default MainView;