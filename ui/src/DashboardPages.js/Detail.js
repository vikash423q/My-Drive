import React from 'react';
import prettyBytes from 'pretty-bytes';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Close from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Image from 'material-ui-image';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import makeStyles from '@material-ui/styles/makeStyles';
import FileIcon, { defaultStyles } from 'react-file-icon';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
    details: {
        maxWidth: 300,
        padding: theme.spacing(0.6),
        height: '100%',
        overflowY: 'scroll',
        borderLeft: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
    },
    heading: {
        maxWidth: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0.4),
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        borderRadius: theme.spacing(1)
    },
    preview: {
        justifyContent: 'space-around',
        alignContent: 'center',
        marginTop: theme.spacing(2)
    },
    values: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(3),
    },
    key: {
        marginBottom: theme.spacing(0.4),
        fontSize: 13,
        color: theme.palette.text.hint
    },
    value: {
        fontSize: 13,
        color: theme.palette.text.secondary
    },
    folder: {
        fontSize: 96,
        color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.5)',
    }
}));


const Detail = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const state = useSelector(state => ({ item: state.dash.detailEntity, content: state.content, view: state.view, size: state.storage.used }));
    const toggleDetails = () => dispatch({ type: 'TOGGLE_DETAIL' });

    const item = state.item || { name: 'Nothing Selected', type: 'My Drive', shared: false, size: state.size, location: '/', owner: 'me' };
    let emails_shared = '';
    for (var idx in item.sharedWith) {
        emails_shared += item.sharedWith[idx].email + '\n';
    }
    let ext = null;
    if (item.type === 'file') {
        const splits = item.name.split('.');
        ext = splits.length > 0 ? splits[splits.length - 1] : null;
    }

    return (
        <Box className={classes.details}>
            <Grid container direction="column">
                <Grid item >
                    <Grid container className={classes.heading}>
                        <Typography noWrap style={{ maxWidth: '100%' }} color="textPrimary">{item.name}</Typography>
                        <IconButton onClick={toggleDetails}><Close /></IconButton>
                    </Grid>
                </Grid>
                <Grid item >
                    <Grid container className={classes.heading}>
                        <Typography color="textSecondary" size="large">Details</Typography>
                        <Divider style={{ width: '100%', height: '2px' }} />
                    </Grid>
                </Grid>

            </Grid>
            <Grid container className={classes.values}>
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Type</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.type}</Typography></Grid>
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Size</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.type === 'folder' ? '---' : prettyBytes(item.size || 0)}</Typography></Grid>
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Location</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.location}</Typography></Grid>
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Owner</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.owner}</Typography></Grid>
                {item.shared ?
                    <Grid container><Grid item xs={4}><Typography className={classes.key} color="textSecondary">Shared</Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.shared ? 'Yes' : 'No'}</Typography></Grid>
                    </Grid> : null}
                {item.shared ?
                    <Grid container><Grid item xs={4}><Typography className={classes.key} color="textSecondary">Shared With</Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{emails_shared}</Typography></Grid>
                    </Grid> : null}
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Modified</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.modifiedOn}</Typography></Grid>
                <Grid item xs={4}><Typography className={classes.key} color="textSecondary">Created</Typography></Grid>
                <Grid item xs={8}><Typography className={classes.value} color="textSecondary">{item.createdOn}</Typography></Grid>
            </Grid>
            <Grid container item className={classes.preview}>
                {item.type === 'file' ?
                    <FileIcon extension={ext} fold={false} labelColor={'whitesmoke'} glyphColor={'rgba(0, 0, 0, 0.4)'} labelTextColor={'rgba(0, 0, 0, 0.4)'} radius={4} size={'50%'} {...defaultStyles[ext]} /> :
                    <FolderIcon className={classes.folder} />}
            </Grid>
        </Box>
    );
}

export default Detail;