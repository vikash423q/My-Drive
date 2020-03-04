import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'; import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { useSelector, useDispatch } from 'react-redux';
import { listFolderService } from '../service';
import uploadManager from '../service/upload';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 400,
        minWidth: 344,
    },
    typography: {
        color: "white",
        fontWeight: 'bold',
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.primary.dark : "#414445",
    },
    icons: {
        marginLeft: 'auto',
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 0,
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
    list: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        overflow: 'auto',
        maxHeight: 280,
    }
}));

const trim = (str, len = 30) => {
    return str.length > len ? str.substring(0, 31) + '...' : str;
}

const SnackMessage = (props) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);
    const files = useSelector(state => state.upload.files);
    const dispatch = useDispatch();

    console.log('in SnackMessage');
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDismiss = (id) => {
        closeSnackbar(id);
    };

    useEffect(() => {
        uploadManager.addEventListeners('change', () => { dispatch({ type: 'STATUS_CHANGED' }) });
    }, []);

    let done = 0;
    let pending = 0;
    let failed = 0;
    let uploading = 0;
    for (const file of files) {
        if (file.status === 'queued') pending++;
        else if (file.status === 'failed') failed++;
        else if (file.status === 'done') done++;
        else if (file.status === 'uploading') uploading++;
    }
    let msg = '';
    if (uploading > 0) {
        msg = `uploading ${uploading} ${(uploading > 1 ? 'items' : 'item')}`;
    }
    if (done > 0) {
        msg += `${msg !== '' ? ', ' : ''} ${done} ${done > 1 ? 'items' : 'item'} uploaded`
    }
    if (failed > 0) {
        msg += `${msg !== '' ? ', ' : ''} ${failed} ${failed > 1 ? 'items' : 'item'} failed`
    }
    if (pending > 0) {
        msg += `${msg !== '' ? ', ' : ''} ${pending} ${pending > 1 ? 'items' : 'item'} pending`
    }

    return (
        <Card className={classes.card} ref={props.id} style={{ display: props.show ? 'block' : 'none' }}>
            <CardActions classes={{ root: classes.actionRoot }}>
                <Typography noWrap variant="subtitle2" className={classes.typography}>
                    {trim(msg, 42)}</Typography>
                <div className={classes.icons}>
                    <IconButton
                        className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
                        onClick={handleExpandClick}
                    >
                        <ExpandMoreIcon color="secondary" />
                    </IconButton>
                    <IconButton className={classes.expand} onClick={() => dispatch({ type: 'TOGGLE_VIEW' })}>
                        <CloseIcon color="secondary" />
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Paper className={classes.collapse}>
                    <List className={classes.list}>
                        {uploadManager.queue.map((item, idx) =>
                            <UploadItem key={item.link} item={item} idx={idx} />)}
                    </List>
                </Paper>
            </Collapse>
        </Card>
    );
};

const UploadItem = (props) => {
    const [hover, toggleHover] = React.useState(false);
    const handleClick = () => {
        if (props.item.status === 'uploading') {
            console.log('calling abort')
            props.item.controller.abort();
            props.item.cancel();
        }
    }

    const item = props.item;

    return (
        <ListItem key={props.idx} role={undefined} dense button onClick={() => { }}>
            <ListItemIcon>
                <InsertDriveFileIcon color="secondary" />
            </ListItemIcon>
            <ListItemText id={item} primary={trim(item.name)} />
            <ListItemSecondaryAction>
                <Icon onClick={handleClick} onMouseEnter={() => toggleHover(true)} onMouseLeave={() => toggleHover(false)}>
                    {item.status === 'queued' ?
                        hover ? <CancelOutlinedIcon fontSize="small" /> : <CircularProgress variant="determinate" value={100} color="secondary" size={16} thickness={6} /> :
                        item.status === 'uploading' ?
                            hover ? <CancelOutlinedIcon fontSize="small" /> : <CircularProgress variant="indeterminate" size={16} thickness={6} /> :
                            item.status === 'done' ?
                                <CheckCircleIcon style={{ color: 'green' }} fontSize="small" /> :
                                item.status === 'failed' ?
                                    <ErrorIcon color="error" fontSize="small" /> :
                                    null
                    }
                </Icon>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

SnackMessage.propTypes = {
    id: PropTypes.number.isRequired,
};

export default SnackMessage;