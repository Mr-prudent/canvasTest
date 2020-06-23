let ctxHeight, ctxWidth, canvasWidth, canvasHeight, mouseX, mouseY, PointDown;
let isDown = false;
let topDown = false;
let rightDown = false;
let leftDown = false;
let bottomDown = false;
let img_x = 0;
let img_y = 0;
let baseLeft = 150;
let baseTop = 100;
let hasMove = false;
let toggleFlag = false;


window.onload = function () {
  // 获取canvas对象
  let top = document.getElementById("top");
  let left = document.getElementById("left");
  let bottom = document.getElementById("bottom");
  let right = document.getElementById("right");
  let canvas = document.getElementById("canvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  let ctx = canvas.getContext("2d");

  // 定义锚点对象
  let topObj = new Point("top");
  let leftObj = new Point("left");
  let rightObj = new Point("right");
  let bottomObj = new Point("bottom");


  // 绑定事件
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);
  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mouseleave", mouseLeave);

  // 绑定锚点的点击事件
  top.addEventListener("mousedown", topMouseDown);
  top.addEventListener("mouseup", topMouseUp);
  right.addEventListener("mousedown", rightMouseDown);
  right.addEventListener("mouseup", rightMouseUp);
  left.addEventListener("mousedown", leftMouseDown);
  left.addEventListener("mouseup", leftMouseUp);
  bottom.addEventListener("mousedown", bottomMouseDown);
  bottom.addEventListener("mouseup", bottomMouseUp);
  // 事件处理函数

  //鼠标按下
  function mouseDown(e) {
    hasMove = false;
    let x = e.offsetX;
    let y = e.offsetY;
    // 记录鼠标相对于图片的位置
    mouseX = e.offsetX - img_x;
    mouseY = e.offsetY - img_y;

    // 判断是否在图片范围内
    if (
      x >= img_x &&
      x <= img_x + ctxWidth &&
      y >= img_y &&
      y <= img_y + ctxHeight
    ) {
      isDown = true;
    }
  }

  // 鼠标松开
  function mouseUp(e) {
    // 判断鼠标是否移动
    isDown = false;
    topDown = false;
    rightDown = false;
    leftDown = false;
    bottomDown = false;
    Point.hideAll();
    if (!hasMove) {
      Point.togglePoint();
    }
  }

  // 鼠标移动
  function mouseMove(e) {
    if (
      e.offsetX <= 0 ||
      e.offsetX >= canvasWidth ||
      e.offsetY <= 0 ||
      e.offsetY >= canvasHeight
    ) {
      topDown = false;
      rightDown = false;
      leftDown = false;
      bottomDown = false;
      return false;
    }
    hasMove = true;
    if (isDown) {
      Point.hideAll();
      let x = e.offsetX - mouseX;
      let y = e.offsetY - mouseY;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // 判断有无超过边界
      if (y < 0) {
        y = 0;
      }
      if (x < 0) {
        x = 0;
      }
      if (x > canvasWidth - ctxWidth) {
        x = canvasWidth - ctxWidth;
      }
      if (y > canvasHeight - ctxHeight) {
        y = canvasHeight - ctxHeight;
      }
      ctx.drawImage(img, x, y, ctxWidth, ctxHeight);
      img_x = x;
      img_y = y;
    }
    // 处理top锚点拖动
    if (topDown) {
      Point.hideAll();
      top.style.display = "block";
      let changeHeight = img_y - e.offsetY;
      ctxHeight += changeHeight;
      img_y = e.offsetY;
      let top_style_top = baseTop + img_y;
      top.style.top = `${top_style_top}px`;
      // 绘制图片
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
    }

    // 处理right锚点的移动
    if (rightDown) {
      Point.hideAll();
      right.style.display = "block";
      let changeWidth = e.offsetX - ctxWidth - img_x;
      ctxWidth += changeWidth;
      let right_style_left = baseLeft + img_x + ctxWidth - 2;
      right.style.left = `${right_style_left}px`;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
    }

    // 处理left锚点的移动
    if (leftDown) {
      Point.hideAll();
      left.style.display = "block";
      let changeWidth = img_x - e.offsetX;
      img_x = e.offsetX;
      ctxWidth += changeWidth;
      let left_style_left = baseLeft + img_x;
      left.style.left = `${left_style_left}px`;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
    }

    // 处理bottom锚点的移动
    if (bottomDown) {
      Point.hideAll();
      bottom.style.display = "block";
      let changeHeight = e.offsetY - ctxHeight - img_y;
      ctxHeight += changeHeight;
      let bottom_style_top = baseTop + img_y + ctxHeight - 2;
      bottom.style.top = `${bottom_style_top}px`;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
    }
  }

  // 鼠标离开
  function mouseLeave(e) {
    isDown = false;
  }

  // 显示锚点
  function showPoint() {
    toggleFlag = true;
    // 获取锚点的dom对象

    // 根据图片位置设置锚点坐标

    // top锚点
    let top_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
    let top_style_top = baseTop + img_y;
    top.style.left = `${top_style_left}px`;
    top.style.top = `${top_style_top}px`;

    // left锚点
    let left_style_left = baseLeft + img_x;
    let left_style_top = baseTop + img_y + ctxHeight / 2;
    left.style.left = `${left_style_left}px`;
    left.style.top = `${left_style_top}px`;

    // bottom锚点
    let bottom_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
    let bottom_style_top = baseTop + img_y + ctxHeight - 2;
    bottom.style.left = `${bottom_style_left}px`;
    bottom.style.top = `${bottom_style_top}px`;

    // right锚点
    let right_style_left = baseLeft + img_x + ctxWidth - 2;
    let right_style_top = baseTop + img_y + ctxHeight / 2;
    right.style.left = `${right_style_left}px`;
    right.style.top = `${right_style_top}px`;

    let point = document.getElementsByClassName("point");

    for (let i = 0; i < point.length; i++) {
      point[i].style.display = "block";
    }
  }

  //隐藏锚点
  function hidePoint() {
    toggleFlag = false;
    let point = document.getElementsByClassName("point");
    for (let i = 0; i < point.length; i++) {
      point[i].style.display = "none";
    }
  }

  // 切换锚点
  function togglePoint() {
    if (toggleFlag) {
      hidePoint();
    } else {
      showPoint();
    }
  }

  // top锚点的鼠标点击拖动事件
  function topMouseDown() {
    topDown = true;
  }

  function rightMouseDown() {
    rightDown = true;
  }

  function leftMouseDown() {
    leftDown = true;
  }

  function bottomMouseDown() {
    bottomDown = true;
  }

  function topMouseUp() {
    topDown = false;
  }

  function rightMouseUp() {
    rightDown = false;
  }

  function leftMouseUp() {
    leftDown = false;
  }

  function bottomMouseUp() {
    bottomDown = false;
  }
};

// 接受图片
function fileInput(files) {
  let reader = new FileReader();
  reader.onload = function (e) {
    // 创建图片对象
    img = new Image();
    // 读取图片路劲
    img.src = e.target.result;
    let ctx = canvas.getContext("2d");
    img.onload = function () {
      // 设置缩放比例
      let scale = 1;
      // 长或宽超过150进行缩放
      let maxNum = 150;
      if (this.width > maxNum || this.height > maxNum) {
        if (this.width > this.height) {
          scale = maxNum / this.width;
        } else {
          scale = maxNum / this.height;
        }
      }

      ctxHeight = scale * this.height;
      ctxWidth = scale * this.width;
      // 清除画布
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // 显示图片
      ctx.drawImage(img, 0, 0, ctxWidth, ctxHeight);
      // 重新选择图片时对img_x, img_y清零
      img_x = 0;
      img_y = 0;
    };
  };
  reader.readAsDataURL(files[0]);
}

// Point锚点对象
class Point {
  constructor(position) {
    this.position = position;
    if (this.position === "top") {
      let top = document.getElementById("top");
      // top锚点
      let top_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
      let top_style_top = baseTop + img_y;
      top.style.left = `${top_style_left}px`;
      top.style.top = `${top_style_top}px`;
    } else if (this.position === "left") {
      let left = document.getElementById("left");
      // left锚点
      let left_style_left = baseLeft + img_x;
      let left_style_top = baseTop + img_y + ctxHeight / 2;
      left.style.left = `${left_style_left}px`;
      left.style.top = `${left_style_top}px`;
    } else if (this.position === "bottom") {
      let bottom = document.getElementById("bottom");
      // bottom锚点
      let bottom_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
      let bottom_style_top = baseTop + img_y + ctxHeight - 2;
      bottom.style.left = `${bottom_style_left}px`;
      bottom.style.top = `${bottom_style_top}px`;
    } else if (this.position === "right") {
      let right = document.getElementById("right");
      // right锚点
      let right_style_left = baseLeft + img_x + ctxWidth - 2;
      let right_style_top = baseTop + img_y + ctxHeight / 2;
      right.style.left = `${right_style_left}px`;
      right.style.top = `${right_style_top}px`;
    }
  }

  // 显示锚点
  show() {
    toggleFlag = true;
    // 显示最初的锚点
  }

  static showAll() {
    toggleFlag = true;
    // 获取锚点的dom对象
    let top = document.getElementById("top");
    let left = document.getElementById("left");
    let bottom = document.getElementById("bottom");
    let right = document.getElementById("right");
    // 根据图片位置设置锚点坐标


    // top锚点
    let top_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
    let top_style_top = baseTop + img_y;
    top.style.left = `${top_style_left}px`;
    top.style.top = `${top_style_top}px`;

    // left锚点
    let left_style_left = baseLeft + img_x;
    let left_style_top = baseTop + img_y + ctxHeight / 2;
    left.style.left = `${left_style_left}px`;
    left.style.top = `${left_style_top}px`;

    // bottom锚点
    let bottom_style_left = baseLeft + img_x + ctxWidth / 2 - 2;
    let bottom_style_top = baseTop + img_y + ctxHeight - 2;
    bottom.style.left = `${bottom_style_left}px`;
    bottom.style.top = `${bottom_style_top}px`;

    // right锚点
    let right_style_left = baseLeft + img_x + ctxWidth - 2;
    let right_style_top = baseTop + img_y + ctxHeight / 2;
    right.style.left = `${right_style_left}px`;
    right.style.top = `${right_style_top}px`;
    let point = document.getElementsByClassName("point");
    for (let i = 0; i < point.length; i++) {
      point[i].style.display = "block";
    }
  }
  //隐藏锚点
  static hideAll() {
    toggleFlag = false;
    let point = document.getElementsByClassName("point");
    for (let i = 0; i < point.length; i++) {
      point[i].style.display = "none";
    }
  }

  // 切换锚点
  static togglePoint() {
    if (toggleFlag) {
      console.log('隐藏point');
      this.hideAll();
    } else {
      console.log('显示point');
      this.showAll();
    }
  }

  //
}
