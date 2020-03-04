import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';
import WbIncandescentRounded from '@material-ui/icons/WbIncandescentRounded';
import MoreIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import config from '../config';
import SettingPage from './SettingPage';
import SearchResult from './SearchResult';
import { searchItemsService } from '../service';


const useStyles = makeStyles(theme => ({
    appbar: {
        background: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
        [theme.breakpoints.down('sm')]: {
        },
        [theme.breakpoints.up('md')]: {
        }
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        }
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        width: '100%',
        height: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(8),
            width: 'auto',
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing(18),
            width: 'auto',
        }
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 260,
            height: 24
        },
        [theme.breakpoints.up('md')]: {
            width: 500,
            height: 32
        }
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));


const TopBar = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const inputEl = React.useRef(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [openSetting, toggleSetting] = React.useState({ mode: 'general', open: false });
    const [value, setValue] = React.useState('');
    const [searchEl, setSearchEl] = React.useState(null);
    const [searchItems, setSearchItems] = React.useState([]);
    const state = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleSearch = event => {
        setValue(event.target.value);
        searchItemsService({ name: event.target.value }).then(res => {
            if (res.status.code === 200) {
                if (res.data.objects.length > 0)
                    setSearchItems(res.data.objects);
            }
        });
    }

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSignOut = () => {
        dispatch({ type: 'AUTHENTICATION', payload: false });
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { toggleSetting({ mode: 'account', open: true }); handleMenuClose(); }}>Account</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={() => { props.makeSnack('Dark Mode ' + (!state.darkMode ? 'ON' : 'OFF'), { variant: 'info' }); dispatch({ type: 'TOGGLE_MODE', payload: !state.darkMode }) }}>
                <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    color="inherit"
                >
                    <WbIncandescentRounded />
                </IconButton>
                <p> Dark Mode</p>
            </MenuItem>
            <MenuItem onClick={() => toggleSetting({ mode: 'account', open: !openSetting.open })}>
                <IconButton
                    aria-label="account settings"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Settings />
                </IconButton>
                <p>Account</p>
            </MenuItem>
            <MenuItem>
                <Button onClick={handleSignOut} variant="outlined" size="small" style={{ marginLeft: 36 }}>Sign Out</Button>
            </MenuItem>
        </Menu>
    );

    return (
        <div>
            <AppBar className={classes.appbar} position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => { dispatch({ type: 'TOGGLE_MENU' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {config.title}
                    </Typography>
                    <div className={classes.search} >
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            ref={inputEl}
                            onChange={handleSearch}
                            onFocus={() => setSearchEl(inputEl.current)}
                            onBlur={() => setSearchEl(null)}
                            placeholder="Search…"
                            value={value}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                        <SearchResult close={() => setSearchEl(null)} anchorEl={searchEl} searchItems={searchItems} />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Tooltip title="Toggle Dark Mode">
                            <IconButton
                                aria-label="dark mode"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={() => { props.cancelSnacks(); props.makeSnack('Dark Mode ' + (!state.darkMode ? 'ON' : 'OFF'), { variant: 'info' }); dispatch({ type: 'TOGGLE_MODE', payload: !state.darkMode }) }}
                                color="inherit"
                            >
                                <WbIncandescentRounded />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Account Settings">
                            <IconButton
                                aria-label="Account Settings"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={() => toggleSetting({ mode: 'general', open: !openSetting.open })}
                                color="inherit"
                            >
                                <Settings />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <IconButton
                                edge="end"
                                aria-label="Profile"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={classes.sectionMobile}>
                        <Tooltip title="options">
                            <IconButton
                                aria-label="options"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>
            <SettingPage {...openSetting} changeMode={(val) => toggleSetting({ ...openSetting, mode: val })} close={(val) => toggleSetting({ ...openSetting, open: val })} />
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

export default TopBar;