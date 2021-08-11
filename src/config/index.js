import dev from "@/config/dev";
import prod from "@/config/prod";

const common = {
    huabanApi: "https://huaban.com/search",
    huabanImgUrl: "https://{bucket}.huabanimg.com",
    headerPrefix: "XM-",
    huabanFnPath: "/.netlify/functions/huaban",
};

const merge = import.meta.env.DEV ? dev : prod;

export default {
    ...common,
    ...merge,
}