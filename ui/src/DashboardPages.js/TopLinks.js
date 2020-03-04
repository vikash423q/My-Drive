import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ViewListOutlinedIcon from '@material-ui/icons/ViewListOutlined';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import makeStyles from '@material-ui/styles/makeStyles';
import { listFolderService, listSharedService, listRecentService, listBinService, listStarredService } from '../service';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { withSnackbar } from 'notistack';


const useStyles = makeStyles(theme => ({
    buttonbase: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(0.4),
        paddingBottom: theme.spacing(0.4),
        borderRadius: theme.spacing(1),
        '&:hover': {
            background: 'rgba(0,0,0,0.1)'
        }
    },
    container: {
        width: '100%',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(0),
        justifyContent: 'space-between'
    },
    item: {
        display: 'flex',
        alignItems: 'center'
    },
    link: {
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    linkText: {
        fontSize: theme.typography.h5.fontSize,
        [theme.breakpoints.down('sm')]: {
            fontSize: theme.typography.h6.fontSize
        }
    }
}));


const TopLinks = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const state = useSelector(state => ({
        type: state.view.selected,
        folder: state.content.data.folder,
        view: state.content.gridView,
        shared: state.content.data.shared
    }), shallowEqual);
    let crumbs = state.folder.split('/');
    crumbs[0] = { name: state.type, path: '/' };
    crumbs.pop();
    let path = '/';
    for (var idx = 1; idx < crumbs.length; idx++) {
        path += crumbs[idx] + '/';
        crumbs[idx] = { name: crumbs[idx], path: path };
    }

    const updateContent = (path, callback) => {
        dispatch({ type: 'LOADING', loading: true });

        callback({ path: path }).then(data => {
            if (data.status.code !== 200)
                props.enqueueSnackbar(data.status.message, { variant: 'error' });
            else
                dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: path });
        });
    }

    let callback = () => { };
    switch (state.type) {
        case 'My Drive':
            callback = listFolderService;
            break;
        case 'Shared with me':
            callback = listSharedService;
            break;
        case 'Recent':
            callback = listRecentService;
            break;
        case 'Starred':
            callback = listStarredService;
            break;
        case 'Bin':
            callback = listBinService;
            break;
        default:
            break;
    }

    return (
        <Grid container className={classes.container}>
            <Grid item className={classes.item}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="medium" />} aria-label="breadcrumb">
                    {crumbs.map((item, idx) =>
                        <ButtonBase disabled={idx !== 0 && state.shared} key={idx} className={classes.buttonbase} color="inherit" onClick={() => updateContent(item.path, (idx === 0 ? callback : listFolderService))}>
                            <Typography color="textSecondary" className={classes.linkText}>{item.name}</Typography>
                        </ButtonBase>)}
                </Breadcrumbs>
            </Grid>
            <Grid item >
                <IconButton onClick={() => dispatch({ type: 'VIEW_CHANGED' })} >
                    {
                        state.view ? <ViewListOutlinedIcon fontSize="small"></ViewListOutlinedIcon> :
                            <ViewComfyIcon fontSize="small"></ViewComfyIcon>
                    }
                </IconButton>
                <IconButton onClick={() => props.toggleDetails()}>
                    <InfoOutlinedIcon fontSize="small"></InfoOutlinedIcon>
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default withSnackbar(TopLinks);