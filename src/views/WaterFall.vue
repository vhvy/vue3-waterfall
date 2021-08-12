<template>
  <div class="waterfall-wrap">
    <Image v-for="item of imagesInfo" :id="item.id" :key="item.id" :style="item.styles" :src="item.url" />
  </div>
</template>

<script>
import useHuaban from "@/hooks/useHuaban";
import useImagePos from "@/hooks/useImagePos";
import useBottomLoad from "@/hooks/useBottomLoad";
import { ref } from "vue";
import Image from "@/components/Image.vue";

export default {
  components: {
    Image
  },
  setup() {
    const spacingInfo = ref({
      wrapperTop: 10,
      // 瀑布流容器距离顶部的距离

      wrapperLeft: 10,
      // 瀑布流容器距离左侧的距离

      wrapperRight: 10,
      // 瀑布流容器距离右侧的距离

      wrapperMargin: 20,
      // 瀑布流容器左右两侧距离浏览器窗口的边距总和

      itemRightMargin: 15,
      // 左右相邻的图片容器之间的间距

      itemBottomMargin: 15,
      // 上下相邻的图片容器之间的间距
    });

    const { q, setQ, images, getImages } = useHuaban();
    const { imagesInfo, wrapHeight } = useImagePos(images, spacingInfo);

    useBottomLoad(window, document.documentElement, getImages, 400);

    return {
      images,
      imagesInfo,
      wrapHeight,
      ...spacingInfo.value
    };
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.waterfall-wrap {
  margin: {
    top: calc(v-bind(wrapperTop) * 1px);
    left: calc(v-bind(wrapperLeft) * 1px);
    right: calc(v-bind(wrapperRight) * 1px);
  }
  height: calc(v-bind(wrapHeight) * 1px);
  position: relative;
}
</style>
