import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveIcon from '@material-ui/icons/Save';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import StorageIcon from '@material-ui/icons/Storage';
import PeopleIcon from '@material-ui/icons/People';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { getStorageService, getSizeService } from '../service';
import { withSnackbar } from 'notistack';
import { createFolderService, listFolderService, listBinService, listRecentService, listSharedService, listStarredService } from '../service';

import Snackbar from '@material-ui/core/Snackbar';
import SnackMessage from './snack';
import UploadManager from './UploadManager';
import uploadManager from '../service/upload';


const useStyles = makeStyles(theme => ({
    box: {
        padding: theme.spacing(3),
        paddingLeft: 0,
        borderRadius: 0,
        height: '100%',
    },
    item: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        width: '100%',
        minWidth: 210
    },
    listItem: {
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
        paddinTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        borderRadius: '0px 24px 24px 0px',
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    fab: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        marginBottom: theme.spacing(1)
    },
    add: {
        fontSize: 24,
        fontWeight: 400,
        color: 'white'
    },
    new: {
        paddingLeft: theme.spacing(1),
        color: 'white',
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Roboto, Helvetica"
    },
    text: {
        fontSize: 13,
        fontWeight: theme.typography.fontWeightMedium
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
    }
}));


const ViewType = (props) => {
    const classes = useStyles();
    const state = useSelector(state => ({ view: state.view, content: state.content, upload: state.upload }));
    const dispatch = useDispatch();

    const handleListItemClick = (selected_type) => {
        dispatch({ type: 'VIEW_SELECTED', payload: selected_type });
        dispatch({ type: 'LOADING', loading: true });

        switch (selected_type) {
            case 'My Drive':
                listFolderService({ path: '/' }).then(data => {
                    if (data.status.code !== 200)
                        props.enqueueSnackbar(data.status.message, { variant: 'error' });
                    else
                        dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                });
                break;

            case 'Shared with me':
                listSharedService({ path: '/' }).then(data => {
                    if (data.status.code !== 200)
                        props.enqueueSnackbar(data.status.message, { variant: 'error' });
                    else
                        dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                });
                break;

            case 'Recent':
                listRecentService({ path: '/' }).then(data => {
                    if (data.status.code !== 200)
                        props.enqueueSnackbar(data.status.message, { variant: 'error' });
                    else
                        dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                });
                break;

            case 'Starred':
                listStarredService({ path: '/' }).then(data => {
                    if (data.status.code !== 200)
                        props.enqueueSnackbar(data.status.message, { variant: 'error' });
                    else
                        dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                });
                break;

            case 'Bin':
                listBinService({ path: '/' }).then(data => {
                    if (data.status.code !== 200)
                        props.enqueueSnackbar(data.status.message, { variant: 'error' });
                    else
                        dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                });
                break;

            default:
                break;
        }
    };

    return (
        <Grid item className={classes.item} xs={2}>
            <List>
                <ListItem
                    button
                    selected={state.view.selected === 'My Drive'}
                    onClick={event => handleListItemClick('My Drive')}
                    className={classes.listItem}
                >
                    <ListItemIcon><SaveIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>My Drive</Typography>} />
                </ListItem>
                <ListItem
                    button
                    selected={state.view.selected === 'Shared with me'}
                    onClick={event => handleListItemClick('Shared with me')}
                    className={classes.listItem}
                >
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>Shared with me</Typography>} />
                </ListItem>
                <ListItem
                    button
                    selected={state.view.selected === 'Recent'}
                    onClick={event => handleListItemClick('Recent')}
                    className={classes.listItem}
                >
                    <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>Recent</Typography>} />
                </ListItem>
                <ListItem
                    button
                    selected={state.view.selected === 'Starred'}
                    onClick={event => handleListItemClick('Starred')}
                    className={classes.listItem}
                >
                    <ListItemIcon><StarBorderIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>Starred</Typography>} />
                </ListItem>
                <ListItem
                    button
                    selected={state.view.selected === 'Bin'}
                    onClick={event => handleListItemClick('Bin')}
                    className={classes.listItem}
                >
                    <ListItemIcon><DeleteOutlinedIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>Bin</Typography>} />
                </ListItem>
            </List>
        </Grid>
    )
}

const FabButton = (props) => {
    const classes = useStyles();
    const state = useSelector(state => ({ view: state.view, content: state.content }));
    const dispatch = useDispatch();

    const [anchor, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchor);
    const id = open ? 'simple-popover' : undefined;

    const selectFile = (ref, setAnchorEl) => {
        ref.click();
        const updateSelection = (event, document) => {
            event.stopPropagation();
            event.preventDefault();
            var length = event.target.files.length;
            var files = event.target.files;
            files = [...Array(length)].map((item, idx) => { files[idx]['status'] = 'pending'; files[idx]['selected'] = false; return files[idx] });
            setAnchorEl(null);
            const path = state.view.selected === 'My Drive' ? state.content.data.folder : '/';
            uploadManager.addFiles(files, path);
            props.enqueueSnackbar('', {
                persist: true,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
                content: (key) => <UploadManager id={key} manager={uploadManager} />

            });
        };
        ref.addEventListener('change', (event) => updateSelection(event, document));
    }


    const [openFolder, toggleFolder] = React.useState(false);
    const [folderName, changeFolderName] = React.useState("Untitled folder");
    const handleFolderCreation = () => {
        props.enqueueSnackbar('Working...', { variant: 'info' });
        toggleFolder(!openFolder);
        const path = (state.view.selected === 'My Drive') ? state.content.data.folder : '/';
        createFolderService({ path: path, name: folderName }).then(res => {
            props.closeSnackbar();
            if (res.status.code !== 200) props.enqueueSnackbar('Failed.', { variant: 'error' });
            setAnchorEl(null);
            props.enqueueSnackbar('Done.', { variant: 'success' });
            listFolderService({ path: path }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: path });
                dispatch({ type: 'VIEW_SELECTED', payload: 'My Drive' });
            });
        });
    }

    var inputRef = React.createRef();
    return (
        <Grid item className={classes.item} xs={2}>
            <Container>
                <Fab variant="extended" onClick={handleClick} className={classes.fab}><AddIcon className={classes.add} /><Typography className={classes.new}>New</Typography></Fab>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchor}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Paper style={{ paddingTop: 8, paddingBottom: 8 }}>
                        <input type="file" ref={ref => (inputRef = ref)} style={{ display: 'none' }} multiple />
                        <List>
                            <ListItem button onClick={() => selectFile(inputRef, setAnchorEl)} style={{ marginTop: 1, marginBottom: 1, minWidth: 220 }}
                            >
                                <ListItemIcon><NoteAddIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary={<Typography variant="h6" className={classes.text}>File upload</Typography>} />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => toggleFolder(!openFolder)} style={{ marginTop: 1, marginBottom: 1 }}
                            >
                                <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
                                <ListItemText primary={<Typography variant="h6" className={classes.text}>Create folder</Typography>} />
                            </ListItem>
                        </List>
                    </Paper>
                </Popover>
                <Dialog open={openFolder} onClose={() => toggleFolder(!openFolder)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" onClose={() => toggleFolder(!openFolder)}>New Folder</DialogTitle>
                    <DialogContent>
                        <TextField
                            variant="outlined"
                            autoFocus
                            margin="dense"
                            style={{ minWidth: 280 }}
                            id="name"
                            onChange={(e) => changeFolderName(e.target.value)}
                            defaultValue={folderName}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => toggleFolder(!openFolder)} color="secondary">
                            Cancel
                                </Button>
                        <Button variant="contained" size="small" onClick={handleFolderCreation} color="primary">
                            Create
                                </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Grid>
    );
}

const SideMenu = (props) => {
    const classes = useStyles();
    return (
        <Paper className={classes.box}>
            <Grid container className={classes.container}>
                <Grid item xs={1} className={classes.item}><FabButton enqueueSnackbar={props.enqueueSnackbar} closeSnackbar={props.closeSnackbar} /></Grid>
                <Grid item xs={1} className={classes.item}><Divider /></Grid>
                <ViewType enqueueSnackbar={props.enqueueSnackbar} />
                <Grid item xs={1} className={classes.item}><Divider /></Grid>
                <Storage />
            </Grid>
        </Paper>
    );
}

const Storage = (props) => {
    const classes = useStyles();
    const state = useSelector(state => state.storage);
    const dispatch = useDispatch();

    useEffect(() => {
        if (state.load) {
            getStorageService().then((res) => dispatch({ type: 'CAPACITY_UPDATED', payload: res.data.storage }));
            getSizeService({ path: '/' }).then((res) => dispatch({ type: 'STORAGE_UPDATED', payload: res.data.Mb }));
        }
    });

    return (
        <Grid item xs={2} className={classes.item}>
            <List>
                <ListItem
                    className={classes.listItem}
                >
                    <ListItemIcon><StorageIcon /></ListItemIcon>
                    <ListItemText primary={<Typography variant="h6" className={classes.text}>Storage</Typography>}
                        secondary={<Secondary alloted={state.alloted} used={state.used} classes={classes} />} />
                </ListItem>
            </List>
        </Grid>
    );
}

const Secondary = (props) => {
    const [openSetting, toggleSetting] = React.useState({ mode: 'general', open: false });
    return (
        <Box>
            <LinearProgress variant="determinate" value={(props.used * 100 / props.alloted)} style={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="subtitle2" className={props.classes.subtext}>{`${props.used} Mb of ${props.alloted} Mb used`}</Typography>
            <ButtonBase disabled className={props.classes.btn} onClick={() => toggleSetting({ mode: 'account', open: !openSetting.open })}>UPGRADE STORAGE</ButtonBase>
        </Box>);
};

export default withSnackbar(SideMenu);