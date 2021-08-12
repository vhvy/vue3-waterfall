import useScroll from "@/hooks/useScroll";

/**
 * 
 * @param {HTMLElement || string} listenDom 监听滚动事件的DOM
 * @param {HTMLElement} calcDom 获取位置信息的DOM元素
 * @param {Function} fn 到达指定位置后的回调函数
 * @param {Number} offset 距离底部多少距离时执行回调
 */
export default function useBottomLoad(listenDom, calcDom, fn, offset) {
    let lastScrollTop = 0;

    useScroll(listenDom, () => {
        const { scrollTop, scrollHeight } = calcDom;
        const { innerHeight } = window;
        const isDown = scrollTop > lastScrollTop;
        if (isDown && scrollTop + innerHeight + offset > scrollHeight) {
            fn();
        }
        lastScrollTop = scrollTop;
    });
}