import React from 'react';
import path from 'path';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatePrevIcon from '@material-ui/icons/NavigateBefore';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { downloadSharedService, downloadFileService } from '../service';
import { LazyLog } from 'react-lazylog';
import Viewer from 'react-viewer';
import ReactPlayer from 'react-player';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconButton } from '@material-ui/core';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(theme => ({
    progress: {
        marginTop: theme.spacing(10),
        display: 'flex',
        justifyContent: 'center',
    },
    view: {
        height: '100%',
        width: '100%',
        margin: 'auto',
        opacity: 1,
        justifyContent: 'center',
        overFlowY: 'scroll',
        overFlowX: 'scroll'

    },
    icon: {
        color: 'rgba(255, 255, 255, 1)'
    }
}));


const MediaManager = (props) => {
    const classes = useStyles();
    const state = useSelector(state => state.media);
    const [pdf, setPdf] = React.useState({ numPages: null, pg: 1 });
    const dispatch = useDispatch();

    const getMimeType = (name) => {
        let supported = {
            text: ['c', 'cpp', 'java', 'html', 'py', 'txt', 'srt', 'log'],
            image: ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'],
            video: ['mp4', 'mpeg', 'mkv', 'avi', 'wmv'],
            audio: ['mp3', 'webm'],
            pdf: ['pdf']
        }
        for (var type of Object.keys(supported)) {
            for (var ext of supported[type]) {
                if (name.endsWith(ext)) {
                    return type;
                }
            }
        }
        return null;
    }

    const getFileLink = (file) => {
        let filepath = path.join(file.location, file.name);
        const downloadService = file.owner === 'me' ? downloadFileService : downloadSharedService;
        downloadService({ fileId: file._id, id: file.rootId, file: filepath }).then(data => {
            if (data.status.code !== 200) { }
            else {
                let link = data.data.link;
                console.log(link);
                dispatch({ type: 'MEDIA_LOADED', payload: true, link: link });
            }
        });
    }

    if (!state.loaded) getFileLink(state.file);
    const mimeType = getMimeType(state.file.name);
    console.log(mimeType);


    return (
        <Grid item className={classes.view}>
            {!state.loaded ? <Loading /> :
                mimeType === 'text' ? <LazyLog url={state.link} selectableLines={true} enableSearch={true} /> :
                    mimeType === 'image' ? <Viewer
                        visible={true}
                        onClose={() => { props.close() }}
                        onMaskClick={() => { props.close() }}
                        zIndex={10000}
                        noClose={true}
                        showTotal={false}
                        noNavbar={true}
                        images={[{ src: state.link, alt: state.file.name }]} /> :
                        mimeType === 'video' || mimeType === 'audio' ?
                            <ReactPlayer url={state.link} playing controls height={'100%'} width={'100%'} /> :
                            mimeType === 'pdf' ?
                                <PDFViewer link={state.link} /> : <Typography className={classes.icon} fontSize={28} >{'Unsupported File Format'}</Typography>}
        </Grid>
    );
}

const PDFViewer = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({ numPages: null, pg: 1, scale: 1, rotate: 0 });
    console.log(state);
    return (
        <Grid container direction="column" style={{ height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item style={{ height: '80%' }}>
                <Document
                    file={props.link}
                    onLoadSuccess={(doc) => setState(state => ({ ...state, numPages: doc.numPages, pg: 1 }))}
                >
                    <Page pageNumber={state.pg} rotate={state.rotate} scale={state.scale} width={500} />
                </Document>
            </Grid>
            <Grid item style={{ alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, rotate: state.rotate - 90 }))}><RotateLeftIcon /></IconButton>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, rotate: state.rotate + 90 }))}><RotateRightIcon /></IconButton>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, pg: state.pg > 1 ? state.pg - 1 : state.pg }))}><NavigatePrevIcon /></IconButton>
                <Typography className={classes.icon} variant="subtext" noWrap >{`Page ${state.pg} of ${state.numPages}`}</Typography>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, pg: state.pg < state.numPages ? state.pg + 1 : state.pg }))}><NavigateNextIcon /></IconButton>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, scale: state.scale + 0.1 }))}><ZoomInIcon /></IconButton>
                <IconButton className={classes.icon} onClick={() => setState(state => ({ ...state, scale: state.scale - 0.1 }))}><ZoomOutIcon /></IconButton>
            </Grid>
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

export default MediaManager;