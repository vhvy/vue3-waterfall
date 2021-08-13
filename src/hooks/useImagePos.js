import { computed, ref, watch } from "vue";
import useResize from "@/hooks/useResize";
import useScroll from "@/hooks/useScroll";

const getMaxNum = (list) => {
    if (list.length < 1) return 0;
    let max = 0;
    for (let num of list) {
        if (num > max) max = num;
    }

    return max;
}
// 获取数组中的最大值

const getMinNumIdx = (list) => {
    if (list.length < 1) return 0;
    let min = list[0];
    let idx = 0;
    for (let i = 1; i < list.length; i++) {
        if (list[i] < min) {
            min = list[i];
            idx = i;
        }
    }

    return idx;
}
// 获取数组中最大值的下标



const createColumnHeightList = (num) => new Array(num).fill(0);
// 生成一个指定个数元素的数组，默认值为0，用来保存column高度

const config = [
    {
        minWidth: 1200,
        column: 6
    },
    {
        minWidth: 992,
        column: 5
    },
    {
        minWidth: 768,
        column: 4
    },
    {
        minWidth: 375,
        column: 3
    }
];
// 各个宽度下屏幕要显示的column数量

const other = {
    column: 2
};


/**
 * @param {Array<Object>} list 图片列表
 * @param {Object} spacingInfo 边距等信息
 * @returns Object
 */
export default (currentImages, spacingInfo) => {

    /**
     * 新加载图片     ->   计算图片位置(新加载) && push到所有图片信息 && 累加column高度
     * 屏幕宽度变化   ->   计算图片位置(所有)   && 替换所有图片信息   && 刷新column高度
     * 滚动位置变化   ->   使用当前滚动位置计算要显示的图片列表
     */

    const { screenWidth, screenHeight } = useResize();
    // 屏幕实时宽度

    const allImages = ref([]);
    // 所有图片信息列表

    const imagesInfo = ref([]);
    // 当前要显示在屏幕上的图片列表

    const { wrapperMargin, itemRightMargin, itemBottomMargin } = spacingInfo.value;



    const column = computed(() => {
        for (let { minWidth, column } of config) {
            if (screenWidth.value >= minWidth) return column;
        }
        return other.column;
    });
    // 获取当前屏幕宽度下栏数

    const columnHeight = ref(createColumnHeightList(column.value));
    // 各column高度

    const wrapHeight = computed(() => {
        return getMaxNum(columnHeight.value);
    });
    // 瀑布流容器高度(最高column高度)

    const columnWidth = computed(() => {
        let columnNum = column.value;
        return (screenWidth.value - wrapperMargin - itemRightMargin * (columnNum - 1)) / columnNum;
        // 单栏宽度 = (屏幕宽度 - 瀑布流容器外边距 - 图片容器间距) / 栏个数
    });
    // column宽度

    watch(currentImages, (images) => {
        let totalHeight = [...columnHeight.value];
        // 使用上次column高度

        const result = calcImagePos(images, totalHeight);
        allImages.value.push(...result.imageInfo);
        columnHeight.value = result.totalHeight;
    });
    // 监听新加载的图片

    watch(screenWidth, () => {
        let totalHeight = createColumnHeightList(column.value);
        // 重新计算所有图片高度，所有重置为0

        const result = calcImagePos(allImages.value, totalHeight);

        allImages.value = result.imageInfo;
        columnHeight.value = result.totalHeight;
    });
    // 监听新加载的图片

    const calcImagePos = (list, totalHeight) => {
        const imageInfo = list.map((item) => {
            const index = getMinNumIdx(totalHeight);
            // 获取高度最低的column序号

            const { width, height } = item;

            const ratio = width / height;
            // 图片原始宽高比例

            const columnHeight = columnWidth.value / ratio;
            // 计算图片容器真实高度

            const styles = {
                "--width": columnWidth.value,
                "--height": columnHeight,
                "--top": totalHeight[index],
                "--left": (columnWidth.value + itemRightMargin) * index
            };

            totalHeight[index] += columnHeight + itemBottomMargin;
            // 累计图片容器高度+上下容器间距


            return { ...item, styles };
        });

        return {
            imageInfo,
            totalHeight
        }
    }
    // 根据传入的图片列表和column高度信息计算图片信息以及column高度

    const calcShowImages = (e, isDown) => {
        console.log(e, isDown);
        const { scrollTop } = document.documentElement;
        // 这里明天再弄，从allImages中计算出-2屏和+2屏的图片数据，用二分查找法

        // imagesInfo.value = 
    }
    // 根据屏幕滚动位置计算要显示的图片

    useScroll(window, document.documentElement, calcShowImages, 80);

    return {
        imagesInfo,
        wrapHeight
    }
}