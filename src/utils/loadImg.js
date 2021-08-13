class ImgManage {
    static CacheMap = new Map();

    static loadImg(src) {
        return new Promise((resolve, reject) => {

            if (this.CacheMap.has(src)) {
                return resolve(this.CacheMap.get(src));
            }
            // 如果已经加载过图片，直接resolve图片信息

            let img = new Image();
            img.setAttribute("referrerpolicy", "no-referrer");
            const okCallback = () => {
                const { width, height } = img;
                const info = { width, height };
                this.CacheMap.set(src, info);
                // 缓存图片信息

                resolve(info);
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
    }
}





const loadImg = src => ImgManage.loadImg(src);

export default loadImg;