// スライダー
const sliderElem = document.getElementById("slider");
const inputElem = document.getElementById("inputNumber");

const setCurrentValue = (val) => {
    let array = ("" + val).split("");
    if (array[0] == 0 || array[0] == "-") {
        inputElem.value = 1;
        sliderElem.value = 1;
        array = [];
    } else if (inputElem.value > 50) {
        inputElem.value = 50;
        sliderElem.value = 50;
    } else {
        inputElem.value = val;
        sliderElem.value = val;
    }
}

const rangeOnChange = (e) => {
    setCurrentValue(e.target.value);
}

window.onload = () => {
    sliderElem.addEventListener("input", rangeOnChange);
    setCurrentValue(sliderElem.value);
    inputElem.addEventListener("input", rangeOnChange);
    setCurrentValue(inputElem.value);
}

// 画像表示
const canvas = document.getElementById("canvas")

document.querySelector('input[type="file"]').onchange = function () {
    let img = this.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onload = function () {
        drawImage(reader.result)
    }
}

function drawImage(url) {
    let ctx = canvas.getContext('2d')
    let image = new Image()
    image.src = url
    image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
    }
}


