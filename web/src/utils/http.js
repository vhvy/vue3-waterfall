import { createParams } from "@/utils/params";

export class Http {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    get(url, params, { headers }) {
        return fetch(this.baseURL + url + createParams(params), {
            method: "GET",
            mode: "cors",
            headers
        })
            .then(res => res.json());
    }
}

export default Http;