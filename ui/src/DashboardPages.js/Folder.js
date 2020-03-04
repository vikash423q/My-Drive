import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

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
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import ShareMenu from './ShareMenu';
import { listFolderService, starFileService, deleteService, listBinService, getSizeService, deleteForeverService, restoreService, listSharedFolderService } from '../service';
import { withSnackbar, useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
    box: {
        width: '80%',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(1.2),
        paddingRight: theme.spacing(1.2),
        margin: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.6),
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
    text: {
        fontSize: 12,
        fontWeight: 600,
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
    dialogText: {
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.text.primary
    },
    name: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
        color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.5)',
    }

}));




const Folder = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const folderEl = React.useRef(null);

    const [menuAnchor, setAnchorEl] = React.useState(null);
    const [shareAnchor, setShareAnchor] = React.useState(null);

    const open = Boolean(menuAnchor);

    const name = props.item.name.substring(0, 30);

    const selectFolder = () => {
        console.log('selectFolder called');
        dispatch({ type: 'LOADING', payload: true });
        const path = props.item.location + props.item.name + '/';
        const shared = props.item.owner !== 'me';
        const listService = shared ? listSharedFolderService : listFolderService;
        const req = shared ? { id: props.item.rootId, folderId: props.item._id } : { path: path };
        console.log(req);
        listService(req).then(data => {
            console.log(data.data);
            if (data.status.code !== 200) {
                enqueueSnackbar(data.status.message, { variant: 'error' });
                dispatch({ type: 'LOADING', payload: false });
            }
            else
                dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: path, shared: shared });
        });
    }

    return props.gridView ?
        (
            <React.Fragment>
                <ButtonBase ref={folderEl} className={classes.box} onContextMenu={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget); }} onClick={() => selectFolder(props.item, dispatch, props)}>
                    <Grid container className={classes.container}>
                        <Grid item xs={3}><IconButton size="small">{props.item.shared ? <FolderSharedIcon className={classes.icon} /> : props.item.starred ? <FolderSpecialIcon className={classes.icon} /> : <FolderIcon className={classes.icon} />}</IconButton></Grid>
                        <Grid item className={classes.name} xs={9}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '100%' }}>
                                <Typography noWrap className={classes.text}>{name}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </ButtonBase>
                <FolderDialog selectFolder={selectFolder} el={menuAnchor} open={open} openShareMenu={() => setShareAnchor(folderEl.current)} item={props.item} close={() => setAnchorEl(null)} />
                <ShareMenu close={() => setShareAnchor(null)} el={shareAnchor} item={props.item} />
            </React.Fragment>
        ) :
        (
            <React.Fragment>
                <ButtonBase ref={folderEl} className={classes.list} onContextMenu={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget); }} onClick={() => selectFolder(props.item, dispatch, props)}>
                    {/* <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={props.item.name} secondary={props.item.modifiedOn} />
                    </ListItem> */}
                    <Grid container>
                        <Grid item xs={4}>
                            <Grid container>
                                <Grid item xs={2}>{props.item.starred ? <FolderSpecialIcon className={classes.icon} /> : props.item.shared ? <FolderSharedIcon className={classes.icon} /> : <FolderIcon className={classes.icon} />}</Grid>
                                <Grid item xs={10}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '100%' }}>
                                        <Typography noWrap className={classes.text}>{name}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>{props.item.owner}</Typography></Grid>
                        <Grid item xs={0} sm={4}><Typography noWrap className={classes.modified}>{props.item.modifiedOn}</Typography></Grid>
                        <Grid item xs={2}><Typography noWrap className={classes.text}>---</Typography></Grid>
                    </Grid>
                </ButtonBase>
                <FolderDialog selectFolder={selectFolder} el={menuAnchor} open={open} openShareMenu={() => setShareAnchor(folderEl.current)} item={props.item} close={() => setAnchorEl(null)} />
                <ShareMenu close={() => setShareAnchor(null)} el={shareAnchor} item={props.item} />
            </React.Fragment >
        )
}

const FolderDialog = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleStar = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        starFileService({ id: props.item._id, value: !props.item.starred }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar('Done.', { variant: 'success' });
            listFolderService({ path: props.item.location }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: props.item.location });
                dispatch({ type: 'VIEW_SELECTED', payload: 'My Drive' });
            });
            props.close();
        });
    }

    const handleRemove = () => {
        enqueueSnackbar('Working...', { variant: 'info' });
        deleteService({ id: props.item._id }).then(data => {
            closeSnackbar();
            if (data.status.code !== 200) enqueueSnackbar('Failed. ' + data.status.message, { variant: 'error' });
            else enqueueSnackbar('Done.', { variant: 'success' });
            listFolderService({ path: props.item.location }).then(res => {
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, folder: props.item.location });
                dispatch({ type: 'VIEW_SELECTED', payload: 'My Drive' });
            });
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
            getSizeService({ path: '/' }).then((res) => dispatch({ type: 'STORAGE_UPDATED', payload: res.data.Mb }));
        });
        props.close();
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
                    <ListItem button onClick={props.selectFolder}>
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
                            <Divider />
                        </Grid> : null}
                    <ListItem button onClick={() => dispatch({ type: 'GET_DETAIL', payload: props.item })}>
                        <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>View details</Typography>} />
                    </ListItem>
                    {props.item.owner === 'me' ?
                        <Divider /> : null}
                    <ListItem button onClick={handleRemove}>
                        <ListItemIcon><DeleteSweepOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={<Typography variant="h5" className={classes.dialogText}>Remove</Typography>} />
                    </ListItem>
                </List>
            </Popover>
        );
    }
}

export default withSnackbar(Folder);
