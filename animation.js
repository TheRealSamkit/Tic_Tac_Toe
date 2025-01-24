export { strokeAni, appear, markAppear, buttonAni, winn, setttingAni };
let isReversed = false;
const appear = () => {
  anime({
    targets: ".game",
    scale: [0, 1],
    opacity: [0, 1],
    duration: 1000,
    easing: "easeInOutSine",
  });
};

const markAppear = () => {
  anime({
    targets: ".appear",
    rotate: 360,
    scale: [-1, 1],
    filter: ["blur(5px)", "blur(0px)"],
    easing: "easeInOutSine",
    duration: 500,
  });
};

const buttonAni = () => {
  anime({
    targets: ".btn",
    scale: [0, 1],
    duration: 500,
  });
};

const winn = () => {
  anime({
    targets: ".winn",
    translateY: ["-270px", "0px"],
    duration: 800,
    easing: "easeOutExpo",
  });
};

const strokeAni = (deg = 0, X = "0vmin", Y = "0vmin") => {
  anime({
    targets: ".stroke",
    translateX: X,
    translateY: Y,
    rotate: deg,
  });
};
function setttingAni() {
  anime({
    targets: ".settings",
    translateY: isReversed ? [0, -200] : [-100, 0],
    duration: 2000,
    easing: "easeOutBounce",
  });
  anime({
    targets: ".gear",
    rotate: isReversed ? "-90deg" : "90deg",
    duration: 2000,
    easing: "easeOutBounce",
  });
  isReversed = !isReversed;
}
