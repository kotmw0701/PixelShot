// スライダー
const inputElem = document.getElementById("slider");
const currentValueElem = document.getElementById("inputNumber");

const setCurrentValue = (val) => {
    if (currentValueElem.value > 50) {
        currentValueElem.value = 50;
        inputElem.value = val;
    } else {
        currentValueElem.value = val;
        inputElem.value = val;
    }
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
