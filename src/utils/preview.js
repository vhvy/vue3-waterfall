import loadImg from "@/utils/loadImg";

class PreviewImg {
    static content = null;
    static imgEl = null;
    static bodyOverflow = null;

    static initDom() {
        this._inited = true;

        const style = `
        <style>
        .preview-wrap {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(0,0,0, 0.4);
            opacity: 0;
            z-index: -1;
            transition: all ease .3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .preview-wrap.show {
            opacity: 1;
            z-index: 10;
        }

        .preview-img.limit-width {
            width: 80vw;
            height: auto;
        }

        .preview-img.limit-height {
            width: auto;
            height: 80vh;
        }
        </style>
        `;

        const content = `
        <div class="preview-wrap">
            <img class="preview-img" referrerpolicy="no-referrer" />
        </div>
        `;

        const wrap = document.createElement("div");

        wrap.innerHTML = style + content;

        document.body.append(wrap);

        this.content = document.querySelector(".preview-wrap");
        this.imgEl = document.querySelector(".preview-wrap .preview-img");

        this.content.addEventListener("click", ({ target }) => {
            target === this.content && this.hide();
        });
    }

    static hide() {
        document.body.style.overflow = this.bodyOverflow;
        this.content.classList.remove("show");
    }

    static show(src) {
        loadImg(src)
            .then(({ width, height }) => {
                this.imgEl.setAttribute("src", src);
                const addClassName = width > height ? "limit-width" : "limit-height";
                const removeClassName = width > height ? "limit-height" : "limit-width";


                this.imgEl.classList.remove(removeClassName);
                this.imgEl.classList.add(addClassName);

                this.bodyOverflow = document.body.style.overflow;
                document.body.style.overflow = "hidden";
                this.content.classList.add("show");
            });
    }

    static preview(src) {
        if (!this.content) {
            this.initDom();
            window.requestAnimationFrame(() => {
                this.show(src);
            });
            // 待DOM插入后有了初始状态才能开始添加动画
        } else {
            this.show(src);
        }
    }
}


const preview = (src) => PreviewImg.preview(src);


export default preview;