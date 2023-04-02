const { ipcRenderer, contextBridge, desktopCapturer } = require("electron");
const electron = require("electron");
const dialog = electron.remote.dialog;
const path = require("path");
const fs = require("fs");
const webmFixDuration = require('webm-fix-duration').webmFixDuration;


const Buffer = require('buffer/').Buffer;
//console.log(Buffer.from("41", 'hex')[0]); returns 65


let fixedBlob = "";


// Expose protected methods off of window (ie.
// window.api.fs()) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    getScreen: async function () { const screen = await desktopCapturer.getSources({ types: ['screen'] }); return screen; },
    dialog: () => dialog,
    path: () => path,
    fs: () => fs,
    buffer: (data) => Buffer.from(data, 'base64'),
    minimizeWindow: () => ipcRenderer.send('videoStart'),
    onPauseRecording: (callback) => ipcRenderer.on('pauseTheRecording', callback)
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
})
