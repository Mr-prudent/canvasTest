let ctxHeight, ctxWidth, canvasWidth, canvasHeight, mouseX, mouseY, PointDown;
let isDown = false;
let img_x = 0;
let img_y = 0;
let baseLeft = 150;
let baseTop = 100;
let hasMove = false;
let toggleFlag = false;

window.onload = function () {
  // 获取canvas的dom对象
  let canvas = document.getElementById("canvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  let ctx = canvas.getContext("2d");

  // 为canvas对象绑定事件
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);
  canvas.addEventListener("mousemove", mouseMove);

  // 创建锚点对象
  let top = new Point("top");
  let right = new Point("right");
  let left = new Point("left");
  let bottom = new Point("bottom");

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
  function mouseUp() {
    // 判断鼠标是否移动
    isDown = false;
    PointDown = "";
    Point.hideAll();
    if (!hasMove) {
      Point.togglePoint();
    }
  }

  // 鼠标移动
  function mouseMove(e) {
    // 判断是否超出边界
    if (
      e.offsetX <= 0 ||
      e.offsetX >= canvasWidth ||
      e.offsetY <= 0 ||
      e.offsetY >= canvasHeight
    ) {
      PointDown = "";
      isDown = false;
      return false;
    }
    hasMove = true;
    // 拖动图片
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

    const { offsetX, offsetY } = e;
    let style_top, style_left, changeWidth, changeHeight;
    // 处理锚点拖动，改变图片大小
    if (PointDown === "top") {
      changeHeight = img_y - offsetY;
      ctxHeight += changeHeight;
      img_y = offsetY;
      style_top = baseTop + img_y;
      style_left = baseLeft + img_x + ctxWidth / 2 - 2;
      top.showSingle(style_top, style_left);
      drawImg();
    } else if (PointDown === "right") {
      changeWidth = offsetX - ctxWidth - img_x;
      ctxWidth += changeWidth;
      style_top = baseTop + img_y + ctxHeight / 2;
      style_left = baseLeft + img_x + ctxWidth - 2;
      right.showSingle(style_top, style_left);
      drawImg();
    } else if (PointDown === "left") {
      changeWidth = img_x - offsetX;
      img_x = offsetX;
      ctxWidth += changeWidth;
      style_top =  baseTop + img_y + ctxHeight / 2;
      style_left = baseLeft + img_x;
      left.showSingle(style_top, style_left);
      drawImg();
    } else if (PointDown === "bottom") {
      changeHeight = offsetY - ctxHeight - img_y;
      ctxHeight += changeHeight;
      style_top = baseTop + img_y + ctxHeight - 2;
      style_left = baseLeft + img_x + ctxWidth / 2 - 2;
      bottom.showSingle(style_top, style_left);
      drawImg();
    }
  }

  function drawImg() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
  }
};

// Point锚点对象
class Point {
  static pointArr = [];
  constructor(position) {
    Point.pointArr.push(this);
    // 获取锚点的dom对象
    this.domObj = document.getElementById(position);
    this.position = position;

    // 绑定事件
    this.domObj.addEventListener("mousedown", Point.pointMouseDown);
    this.domObj.addEventListener("mouseup", Point.pointMouseUp);
  }

  // 设置位置并画图
  drawImg(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
  }

  showSingle(top, left) {
    Point.hideAll();
    this.domObj.style.top = `${top}px`;
    this.domObj.style.left = `${left}px`;
    this.domObj.style.display = 'block';
  }

  hide() {
    this.domObj.style.display = 'none';
  }

  // 显示点击后初始的锚点
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
    this.pointArr.forEach((item) => {
      item.hide();
    });
  }

  // 切换锚点
  static togglePoint() {
    if (toggleFlag) {
      this.hideAll();
    } else {
      this.showAll();
    }
  }

  // 锚点点击事件绑定
  static pointMouseDown(e) {
    PointDown = e.target.getAttribute("id");
  }

  static pointMouseUp() {
    PointDown = "";
  }
}

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
