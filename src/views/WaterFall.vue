<template>
  <div class="waterfall-wrap">
    <Image
      v-for="item of imagesInfo"
      :id="item.id"
      :key="item.id"
      :style="item.styles"
      :src="item.url"
    />
    <Loading class="loading-wrap" />
  </div>
</template>

<script>
import useHuaban from "@/hooks/useHuaban";
import useImagePos from "@/hooks/useImagePos";
import useBottomLoad from "@/hooks/useBottomLoad";
import { computed, ref, toRefs } from "vue";
import Image from "@/components/Image.vue";
import Loading from "@/components/Loading.vue";


export default {
  components: {
    Image,
    Loading
  },
  props: {
    query: String
  },
  setup(props) {
    const { query } = toRefs(props);
    // 搜索关键词

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
    
    const encodeQuery = computed(() => encodeURIComponent(query.value));
    // 进行URL编码后的查询关键词

    const { getImages, currentImages } = useHuaban(encodeQuery);
    // 图片列表，以及加载下一页图片函数

    const { imagesInfo, wrapHeight } = useImagePos(currentImages, spacingInfo, query);
    // 计算图片在页面中的坐标

    useBottomLoad(window, document.documentElement, getImages, 400);
    // 监听滚动到页面底部时加载下一页

    return {
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
  padding-bottom: 120px;

  .loading-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
