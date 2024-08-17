const generate = (data) => {
  const dotsOptions = data.dotsOptions || {}
  const cornersSquareOptions = data.cornersSquareOptions || {}
  const backgroundOptions = data.backgroundOptions || {}
  const cornersDotOptions = data.cornersDotOptions || {}
  const imageOptions = data.imageOptions || {}
  return{
    width: data.width || 300,
    height: data.height || 300,
    data: data.data,
    image: data.image,
    dotsOptions: {
      color: dotsOptions.color || "#4267b2",
      type: dotsOptions.type || 'square',
    },
    cornersSquareOptions: {
      color: cornersSquareOptions.color || "#4267b2",
      type: cornersSquareOptions.type || 'square',
    },
    cornersDotOptions: {
      color: cornersDotOptions.color || "#4267b2",
      type: cornersDotOptions.type || 'square',
    },
    backgroundOptions: {
      color: backgroundOptions.color || "#ffffff",
    },
    imageOptions: {
      hideBackgroundDots: imageOptions.hideBackgroundDots,
      imageSize: imageOptions.imageSize,
      crossOrigin: "anonymous",
      margin: imageOptions.margin,
    },
  }
};

module.exports = generate;
