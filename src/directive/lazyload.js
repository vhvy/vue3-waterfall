import IO from "@/utils/observer";
import loadImg from "@/utils/loadImg";

export default {
    directives: {
        lazy: {
            mounted(el, binding) {
                IO.observe(el, () => {
                    const src = el.getAttribute("data-origin-src");
                    loadImg(src)
                        .then(() => {
                            el.src = src;
                            binding.value(binding.arg);
                            IO.unobserver(el);
                        });
                });
            },
            unmounted(el) {
                IO.unobserver(el);
            }
        }
    }
}