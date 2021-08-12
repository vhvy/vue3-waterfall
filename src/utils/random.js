export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const randomColor = () => {
    const r = random(180, 255).toString(16);
    const g = random(140, 255).toString(16);
    const b = random(120, 220).toString(16);

    return '#' + r + g + b;
}

export default random;