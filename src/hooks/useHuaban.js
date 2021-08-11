import config from "@/config";
import Http from "@/utils/http";
import { ref, computed } from "vue";
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
    return pins.map(({ pin_id, file }) => ({
        id: pin_id,
        url: getPinUrl(file.bucket, file.key),
        width: file.width,
        height: file.height
    }));
};
// 提取花瓣接口中图片的信息

export default function useHuaban() {
    let images = ref([]);
    let q = ref(encodeURIComponent("轻音少女"));
    let page = 1;
    let limit = 20;
    let total = 0;
    let loaded = false;
    let loading = false;

    const setQ = query => {
        q.value = encodeURIComponent(query);
        page = 1;
    }

    const headers = computed(() => {
        return createHeaders(q.value);
    });
    // 根据查询关键字生成花瓣的请求头

    const getImages = async () => {
        if (loaded || loading) return;
        loading = true;

        const huabanUrl = huabanApi + createParams({
            q: q.value,
            page,
            per_page: limit,
            wfl: 1
        });
        // 根据参数生成花瓣的地址

        const url = huabanFnPath + "?url=" + encodeURIComponent(huabanUrl);
        // 将要请求的地址 函数地址 + 要代理访问的地址参数

        try {
            const res = await request.get(url, null, {
                headers: headers.value
            });
            page++;
            total = res.pin_count;
            images.value.push(...extractHuabanImg(res.pins));
            loaded = images.value.length >= total;
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    getImages();

    return {
        q,
        setQ,

        images,
        getImages
    }
}