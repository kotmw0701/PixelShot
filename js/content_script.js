chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    let image = new Image();
    image.src = msg.base64;

    let picture = document.createElement("div");
    picture.classList.add("picture");

    image.onload = () => {
        let canvas = document.createElement("canvas");
        let scale = Math.min(canvas.width / image.width, canvas.height / image.height)
        canvas.getContext('2d').drawImage(image, 0, 0, image.width * scale, image.height * scale);
        picture.appendChild(canvas);
        document.body.appendChild(picture);
    }

    sendResponse("This is Response ")
})