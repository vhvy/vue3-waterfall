const loadImg = src => new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute("referrerpolicy", "no-referrer");
    const okCallback = () => {
        const { width, height } = img;
        resolve({
            width,
            height
        });
        cleanCallback();
    };

    const failCallBack = () => {
        reject();
        cleanCallback();
    }

    function cleanCallback() {
        img.removeEventListener("load", okCallback);
        img.removeEventListener("error", failCallBack);
        img = null;
    }

    img.addEventListener("load", okCallback);
    img.addEventListener("error", failCallBack);
    img.src = src;
});

export default loadImg;