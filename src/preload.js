const { ipcRenderer, contextBridge, desktopCapturer } = require("electron");


// Expose protected methods off of window (ie.
// window.api.require) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    getScreen: async function () {const screen = await desktopCapturer.getSources({ types: ['screen'] }); return screen;}
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    // we can also expose variables, not just functions
})