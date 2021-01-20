// スライダー
const inputElem = document.getElementById("slider");
const currentValueElem = document.getElementById("inputNumber");

const setCurrentValue = (val) => {
    currentValueElem.value = val;
    inputElem.value = val;
}

const rangeOnChange = (e) => {
    setCurrentValue(e.target.value);
}

window.onload = () => {
    inputElem.addEventListener("input", rangeOnChange);
    setCurrentValue(inputElem.value);
    currentValueElem.addEventListener("input", rangeOnChange);
    setCurrentValue(currentValueElem.value);
}

// 画像表示
const canvas = document.getElementById("canvas")

document.getElementById('upload').addEventListener('change', (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
        chrome.storage.local.set({base64: reader.result}, () => {})
    });
})
