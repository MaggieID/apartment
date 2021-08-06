// 图片尺寸验证，长宽比1：1
export async function verificationPicFile(file) {
  return await new Promise((resolve, reject) => {
    if (file) {
      // 读取图片数据
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        var data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        var image = new Image();
        image.src = data;
        image.onload = function() {
          var width = image.width;
          var height = image.height;
          if (width === height) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        };
      };
    } else {
      return resolve(false);
    }
  })
}

// 压缩图片
export function compressImg(file, Orientation) {
  return new Promise((resolve, reject) => {
    let ndata;
    // 创建一个reader
    const reader = new FileReader();
    // 将图片2将转成 base64 格式
    reader.readAsDataURL(file);
    // 读取成功后的回调
    reader.onloadend = function() {
      const result = this.result;
      const img = new Image();
      img.src = result;

      img.onload = function() {
        const data = compress(img, Orientation);
        ndata = compress(img, Orientation);

        // BASE64转图片
        var arr = ndata.split(','); var mime = arr[0].match(/:(.*?);/)[1];
          var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        ndata = new File([u8arr], file.name, { type: mime })
        console.log(ndata);
        // params.append('uploadFiles', ndata);
        resolve(ndata);
      }
    }
  })
}

export function compress(img, Orientation) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // 瓦片canvas
  const tCanvas = document.createElement('canvas');
  const tctx = tCanvas.getContext('2d');
  const initSize = img.src.length;
  let width = img.width;
  let height = img.height;
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio;
  if ((ratio = width * height / 4000000) > 1) {
    console.log('大于400万像素')
    ratio = Math.sqrt(ratio);
    width /= ratio;
    height /= ratio;
  } else {
    ratio = 1;
  }
  canvas.width = width;
  canvas.height = height;
  //        铺底色
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 如果图片像素大于100万则使用瓦片绘制
  let count;
  if ((count = width * height / 1000000) > 1) {
    console.log('超过100W像素');
    count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
    //            计算每块瓦片的宽和高
    const nw = ~~(width / count);
    const nh = ~~(height / count);
    tCanvas.width = nw;
    tCanvas.height = nh;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }
  // 修复ios上传图片的时候 被旋转的问题
  if (Orientation != '' && Orientation != 1) {
    switch (Orientation) {
      case 6:// 需要顺时针（向左）90度旋转
        rotateImg(img, 'left', canvas);
        break;
      case 8:// 需要逆时针（向右）90度旋转
        rotateImg(img, 'right', canvas);
        break;
      case 3:// 需要180度旋转
        rotateImg(img, 'right', canvas);// 转两次
        rotateImg(img, 'right', canvas);
        break;
    }
  }
  // 进行最小压缩
  const ndata = canvas.toDataURL('image/jpeg', 0.1);
  console.log('压缩前：' + initSize);
  console.log('压缩后：' + ndata.length);
  console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%');
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
  return ndata;
}

function rotateImg(img, direction, canvas) {
  // 最小与最大旋转方向，图片旋转4次后回到原方向
  const min_step = 0;
  const max_step = 3;
  if (img == null) return;
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  const height = img.height;
  const width = img.width;
  let step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == 'right') {
    step++;
    // 旋转到原位置，即超过最大值
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  // 旋转角度以弧度值为参数
  const degree = step * 90 * Math.PI / 180;
  const ctx = canvas.getContext('2d');
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
  }
}