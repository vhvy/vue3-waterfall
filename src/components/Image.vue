<template>
    <div class="img-wrap" :class="{ loading: !loaded }" :style="bg_style">
        <img
            class="img-el"
            v-lazy:[id]="img_loaded"
            referrerpolicy="no-referrer"
            :data-origin-src="src"
        />
    </div>
</template>

<script>
import lazyload from "@/directive/lazyload";
import { randomColor } from "@/utils/random";

export default {
    mixins: [lazyload],
    props: {
        id: Number,
        src: String
    },
    data() {
        return {
            loaded: false,
            bg_color: randomColor()
        }
    },
    computed: {
        bg_style() {
            return {
                "--color": this.bg_color
            }
        }
    },
    methods: {
        img_loaded() {
            this.loaded = true;
        }
    }
}
</script>

<style scoped lang="scss">
.img-wrap {
    height: calc(var(--height) * 1px);
    width: calc(var(--width) * 1px);
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    transition: all ease 0.3s;
    transform: translate3d(0, 0, 0);
    position: absolute;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    &.loading {
        background-color: var(--color);
        .img-el {
            opacity: 0;
            transform: scale(1.2);
        }
    }
}

.img-el {
    width: 100%;
    opacity: 1;
    transition: all linear 0.2s;
    transform: scale(1);
}
</style>
