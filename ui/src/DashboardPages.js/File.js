import path from 'path';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import IconButton from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Image from 'material-ui-image';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import makeStyles from '@material-ui/styles/makeStyles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import RestoreOutlinedIcon from '@material-ui/icons/RestoreOutlined';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import OpenWithOutlinedIcon from '@material-ui/icons/OpenWithOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import FileIcon, { defaultStyles } from 'react-file-icon';
import ShareMenu from './ShareMenu';
import { useDispatch } from 'react-redux';
import { listFolderService, starFileService, downloadSharedService, deleteService, listBinService, deleteForeverService, restoreService, downloadFileService, listSharedService } from '../service';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
    box: {
        width: '80%',
        elavation: theme.spacing(1),
        padding: 0,
        margin: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.8),
        border: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(0, 0, 0, 0.16)',
        '&:hover': {
            background: theme.palette.type === 'dark' ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.12)',
            '& $text': {
                color: theme.palette.type === 'dark' ? 'lightBlue' : theme.palette.primary.main
            }
        },

    },
    list: {
        width: '100%',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
        borderBottom: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(0, 0, 0, 0.16)',
        '&:hover': {
            background: theme.palette.type === 'dark' ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.12)',
            '& $text': {
                color: theme.palette.type === 'dark' ? 'lightBlue' : theme.palette.primary.main
            }
        },
    },
    image: {
        color: theme.palette.background.paper,
        borderTopLeftRadius: theme.spacing(0.8),
        borderTopRightRadius: theme.spacing(0.8)
    },
    preview: {
        // padding: theme.spacing(1.5),
        alignContent: 'center',
        justifyContent: 'space-around',
        height: 150,
        width: '100%',
        borderBottom: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    text: {
        overflowX: 'hidden',
        width: '100%',
        fontWeight: 600,
        fontSize: 12,
        color: theme.palette.text.secondary
    },
    modified: {
        overflowX: 'hidden',
        width: '100%',
        fontWeight: 600,
        fontSize: 12,
        color: theme.palette.text.secondary,
        display: 'block',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            display: 'block'
        }
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%',
        minHeight: 24,
        padding: theme.spacing(0.5),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)

    },
    name: {
        padding: theme.spacing(1)
    },
    dialogText: {
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.text.primary
    },
    info: {
        width: '100%'
    },
    icon: {
        background: theme.palette.type === 'dark' ? 'grey' : theme.palette.primary.main,

    }

}));

const File = (props) => {
    const classes = useStyles();

    const fileEl = React.useRef(null);
    const [menuAnchor, setAnchorEl] = React.useState(null);
    const [shareAnchor, setShareAnchor] = React.useState(null);
    const open = Boolean(menuAnchor);
    const dispatch = useDispatch();

    const splits = props.item.name.split('.');
    const ext = splits.length > 0 ? splits[splits.length - 1] : null;

    const name = props.item.name.substring(0, 30);

    console.log(ext)
    return props.gridView ?
        (
            <React.Fragment>
                <ButtonBase ref={fileEl} className={classes.box} onClick={() => dispatch({ type: 'OPEN_MEDIA', item: props.item })} onContextMenu={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget) }}>
                    <Grid container direction="column">
                        <Grid container item className={classes.preview}>
                            <FileIcon extension={ext} fold={false} labelColor={'whitesmoke'} glyphColor={'rgba(0, 0, 0, 0.4)'} labelTextColor={'rgba(0, 0, 0, 0.4)'} radius={4} size={'50%'} {...defaultStyles[ext]} />
                        </Grid>
                        <Grid item className={classes.info}>
                            <Grid container className={classes.container}>
                                {/* <Grid item xs={2}><IconButton size="small"><FileIcon extension={ext} size={24} {...defaultStyles[ext]} /></IconButton></Grid> */}
                                <Grid item className={classes.name} xs={10}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '100%' }}>
                                        <Typography noWrap className={classes.text}>{name}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ButtonBase>
                <FileDialog el={menuAnchor} open={open} openShareMenu={() => setShareAnchor(fileEl.current)} item={props.item} close={() => setAnchorEl(null)} />
                <ShareMenu close={() => setShareAnchor(null)} el={shareAnchor} item={props.item} />
            </React.Fragment>
        ) :
        (
            <React.Fragment>
                <ButtonBase ref={fileEl} className={classes.list} onClick={() => dispatch({ type: 'OPEN_MEDIA', item: props.item })} onContextMenu={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget) }}>
                    {/* <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <InsertDriveFileIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={props.item.name} secondary={props.item.modifiedOn} />
                    </ListItem> */}
                    <Grid container>
                        <Grid item xs={4}>
                            <Grid container>
                                <Grid item xs={2}><FileIcon extension={ext} size={24} {...defaultStyles[ext]} /></Grid>
                                <Grid item xs={10}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '100%' }}>
                                        <Typography noWrap className={classes.text}>{name}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>{props.item.owner}</Typography></Grid>
                        <Grid item sm={4}><Typography noWrap className={classes.modified}>{props.item.modifiedOn}</Typography></Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>{prettyBytes(props.item.size)}</Typography></Grid>
                    </Grid>
                </ButtonBase>
                <FileDialog el={menuAnchor} open={open} openShareMenu={() => setShareAnchor(fileEl.current)} item={props.item} close={() => setAnchorEl(null)} />
                <ShareMenu close={() => setShareAnchor(null)} el={shareAnchor} item={props.item} />
            </React.Fragment>
        );
}

const FileDialog = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleOpen = () => {
        props.close();
        dispatch({ type: 'OPEN_MEDIA', item: props.item });
    }

    const handleStar = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        const listService = props.item.owner === 'me' ? listFolderService : listSharedService;
        const path = props.item.owner === 'me' ? props.item.location : '/';
        starFileService({ id: props.item._id, value: !props.item.starred }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar('Done.', { variant: 'success' });
            listService({ path: path }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: path });
                dispatch({ type: 'VIEW_SELECTED', payload: props.item.owner === 'me' ? 'My Drive' : 'Shared with me' });
            });
            props.close();
        });
    }

    const handleRemove = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        deleteService({ id: props.item._id }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar('Moved to Bin', { variant: 'success' });
            listFolderService({ path: props.item.location }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: props.item.location });
                dispatch({ type: 'VIEW_SELECTED', payload: 'My Drive' });
            });
            dispatch({ type: 'LOAD_STORAGE' });
        });
        props.close();
    }

    const handleRestore = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        restoreService({ id: props.item._id }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar('Restore from Bin', { variant: 'success' });
            listFolderService({ path: props.item.location }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: props.item.location });
                dispatch({ type: 'VIEW_SELECTED', payload: 'My Drive' });
            });
            dispatch({ type: 'LOAD_STORAGE' });
        });
        props.close();
    }

    const handleDeleteForever = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        deleteForeverService({ id: props.item._id }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar(props.item.type + ' removed', { variant: 'success' });
            listBinService({ path: '/' }).then(data => {
                dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: '/' });
                dispatch({ type: 'VIEW_SELECTED', payload: 'Bin' });
            });
            dispatch({ type: 'LOAD_STORAGE' });
        });
        props.close();
    }

    const handleDownload = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        let filepath = path.join(props.item.location, props.item.name);
        const downloadService = props.item.owner === 'me' ? downloadFileService : downloadSharedService;
        downloadService({ fileId: props.item._id, id: props.item.rootId, file: filepath }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else {
                let link = document.createElement('a');
                link.href = data.data.link;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                enqueueSnackbar('Download will start soon', { variant: 'success' });
            }
        });
    }


    if (props.item.trashed) {
        return (
            <Popover
                open={props.open}
                anchorEl={props.el}
                onClose={props.close}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <List style={{ minWidth: 240 }}>
                    <ListItem button onClick={handleRestore}>
                        <ListItemIcon><RestoreOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Restore</Typography>} />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={handleDeleteForever}>
                        <ListItemIcon><DeleteForeverIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Delete Forever</Typography>} />
                    </ListItem>
                </List>
            </Popover>
        );
    }
    else {

        return (
            <Popover
                open={props.open}
                anchorEl={props.el}
                onClose={props.close}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <List style={{ minWidth: 240 }}>
                    <ListItem button onClick={handleOpen}>
                        <ListItemIcon><KeyboardArrowRightOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Open</Typography>} />
                    </ListItem>
                    <Divider />
                    {props.item.owner === 'me' ?
                        <ListItem button onClick={() => { props.openShareMenu(); props.close() }}>
                            <ListItemIcon><PersonAddIcon /></ListItemIcon>
                            <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Share</Typography>} />
                        </ListItem> : null}
                    {props.item.owner === 'me' || props.item._id === props.item.rootId ?
                        <Grid container direction="column">
                            <ListItem button onClick={handleStar}>
                                <ListItemIcon><StarBorderOutlinedIcon /></ListItemIcon>
                                <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>{props.item.starred ? 'Remove from Starred' : 'Add to Starred'}</Typography>} />
                            </ListItem>
                            <Divider /></Grid> : null}
                    <ListItem button onClick={() => dispatch({ type: 'GET_DETAIL', payload: props.item })}>
                        <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>View details</Typography>} />
                    </ListItem>
                    <ListItem button onClick={handleDownload}>
                        <ListItemIcon><GetAppOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Download</Typography>} />
                    </ListItem>
                    {props.item.owner === 'me' ?
                        <Divider /> : null}
                    {props.item.owner === 'me' ?
                        <ListItem button onClick={handleRemove}>
                            <ListItemIcon><DeleteSweepOutlinedIcon /></ListItemIcon>
                            <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Remove</Typography>} />
                        </ListItem> : null}
                </List>
            </Popover>
        );
    }
}

export default File;