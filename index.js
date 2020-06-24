let ctx,
  ctxHeight,
  ctxWidth,
  canvasWidth,
  canvasHeight,
  mouseX,
  mouseY,
  PointDown;
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
  ctx = canvas.getContext("2d");

  // 保存canvas的宽高
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  // 为canvas对象绑定事件
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);
  canvas.addEventListener("mousemove", mouseMove);

  // 创建锚点对象

  // 设置相对位置
  new Point({
    position: "top",
    // top: () => baseTop + img_y,
    // left: () => baseLeft + img_x + ctxWidth / 2 - 2,
    top: "0",
    left: "50%",
    changeSize: (e) => {
      let changeHeight = img_y - e.offsetY;
      ctxHeight += changeHeight;
      img_y = e.offsetY;
    },
  });

  new Point({
    position: "right",
    // top: () => baseTop + img_y + ctxHeight / 2,
    // left: () => baseLeft + img_x + ctxWidth - 2,
    top: "50%",
    left: "100%",
    changeSize: (e) => {
      let changeWidth = e.offsetX - ctxWidth - img_x;
      ctxWidth += changeWidth;
    },
  });

  // 设置绝对位置
  new Point({
    position: "left",
    top: () => baseTop + img_y + ctxHeight / 2,
    left: () => baseLeft + img_x,
    changeSize: (e) => {
      let changeWidth = img_x - e.offsetX;
      img_x = e.offsetX;
      ctxWidth += changeWidth;
    },
  });
  new Point({
    position: "bottom",
    top: () => baseTop + img_y + ctxHeight - 2,
    left: () => baseLeft + img_x + ctxWidth / 2 - 2,
    changeSize: (e) => {
      let changeHeight = e.offsetY - ctxHeight - img_y;
      ctxHeight += changeHeight;
    },
  });

  // 事件处理函数

  //鼠标按下
  function mouseDown(e) {
    hasMove = false;
    let x = e.offsetX;
    let y = e.offsetY;
    // 记录鼠标相对于图片的位置
    mouseX = x - img_x;
    mouseY = y - img_y;
    // 判断是否在图片范围内
    if (isInImg(e)) {
      isDown = true;
    }
  }

  // 鼠标松开
  function mouseUp(e) {
    // 判断鼠标是否移动
    isDown = false;
    PointDown = "";
    if (!hasMove && isInImg(e)) {
      Point.togglePoint();
    } else {
      Point.hideAll();
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
    // 拖动图片时修改图片位置
    if (isDown) {
      let x = e.offsetX - mouseX;
      let y = e.offsetY - mouseY;
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
      img_x = x;
      img_y = y;
      drawImg();
    }

    // 拖动锚点时计算图片大小，并绘制
    if (PointDown) {
      Point.changeSize(e);
      drawImg();
    }
  }
};

// Point锚点对象
class Point {
  static pointArr = [];
  constructor({ position, top, left, changeSize } = option) {
    // 保存计算位置的函数
    if (typeof top === "function") {
      this.topFunc = top;
    } else {
      this.topStr = this.handleStr(top);
    }

    if (typeof left === "function") {
      this.leftFunc = left;
    } else {
      this.leftStr = this.handleStr(left);
    }

    this.changeSize = changeSize;
    // 保存到类中
    Point.pointArr.push(this);

    // 获取锚点的dom对象
    this.domObj = document.getElementById(position);
    this.position = position;

    // 绑定事件
    this.domObj.addEventListener("mousedown", Point.pointMouseDown);
    this.domObj.addEventListener("mouseup", Point.pointMouseUp);
  }

  // 显示锚点
  show(option) {
    let top, left;
    if (option === "single") {
      Point.hideAll();
    }

    if (this.topFunc) {
      top = this.topFunc();
    } else {
      top = this.topStr * ctxHeight * 0.01 + baseTop + img_y;
    }

    if (this.leftFunc) {
      left = this.leftFunc();
    } else {
      left = this.leftStr * ctxWidth * 0.01 + baseLeft + img_x - 2;
    }

    this.domObj.style.top = `${top}px`;
    this.domObj.style.left = `${left}px`;
    this.domObj.style.display = "block";
  }

  // 隐藏锚点
  hide() {
    this.domObj.style.display = "none";
  }

  // 处理position字符串
  handleStr(str) {
    if (str === "0") {
      return str;
    } else {
      return str.slice(0, -1);
    }
  }

  // 显示所有锚点
  static showAll() {
    toggleFlag = true;
    this.pointArr.forEach((item) => {
      item.show();
    });
  }

  // 显示被选中时的锚点
  static showSingle() {
    this.pointArr.forEach((item) => {
      if (item.position === PointDown) {
        item.show("single");
      }
    });
  }

  // 根据锚点位置修改图片大小
  static changeSize(e) {
    this.pointArr.forEach((item) => {
      if (item.position === PointDown) {
        item.changeSize(e);
      }
    });
  }
  //隐藏所有锚点
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

  // 锚点点击事件处理
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
      // 重新选择图片时对img_x, img_y清零
      img_x = 0;
      img_y = 0;
      drawImg();
    };
  };
  reader.readAsDataURL(files[0]);
}

// canvas绘画
function drawImg() {
  if (hasMove) {
    Point.hideAll();
  }
  Point.showSingle();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, img_x, img_y, ctxWidth, ctxHeight);
}

function isInImg(e) {
  let x = e.offsetX;
  let y = e.offsetY;
  if (
    x >= img_x &&
    x <= img_x + ctxWidth &&
    y >= img_y &&
    y <= img_y + ctxHeight
  ) {
    return true;
  } else {
    return false;
  }
}
