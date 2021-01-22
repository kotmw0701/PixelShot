let img = document.createElement('img');

const px = new pixelit({ from: img, to: document.getElementById('viewer') });





let updateImage = (base64) => {
    let image = new Image();
    image.addEventListener('load', () => {
        px.setFromImgSource(image.src);
        px.draw().pixelate();
    })
    image.src = base64;
}

window.addEventListener('load', e => { chrome.storage.local.get(['base64'], r => updateImage(r.base64)) }, false)

document.getElementById('screenshot').addEventListener('click', e => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, screenshotUrl => 
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { base64: screenshotUrl }, msg => console.log(msg)))
    )
}, false)

document.getElementById('upload').addEventListener('change', e => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => chrome.storage.local.set({ base64: reader.result }, () => console.log(`set base64: ${reader.result}`)));
    reader.readAsDataURL(image);
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'local' && changes.base64.newValue) updateImage(changes.base64.newValue);
})
