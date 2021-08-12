class Observer {
    constructor() {
        this.options = {
            threshold: .25
        };
        this.customer = new Map();
        this.observer = new IntersectionObserver(this.#handle.bind(this), this.options);
    }
    #handle(entries) {
        entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
                this.observer.unobserve(target);
                const fn = this.customer.get(target);
                this.customer.delete(target);
                fn();
            }
        }
        )
    }
    observe(el, fn) {
        if (!this.customer.has(el)) {
            this.customer.set(el, fn);
            this.observer.observe(el);
        }
    }
    unobserver(el) {
        if (this.customer.has(el)) {
            this.observer.unobserve(el);
            this.customer.delete(el);
        }
    }
}

const IO = new Observer();

if (import.meta.env.DEV) {
    window.$IO = IO;
}

export default IO;