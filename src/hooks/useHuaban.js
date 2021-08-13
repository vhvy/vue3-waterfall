import config from "@/config";
import Http from "@/utils/http";
import { ref, computed, watch } from "vue";
import { createParams } from "@/utils/params";

const { huabanApi, proxyApi, headerPrefix, huabanFnPath, huabanImgUrl } = config;
const request = new Http(proxyApi);
const createHeaders = q => {
    const header = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Host": "huaban.com",
        "Referer": huabanApi + "?q=" + q,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "X-Request": "JSON",
        "X-Requested-With": "XMLHttpRequest",
    };

    return Object.keys(header)
        .reduce((h, k) => {
            h[headerPrefix + k] = header[k];
            return h;
        }, {});
};

const getPinUrl = (() => {
    const urlMap = new Map();
    return (bucket, key) => {
        if (!urlMap.has(bucket)) {
            urlMap.set(bucket, huabanImgUrl.replace(/{bucket}/, bucket));
        }
        const baseUrl = urlMap.get(bucket);

        return baseUrl + "/" + key + '_' + '/format/webp';
    };
})();
// 合成图片的正确路径

const extractHuabanImg = pins => {
    return pins.map(({ pin_id, file, raw_text }) => ({
        id: pin_id,
        url: getPinUrl(file.bucket, file.key),
        width: file.width,
        height: file.height,
        desc: raw_text
    }));
};
// 提取花瓣接口中图片的信息

/**
 * 
 * @param {String} query 查询关键词
 * @returns Object
 */
export default function useHuaban(query) {
    let images = ref([]);
    let currentImages = ref([]);
    let page = 1;
    let limit = 40;
    let total = 0;
    let loaded = false;
    let loading = false;

    const headers = computed(() => {
        return createHeaders(query.value);
    });
    // 根据查询关键字生成花瓣的请求头

    watch(query, () => {
        page = 1;
        total = 0;
        loaded = false;
        images.value = [];
        getImages();
    });
    // 查询关键字变化时恢复初始查询信息

    const getImages = async () => {
        if (loaded || loading) return;
        loading = true;

        const huabanUrl = huabanApi + createParams({
            q: query.value,
            page,
            per_page: limit,
            wfl: 1
        });
        // 根据参数生成花瓣的地址

        const url = huabanFnPath + "?url=" + encodeURIComponent(huabanUrl);
        // 将要请求的地址 函数地址 + 要代理访问的地址参数

        let q = query.value;
        try {
            const res = await request.get(url, null, {
                headers: headers.value
            });
            if (q != query.value) return;
            page++;
            total = res.pin_count;
            const newImages = extractHuabanImg(res.pins);
            currentImages.value = newImages;
            images.value.push(...newImages);
            loaded = images.value.length >= total;
            loading = false;
        } catch (error) {
            console.log(error);
            if (q != query.value) return;
            loading = false;
        }
    }

    getImages();

    return {
        images,
        currentImages,
        getImages
    }
}