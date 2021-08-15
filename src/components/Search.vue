<template>
    <div class="search-box" :class="{ show }">
        <div class="search-content">
            <input v-model="query" class="input" />
            <div @click="search" class="btn">
                <svg width="20" height="20" class="search-icon" viewBox="0 0 20 20">
                    <path
                        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                        stroke="currentColor"
                        fill="none"
                        fill-rule="evenodd"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import useScroll from "@/hooks/useScroll";

export default {
    setup() {
        const show = ref(false);

        useScroll(window, document.documentElement, (e, isDown) => {
            show.value = !isDown;
        }, 80);

        return {
            show
        }
    },
    data() {
        return {
            query: "",
        }
    },
    methods: {
        search() {
            this.$emit("search", this.query);
        }
    }
}
</script>

<style scoped lang="scss">
.search-box {
    $width: 400px;
    position: fixed;
    z-index: 1;
    top: 20px;
    max-width: 80vw;
    width: $width;
    padding: 12px;
    background-color: #f5f6f7;
    border-radius: 5px;
    left: calc(50%);
    box-shadow: 0 0 5px 0px rgb(0 0 0 / 64%);
    transition: all ease 0.3s;
    transform: translateY(-150%) translateX(-50%);
    &.show {
        transform: translateY(0) translateX(-50%);
    }
}

$color: #42b983;
.search-content {
    border: 2px solid $color;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    align-items: center;
}

.input {
    border: none;
    outline: none;
    height: 50px;
    padding: 0 1em;
    background-color: transparent;
    flex: 1;
    font-size: 20px;
}

.btn {
    padding-right: 1em;
    cursor: pointer;
}

.search-icon {
    height: 24px;
    width: 24px;
    color: $color;
}
</style>
