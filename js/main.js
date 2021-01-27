let img = document.createElement('img');
let slider = document.getElementById('slider'), inputScale = document.getElementById('input_scale');
let list = document.querySelector('.pallet-list');

const px = new pixelit({ from: img, to: document.getElementById('viewer'), scale: 8 });

let defaultPalette = [
    [140, 143, 174],
    [88, 69, 99],
    [62, 33, 55],
    [154, 99, 72],
    [215, 155, 125],
    [245, 237, 186],
    [192, 199, 65],
    [100, 125, 52],
    [228, 148, 58],
    [157, 48, 59],
    [210, 100, 113],
    [112, 55, 127],
    [126, 196, 193],
    [52, 133, 157],
    [23, 67, 75],
    [31, 14, 28]
]

let palette = []

let addColorView = (color) => {
    let span = document.createElement('span');
    span.classList.add('pallet-item')
    span.style.background = `rgb(${color[0]},${color[1]},${color[2]})`
    span.addEventListener('click', e => {
        palette = palette.filter(i => i.toString() !== color.toString())//span.style.background.match(/\d+/g,).toString()
        chrome.storage.local.set({ palette: palette }, () => console.log(`remove palette`))
        e.currentTarget.remove();
    });
    list.appendChild(span);
}

let initPalette = () => {
    palette = defaultPalette.concat();
    palette.forEach(c => addColorView(c))
    chrome.storage.local.set({ palette: palette }, () => console.log(`init palette`))
}

window.addEventListener('load', e => {
    inputScale.value = slider.value = 8;
    chrome.storage.local.get(['base64'], r => updateImage(r.base64));
    chrome.storage.local.get(['palette'], r => {
        if (r.palette && r.palette.length) px.setPalette(palette = r.palette).getPalette().forEach(c => addColorView(c))
        else initPalette();
    });
}, false)

document.getElementById('download').addEventListener('click', e => {
    let link = document.createElement('a');
    link.download = `${document.getElementById('file_name').value || 'download'}.png`;
    link.href = px.drawto.toDataURL('image/png')
    link.click();
})

document.getElementById('file_name').addEventListener('change', e => {
    if (/[\\\/:\*\?\"\<\>\|]/gi.test(e.target.value)) { alert('ファイル名に次の文字は使えません\n \\, /, :, *, ?, ", <, >, |'); e.target.value = 'download'; }
    else if (e.target.value.length > 255) { alert('ファイル名は256文字内に収めてください'); e.target.value = ''; }
    else e.target.value = e.target.value || 'download';
});

let changeSize = (value, max) => {
    if (value) return Math.min(value, max)
    else return max
}

slider.addEventListener('change', e => px.setScale(e.target.value).pixelate())
slider.addEventListener('input', e => inputScale.value = e.target.value)
inputScale.addEventListener('change', e => {
    let param = e.target.valueAsNumber;
    (param > 0 && param <= 50 ? px.setScale(slider.value = param) : px.setScale(slider.value = inputScale.value = param > 0 ? 50 : 1)).pixelate();
});

document.getElementById('max_width').addEventListener('change', e => px.setMaxWidth(e.target.valueAsNumber = changeSize(e.target.valueAsNumber, img.naturalWidth)).resizeImage());
document.getElementById('max_height').addEventListener('change', e => px.setMaxHeight(e.target.valueAsNumber = changeSize(e.target.valueAsNumber, img.naturalHeight)).resizeImage());

document.getElementById('use_grayscale').addEventListener('change', e => {
    if (e.target.checked) px.convertGrayscale();
    else px.pixelate();
})
document.getElementById('use_palette').addEventListener('change', e => {
    if (e.target.checked) px.convertPalette();
    else px.pixelate();
})

document.getElementById('color_input').addEventListener('change', e => {
    let hex = e.target.value
    palette.push([hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(str => parseInt(str, 16)))
    addColorView(palette.slice(-1)[0])
    chrome.storage.local.set({ palette: palette }, () => console.log(`add palette`))
})

document.querySelector('.pallet-wrapper').addEventListener('mousewheel', e => {
    if (e.deltaX === 0) {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.scrollBy(e.deltaY / 5, 0);
    }
}, false)

let updateImage = (base64) => {
    let image = new Image();
    image.addEventListener('load', () => px.setFromImgSource(image.src).draw().pixelate())
    image.src = base64;
}

document.getElementById('screenshot').addEventListener('click', e => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, screenshotUrl =>
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { base64: screenshotUrl }, msg => console.log(msg)))
    )
}, false)

document.getElementById('upload').addEventListener('change', e => {
    let image = e.target.files[0];
    if (!/jpeg|png/gi.test(image.type)) { alert('.png .jpg .jpeg .jfif .pjpeg .pjp\n以外の拡張子は受け付けていません'); return; }
    let reader = new FileReader();
    reader.addEventListener('load', () => chrome.storage.local.set({ base64: reader.result }, () => console.log(`set base64: ${reader.result}`)));
    reader.readAsDataURL(image);
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'local') {
        if (changes.base64 && changes.base64.newValue) updateImage(changes.base64.newValue);
        else if (changes.palette && changes.palette.newValue) {
            console.log(changes.palette.newValue)
            px.setPalette(changes.palette.newValue.length ? changes.palette.newValue : defaultPalette);
            if (!changes.palette.newValue.length) initPalette();
        }
    }
})
