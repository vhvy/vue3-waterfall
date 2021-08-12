import { ref, onUnmounted } from "vue";
import throttle from "@/utils/throttle";

export default function useResize(delay = 150) {

    const screenHeight = ref(window.innerHeight);

    const screenWidth = ref(window.innerWidth);

    function handleResize() {
        screenHeight.value = window.innerHeight;
        screenWidth.value = window.innerWidth;
    }

    const fn = throttle(handleResize, delay);

    window.addEventListener("resize", fn);

    onUnmounted(() => {
        window.removeEventListener("resize", fn);
    });

    return {
        screenHeight,
        screenWidth
    }
}