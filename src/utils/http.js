import { createParams } from "@/utils/params";

export class Http {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    isCors(url) {
        return url != "" && url != location.origin;
    }

    get(url, params, { headers }) {
        const mode = this.isCors(this.baseURL) ? "cors" : "same-origin";
        const path = this.baseURL + url + createParams(params);
        return fetch(path, {
            method: "GET",
            mode,
            headers
        })
            .then(res => res.json());
    }
}

export default Http;