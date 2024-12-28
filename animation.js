export { appear, markAppear, buttonAni, winn };

const appear = () => {
    anime({
        targets: '.container',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });
}

const markAppear = () => {
    anime({
        targets: '.appear',
        rotate: 360,
        scale: [3, 1],
        filter: ['blur(5px)', 'blur(0px)'],
        easing: 'easeInOutSine',
        duration: 500,
    });
}

const buttonAni = () => {
    anime({
        targets: '.btn',
        scale: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });
}

const winn = () => {
    anime({
        targets: '.winn',
        translateY: ['270px', '0px'],
        duration: 800,
        easing: 'easeOutExpo'
    })
};