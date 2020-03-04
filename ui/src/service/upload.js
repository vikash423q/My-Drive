import { generateUploadLinkService, syncFileService, listFolderService, getSizeService } from '../service';
import store from '../store';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

class UploadManager {
    constructor() {
        this.queue = [];
        this.processed = -1;
        this.listeners = {
            'changed': [],
            'queued': [],
            'done': [],
            'uploading': [],
            'failed': []
        };
        this.folder = '/';
        store.subscribe(() => {
            this.folder = store.getState().content.data.folder;
            console.log(this.folder);
        })
    }

    addEventListeners(event, cb) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(cb);
    }

    removeAllListeners() {
        this.listeners = {};
    }

    emitEvent(event) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].forEach(cb => cb());
    }

    async addFiles(files, path) {
        await asyncForEach(files, async item => {
            const res = await generateUploadLinkService({ path: path, name: item.name, size: item.size });
            var controller = new AbortController();
            item.status = "queued";
            item.path = path;
            item.controller = controller;
            item.cancel = function () { this.status = 'failed' };
            if (res.status.code !== 200) { item.status = 'failed'; }
            else item.link = res.data.link;
            this.queue.push(item);
            this.emitEvent('change');
        });
        this.processFile();
    }

    async processFile() {
        if (this.queue.length === 0) return;
        while (this.processed < this.queue.length - 1) {
            this.queue[this.processed + 1].status = 'uploading';
            this.emitEvent('change');
            var res = await fetch(this.queue[this.processed + 1].link, { method: 'PUT', body: this.queue[this.processed + 1], signal: this.queue[this.processed + 1].signal });
            this.queue[this.processed + 1].status = "done";
            this.emitEvent('change');
            if (res.status !== 200) {
                this.queue[this.processed + 1].status = "failed";
                this.emitEvent('change');
            }
            await syncFileService({ path: this.queue[this.processed + 1].path, name: this.queue[this.processed + 1].name }).then(() => store.dispatch({ type: 'LOAD_STORAGE' }));
            if (this.folder === this.queue[this.processed + 1].path) {
                await listFolderService({ path: this.queue[this.processed + 1].path }).then(data => {
                    if (data.status.code === 200)
                        store.dispatch({ type: 'CONTENT_UPDATED', list: data.data.objects, loading: false, loaded: true, folder: this.queue[this.processed + 1].path });
                });
            }
            this.processed++;
        }
    }
}

const uploadManager = new UploadManager();

export default uploadManager;