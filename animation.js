export { strokeAni, appear, markAppear, buttonAni, winn };
let count = 0;
const appear = () => {
    anime({
        targets: '.game',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutSine'
    });
}

const markAppear = () => {
    anime({
        targets: '.appear',
        rotate: 360,
        scale: [-1, 1],
        filter: ['blur(5px)', 'blur(0px)'],
        easing: 'easeInOutSine',
        duration: 500,
    });
}

const buttonAni = () => {
    anime({
        targets: '.btn',
        scale: [0, 1],
        duration: 500,
        easing: 'easeInOutSine'
    });
}

const winn = () => {
    anime({
        targets: '.winn',
        translateY: ['-270px', '0px'],
        duration: 800,
        easing: 'easeOutExpo'
    })
};

const strokeAni = (deg = 0, X = "0vmin", Y = "0vmin") => {
    count++;
    console.log("Animation is called:", count, `\ndeg=${deg},X=${X},Y=${Y}`)
    anime({
        targets: '.stroke',
        translateX: X,
        translateY: Y,
        rotate: deg,
    })
}