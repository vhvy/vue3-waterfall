export function createParams(params) {
    if (!params) return '';
    return "?" + Object.keys(params)
        .map(k => {
            return `${k}=${params[k]}`
        })
        .join("&");
}