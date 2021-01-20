window.addEventListener('load', e => {
    chrome.storage.local.get(['base64'], r => {

        let image = new Image();
        image.src = r.base64;

        let download = document.getElementById('download');
        download.href = r.base64;

        image.addEventListener('load', e => {
            let canvas = document.getElementById('viewer');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
        })
    })
}, false)

document.getElementById('screenshot').addEventListener('click', e => {
    chrome.tabs.captureVisibleTab(null, {format:"png"}, (screenshotUrl) => {
        console.log(screenshotUrl);

        let download = document.getElementById('download');
        download.download = "download.png";
        download.href = screenshotUrl;

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {base64: screenshotUrl}, (msg) => console.log(msg));
        })
    })
}, false)

document.getElementById('upload').addEventListener('change', (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
        chrome.storage.local.set({base64: reader.result}, () => {})
    });
    reader.readAsDataURL(image);
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'local' && changes.base64.newValue) {
        let link = document.getElementById('download');
        link.href = changes.base64.newValue;

        let image = new Image();
        image.src = changes.base64.newValue;

        image.addEventListener('load', e => {
            let canvas = document.getElementById('viewer');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
        })
    }
})
