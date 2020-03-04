import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import dashboard_reducer from './dashboard_reducer';
import viewReducer from './view_reducer';
import binReducer from './bin_reducer';
import mydriveReducer from './mydrive_reducer';
import sharedReducer from './shared_reducer';
import starReducer from './star_reducer';
import recentReducer from './recent_reducer';
import contentReducer from './content_reducer';
import storageReducer from './storage_reducer';
import uploadReducer from './upload_reducer';
import mediaReducer from './media_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    dash: dashboard_reducer,
    view: viewReducer,
    bin: binReducer,
    mydrive: mydriveReducer,
    shared: sharedReducer,
    recent: recentReducer,
    star: starReducer,
    content: contentReducer,
    storage: storageReducer,
    upload: uploadReducer,
    media: mediaReducer
});

export default rootReducer;