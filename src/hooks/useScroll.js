import { ref, onUnmounted, onMounted } from "vue";
import throttle from "@/utils/throttle";

export default function useScroll(el, handle, delay = 150) {


    let fn = throttle(handle, delay);
    let dom = window;

    onMounted(() => {
        dom = (typeof el === "string" ? document.querySelector(el) : el) || dom;
        dom.addEventListener("scroll", fn);
    });


    onUnmounted(() => {
        dom.removeEventListener("scroll", fn);
    });
}