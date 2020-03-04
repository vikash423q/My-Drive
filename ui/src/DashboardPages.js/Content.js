import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Folder from './Folder';
import File from './File';
import makeStyles from '@material-ui/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { withSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { listFolderService } from '../service';

const useStyles = makeStyles(theme => ({
    progress: {
        marginTop: theme.spacing(10),
        display: 'flex',
        justifyContent: 'center',
    },
    content: {
        padding: theme.spacing(3),
        overflowY: 'scroll',
        height: '100%'
    },
    title: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontSize: theme.typography.h6.fontSize,
        fontWeight: theme.typography.h6.fontWeightMedium
    },
    list: {
        width: '100%',
        paddingBottom: theme.spacing(1)
    },
    modified: {
        display: 'block',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        }
    }
}));

const Content = (props) => {
    const classes = useStyles();
    const state = useSelector(state => state.content);
    const dispatch = useDispatch();

    const updateContent = () => {
        console.log('loading again');
        dispatch({ type: 'LOADING', loading: true });

        listFolderService({ path: '/' }).then(data => {
            if (data.status.code !== 200)
                props.enqueueSnackbar(data.status.message, { variant: 'error' });
            else
                dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
        })
    }

    useEffect(() => updateContent(), []);

    return (
        <Box className={classes.content}>
            {!state.loading && state.loaded ? <ContentView gridView={state.gridView} list={state.data.list} /> : <Loading />}
        </Box>
    );
}

const ContentView = (props) => {
    const classes = useStyles();
    const folders = props.list.filter(item => item.type === 'folder');
    const files = props.list.filter(item => item.type === 'file');
    return (
        <div>
            {props.gridView ? <GridView folders={folders} files={files} /> : <Listview folders={folders} files={files} />}
        </div>
    );
}

const GridView = (props) => {
    const classes = useStyles();

    return (
        <Grid container>
            {props.folders.length > 0 ?
                <Grid item xs={12}><Typography className={classes.title}>Folders</Typography></Grid> : null}
            {props.folders.map((item, idx) =>
                <Grid item key={idx} xs={6} sm={4} lg={3} xl={2}>
                    <Folder item={item} gridView={true} />
                </Grid>
            )}

            {props.files.length > 0 ?
                <Grid item xs={12}><Typography className={classes.title}>Files</Typography></Grid> : null}
            {props.files.map((item, idx) =>
                <Grid item key={idx} xs={6} sm={4} lg={3} xl={2}>
                    <File item={item} gridView={true} />
                </Grid>
            )}
        </Grid>
    );
}

const Listview = (props) => {
    const classes = useStyles();

    return (
        <Grid className={classes.root}>
            {props.folders.length + props.files.length === 0 ? null :
                <ButtonBase className={classes.list}>
                    <Grid container className={classes.list}>
                        <Grid item xs={4}><Typography noWrap className={classes.text}>Name</Typography></Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>Owner</Typography></Grid>
                        <Grid item xs={0} sm={4}><Typography noWrap className={classes.modified}>lastModified</Typography></Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>File Size</Typography></Grid>
                    </Grid>
                </ButtonBase>
            }
            {
                props.folders.map((item, idx) =>
                    <Folder item={item} gridView={false} />
                )
            }

            {
                props.files.map((item, idx) =>
                    <File item={item} gridView={false} />
                )
            }

        </Grid>
    );
}

const Loading = (props) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.progress}>
            <CircularProgress />
        </Grid>
    );
}

export default withSnackbar(Content);