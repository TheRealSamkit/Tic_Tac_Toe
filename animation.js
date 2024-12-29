export { appear, markAppear, buttonAni, winn, rotate, translateY, translateX };

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
        duration: 1000,
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

const rotate = (deg) => {
    anime({
        targets: '.stroke',
        rotate: deg,
    })
}

const translateY = (vmin, deg) => {
    anime({
        targets: '.stroke',
        rotate: deg,
        translateY: vmin,
    })
}

const translateX = (vmin, deg) => {
    anime({
        targets: '.stroke',
        translateX: vmin,
        translateY: 0,
        rotate: deg,
    })
}