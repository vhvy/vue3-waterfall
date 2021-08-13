import { onUnmounted, onMounted } from "vue";
import throttle from "@/utils/throttle";

export default function useScroll(el, calcDom, handle, delay = 150) {

    let lastScrollTop = 0;

    let fn = throttle((...args) => {
        const { scrollTop } = calcDom;
        const isDown = scrollTop > lastScrollTop;
        lastScrollTop = scrollTop;
        const newArgs = [...args, isDown];
        handle(...newArgs);
    }, delay);

    let dom = window;

    onMounted(() => {
        dom = (typeof el === "string" ? document.querySelector(el) : el) || dom;
        dom.addEventListener("scroll", fn);
    });


    onUnmounted(() => {
        dom.removeEventListener("scroll", fn);
    });
}