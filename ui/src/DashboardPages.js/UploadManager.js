import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import uploadManager from '../service/upload';
import { generateUploadLinkService, listFolderService, syncFileService, getStorageService, getSizeService } from '../service';
import SnackMessage from './snack';

const UploadManager = React.forwardRef((props, ref) => {
    const queued = useSelector(state => state.upload.show);
    console.log(queued);
    return (
        <SnackMessage id={ref} show={queued} />
    );
});

export default UploadManager;