import { computed, ref } from "vue";
import useResize from "@/hooks/useResize";


export default (list, spacingInfo) => {

    const { screenHeight, screenWidth } = useResize();

    const { wrapperTop, wrapperLeft, wrapperMargin, itemRightMargin, itemBottomMargin } = spacingInfo.value;

    const wrapHeight = ref(0);

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

    const other = {
        column: 2
    };

    const getColumn = () => {
        for (let { minWidth, column } of config) {
            if (screenWidth.value >= minWidth) return column;
        }
        return other.column;
    }
    // 获取当前屏幕宽度下栏数

    const column = computed(getColumn);

    const getMaxNum = (list) => {
        if (list.length < 1) return 0;
        let max = 0;
        for (let num of list) {
            if (num > max) max = num;
        }

        return max;
    }

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

    const calcImagePos = () => {
        let columnNum = column.value;
        const columnWidth = (screenWidth.value - wrapperMargin - itemRightMargin * (columnNum - 1)) / columnNum;
        // 单栏宽度 = (屏幕宽度 - 瀑布流容器外边距 - 图片容器间距) / 栏个数

        let totalHeight = new Array(columnNum).fill(0);

        const imageInfo = list.value.map((item) => {
            const index = getMinNumIdx(totalHeight);
            // 获取高度最低的column序号

            const { width, height } = item;

            const ratio = width / height;
            // 图片原始宽高比例

            const columnHeight = columnWidth / ratio;
            // 计算图片容器真实高度

            const styles = {
                "--width": columnWidth,
                "--height": columnHeight,
                "--top": totalHeight[index],
                "--left": (columnWidth + itemRightMargin) * index
            };

            totalHeight[index] += columnHeight + itemBottomMargin;
            // 累计图片容器高度+上下容器间距


            return { ...item, styles };
        });

        wrapHeight.value = getMaxNum(totalHeight);

        return imageInfo;
    };

    const imagesInfo = computed(calcImagePos);

    return {
        imagesInfo,
        wrapHeight
    }
}