document.getElementById('screenshot').addEventListener('click', (e) => {
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
        console.log(screenshotUrl);

        // let image = new Image();
        // image.src = screenshotUrl;

        // let canvas = document.getElementById('viewer');

        // image.onload = () => {
        //     console.log(`Width: ${image.width},  Height: ${image.height}`);
        //     let scale = Math.min(canvas.width / image.width, canvas.height / image.height)
        //     canvas.getContext('2d').drawImage(image, 0, 0, image.width * scale, image.height * scale);
        // }
        // console.log('hoge');

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {base64: screenshotUrl}, (msg) => console.log(msg));
        })
    })
})