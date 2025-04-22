import utils from "./utils"

export const zipImgPromise = (imgFile, type) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();    // 定义一个fileReader
    reader.readAsDataURL(imgFile);    // 将图片转换成base64后可以得到图片的宽高
    let img = new Image();
    reader.onload = () => {
      img.src = reader.result;
    };
    img.onload = () => {
      // 图片原始尺寸
      let originWidth = img.width;
      let originHeight = img.height;
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      // 最大尺寸限制
      let maxWidth = 800, maxHeight = 800;
      // 目标尺寸
      let targetWidth = originWidth, targetHeight = originHeight;
      // 图片尺寸超过400x400的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }
      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);

      // canvas转换成dataUrl
      let dataUrl = canvas.toDataURL(type || 'image/png');
      // 转换成formdata格式用于上传图片
      let blob = dataURItoBlob(dataUrl);

      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Error！！'));
      }
    }
  });
};

export function blobToDataURI(blob, callback) {
  let resolve, reject;
  const p = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject
  });
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
    resolve(e.target.result)
  };
  reader.onerror = function(e) {
    reject(e)
  };
  reader.readAsDataURL(blob);
  return p;
}

export function dataURItoBlob(dataURI) {
  let byteString = atob(dataURI.split(',')[1]);

  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {"type": mimeString});
}

export function imagetoCanvas(image) {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext('2d');
  cvs.width = image.width;
  cvs.height = image.height;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
  // var imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  // for (var i = 0; i < imageData.data.length; i += 4) {
  //   // 当该像素是透明的，则设置成白色
  //   if (imageData.data[i + 3] == 0) {
  //     imageData.data[i] = 255;
  //     imageData.data[i + 1] = 255;
  //     // imageData.data[i + 2] = 255;
  //     imageData.data[i + 3] = 255;
  //   }
  // }
  // ctx.putImageData(imageData, 0, 0);
  return cvs;
}

export function canvasResizetoFile(canvas, fileName, mime, quality, fn) {
  canvas.toBlob(function (blob) {
    const d = new Date()
    blob.lastModified = d.getTime()
    blob.lastModifiedDate = d;
    blob.name = fileName;
    fn(blob);
  }, mime, quality);
}

export function canvasResizetoDataURL(canvas, mime, quality) {
  return canvas.toDataURL(mime, quality);
}

export function filetoDataURL(file, fn) {
  var reader = new FileReader();
  reader.onload = function (e) {
    fn(e.target.result);
  };
  reader.readAsDataURL(file);
}

export function dataURLtoImage(dataurl, fn) {
  var img = new Image();
  img.onload = function () {
    fn(img);
  };
  img.src = dataurl;
}

export function dataURLtoFile(dataurl, fileName) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const theBlob = new Blob([u8arr], {type: mime});
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function imgFileCP2Blob(file, quality, fn) {
  let resolve, reject;
  const p = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject
  });
  if (utils.isGifType(file.name)) {
    resolve(file)
  } else {
    try {
      filetoDataURL(file, function (dataurl) {
        dataURLtoImage(dataurl, function (image) {
          canvasResizetoFile(imagetoCanvas(image), file.name, file.type, quality, function (file) {
            fn && fn(file);
            resolve(file);
          });
        })
      });
    } catch (e) {
      reject(e)
    }
  }
  return p
}
