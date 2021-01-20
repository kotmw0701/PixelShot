chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    let image = new Image();
    image.src = msg.base64;

    let picture = document.createElement("div");
    picture.classList.add("picture");

    let body = document.body;

    image.addEventListener('load', () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let imageCanvas = canvas.cloneNode(true);
        imageCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
        let context = canvas.getContext('2d');
        let startX, startY;
        
        let drawRect = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        canvas.addEventListener('mousedown', e => {
            startX = e.offsetX
            startY = e.offsetY
        })

        canvas.addEventListener('mouseup', e => {
            let width = Math.abs(e.offsetX - startX);
            let height = Math.abs(e.offsetY - startY);
            if (width < 5 || height < 5) return;
            startX = Math.min(startX, e.offsetX);
            startY = Math.min(startY, e.offsetY);
            context.clearRect(startX, startY, width, height);
            context.strokeRect(startX, startY, width, height);

            let trim = document.createElement('canvas');
            trim.width = width;
            trim.height = height;
            trim.getContext('2d').drawImage(image, startX, startY, width, height, 0, 0, width, height);
            chrome.storage.local.set({base64: trim.toDataURL('image/png')}, () => {})

            document.querySelector('.picture').remove();
            body.classList.remove('--open');
        })
        context.fillStyle = "rgba(0, 0, 0, 0.5)"
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.fillRect(0, 0, canvas.width, canvas.height);
        picture.appendChild(imageCanvas);
        picture.appendChild(canvas);
        body.appendChild(picture);
        body.classList.add('--open');
    })

    sendResponse("This is Response ")
})
