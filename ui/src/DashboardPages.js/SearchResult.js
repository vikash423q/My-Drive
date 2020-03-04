import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import { ListItem, Popper, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { listFolderService, listSharedService } from '../service';

const StyledMenu = withStyles(theme => ({
    popper: {
        [theme.breakpoints.down('md')]: {
            width: 320
        },
        [theme.breakpoints.up('md')]: {
            width: 540
        }
    }
}))(props => (
    <Popper
        className={props.classes.popper}
        {...props}
    />
));

const useStyles = makeStyles(theme => ({
    root: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            },
        },
    }
}));

export default function SearchResult(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClick = (item) => {
        console.log(item);
        const listService = item.owner === 'me' ? listFolderService : listSharedService;
        listService({ path: item.location }).then(res => {
            if (res.status.code !== 200) {

            } else {
                if (item.shared && item.owner !== 'me') { dispatch({ type: 'VIEW_SELECTED', payload: 'Shared with me' }); }
                dispatch({ type: 'CONTENT_UPDATED', list: res.data.objects, loading: false, loaded: true, folder: item.location });
            }
        })
    }

    return (
        <StyledMenu
            anchorEl={props.anchorEl}
            open={Boolean(props.anchorEl)}
            onClose={props.close}
        > <Paper>
                {
                    props.searchItems.map(item => <ListItem onClick={() => { handleClick(item); props.close() }} className={classes.root}>
                        <ListItemIcon>
                            {item.type === 'file' ? <InsertDriveFileIcon /> : item.starred ? <FolderSpecialIcon /> : item.shared ? <FolderSharedIcon /> : <FolderIcon />}
                        </ListItemIcon>
                        <ListItemText primary={item.name.substring(0, 30)} secondary={item.shared && item.owner !== 'me' ? `Shared\tlocation : ${item.location}` : `location : ${item.location}`} />
                    </ListItem>)
                }
            </Paper>
        </StyledMenu>
    );
}