<template>
  <div></div>
</template>

<script>
import useHuaban from "@/hooks/useHuaban";
import useResize from "@/hooks/useResize";

export default {
  setup() {
    const { q, setQ, images, getImages } = useHuaban();
    const { screenHeight, screenWidth } = useResize();

    return {
      images,
      screenHeight,
      screenWidth,
    };
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>
