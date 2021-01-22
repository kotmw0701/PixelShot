let img = document.createElement('img');

const px = new pixelit({ from: img, to: document.getElementById('viewer') });

document.getElementById('download').addEventListener('click', e => {
    let link = document.createElement('a');
    link.download = `${document.getElementById('file_name').value || 'download'}.png`;
    link.href = px.drawto.toDataURL('image/png')
    link.click();
})

document.getElementById('file_name').addEventListener('change', e => e.target.value = e.target.value || 'download');

let changeSize = (value, max) => {
    if (value) return Math.min(value, max) 
    else return max
}

document.getElementById('max_width').addEventListener(
    'change',
    e => px.setMaxWidth(e.target.valueAsNumber = changeSize(e.target.valueAsNumber, img.naturalWidth)).resizeImage());
document.getElementById('max_height').addEventListener(
    'change',
    e => px.setMaxHeight(e.target.valueAsNumber = changeSize(e.target.valueAsNumber, img.naturalHeight)).resizeImage());

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
