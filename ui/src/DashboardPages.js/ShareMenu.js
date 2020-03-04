import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { toggleSharingService, listFolderService, checkUserService, shareService } from '../service';
import { Popover, Chip, Box, Button, ListItemIcon, ListItemText, Divider, Typography, Grid, Switch } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { withSnackbar, useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
    root: {
        width: 400
    },
    item: {
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        borderBottom: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    input: {
        width: '100%',
        minHeight: 100,
        padding: theme.spacing(1),
        border: theme.palette.type === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
    }
}));

const ShareMenu = (props) => {
    const classes = useStyles();
    const [sharingOn, switchSharing] = React.useState(false);
    let prevEmails = []
    props.item.sharedWith.forEach(item => prevEmails.push(item.email));
    const [emails, addEmails] = React.useState(prevEmails);
    const emailStyle = {};
    const item = props.item;
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleShareToggle = (query) => {
        toggleSharingService(query).then(() => {
            listFolderService({ path: item.location }).then(data => {
                if (data.status.code !== 200) {
                    enqueueSnackbar(data.status.message, { variant: 'error' });
                    dispatch({ type: 'LOADING', payload: false });
                }
                else
                    dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: item.location });
            });
        });
    }

    const handleShareItem = (json) => {
        shareService(json).then((res) => {
            if (res.status.code !== 200) {
                enqueueSnackbar(res.status.message, { variant: 'error' });
                dispatch({ type: 'LOADING', payload: false });
            } else {
                enqueueSnackbar(`${item.type} shared`, { variant: 'success' });
                props.close();
            }
            listFolderService({ path: item.location }).then(data => {
                if (data.status.code !== 200) {
                    enqueueSnackbar(data.status.message, { variant: 'error' });
                    dispatch({ type: 'LOADING', payload: false });
                }
                else
                    dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: item.location });
            });
        });
    }
    return (
        <Popover
            open={Boolean(props.el)}
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
            <Grid container className={classes.root} direction="column">
                <Grid item className={classes.item}>
                    <Grid container style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography>Sharing</Typography>
                        </Grid>
                        <Grid item>
                            <Switch checked={item.shared} onChange={() => handleShareToggle({ id: item._id })} color="primary"></Switch>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.item}>
                    <Grid container style={{}} direction="column">
                        <Grid item>
                            <Typography>Emails to share with</Typography>
                        </Grid>
                        <Grid item>
                            <Box className={classes.input}>
                                <ReactMultiEmail
                                    style={emailStyle}
                                    emails={emails}
                                    onChange={_emails => {
                                        addEmails(_emails);
                                    }}
                                    validateEmail={email => {
                                        return isEmail(email);
                                        // const res = await checkUserService({ user: email });
                                        // console.log(res);
                                        // res.data = res.data || {}
                                        // return res.data.exist || false; // return boolean
                                    }}
                                    getLabel={(
                                        email,
                                        index,
                                        removeEmail,
                                    ) => {
                                        return (
                                            <Chip key={index}
                                                size="small"
                                                label={email}
                                                color="secondary"
                                                onDelete={() => removeEmail(index)}
                                            />
                                        );
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.item}>
                    {emails.length === 0 ?
                        <Button variant="contained" color="primary" onClick={props.close} >Done</Button> :
                        <Grid container>
                            <Button style={{ marginRight: 8 }} variant="contained" color="primary" onClick={() => handleShareItem({ id: item._id, emails: emails })}>Send</Button>
                            <Button variant="contained" color="secondary" onClick={props.close} >Cancel</Button>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Popover>
    )
}

export default ShareMenu;