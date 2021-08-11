const throttle = (fn, delay = 300) => {
    let timer = 0;
    return function (...args) {
        let now = Date.now();
        if (now - timer > delay) {
            timer = now;
            fn.apply(this, args);
        }
    }
}

export default throttle;