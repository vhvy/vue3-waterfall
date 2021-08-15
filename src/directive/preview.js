import preview from "@/utils/preview";

const previewImg = ({ target }) => {
    if (target.nodeName == "IMG" && target.hasAttribute('src')) {
        preview(target.getAttribute('src'));
    }
}

export default {
    directives: {
        preview: {
            mounted(el) {
                el.addEventListener("click", previewImg);
            },
            unmounted(el) {
                el.removeEventListener("click", previewImg);
            }
        }
    }
}