import { tools } from "@/plugin/tools";
import alioss from "@/filter/alioss";
import filters from "@/filter";

import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";

function calcValidSpace(
  framePosition: perlaedu.Position,
  photoSize: perlaedu.Size,
  limitedWidth: number = 0,
  limitedHeight: number = 0
) {
  let { width, height } = framePosition;
  let top = framePosition.top || 0;
  let left = framePosition.left || 0;
  let bottom = framePosition.bottom || top;
  let right = framePosition.right || left;

  const frameRatioWidth = (limitedWidth > 0 && limitedWidth / width) || 1;
  const frameRatioHeight = (limitedHeight > 0 && limitedHeight / height) || 1;
  const frameRatio = Math.min(frameRatioWidth, frameRatioHeight);

  width = width * frameRatio;
  height = height * frameRatio;
  left = left * frameRatio;
  top = top * frameRatio;
  bottom = bottom * frameRatio;
  right = right * frameRatio;

  const { width: pWidth, height: pHeight } = photoSize;
  const validWidth = width - (left + right);
  const validHeight = height - (top + bottom);

  const ratio = Math.min(validWidth / pWidth, validHeight / pHeight);

  const computedWidth = Math.floor(pWidth * ratio);
  const computedHeight = Math.floor(pHeight * ratio);
  const computedLeft = left + Math.floor((validWidth - computedWidth) / 2);
  const computedTop = top + Math.floor((validHeight - computedHeight) / 2);
  const computedRight = right + Math.floor((validWidth - computedWidth) / 2);
  const computedBottom = bottom + Math.floor((validWidth - computedHeight) / 2);

  return {
    canvas: {
      width,
      height,
      left,
      top,
      right,
      bottom,
    },
    area: {
      width: computedWidth,
      height: computedHeight,
      left: computedLeft,
      top: computedTop,
      right: computedRight,
      bottom: computedBottom,
    },
  };
}

function getPhotoZoneInFrame(file, frame, limitedWidth = 0, limitedHeight = 0) {
  return calcValidSpace(
    {
      width: frame.width,
      height: frame.height,
      left: frame.left,
      top: frame.top,
      right: frame.right,
      bottom: frame.bottom,
    },
    {
      width: file.width,
      height: file.height,
    },
    limitedWidth,
    limitedHeight
  );
}

function checkEditable(user, merchantId = null, openid = null, id = null) {
  if (!user) return false;

  const uid = user.id;
  const uOpenid = user.openid;
  const uMerchantId = user.curr_merch_id;
  const isManager = user.is_manager;

  if (uid && uid === id) {
    return true;
  }

  if (uOpenid && uOpenid === openid) {
    return true;
  }

  if (
    uMerchantId &&
    parseInt(uMerchantId) === parseInt(merchantId) &&
    isManager
  ) {
    return true;
  }

  return false;
}

function getPosterData(
  media,
  frame = null,
  options = null,
  limitedWidth = 0,
  limitedHeight = 0
) {
  frame = frame || media.frame || media.file;
  const computedZone = getPhotoZoneInFrame(
    media.file,
    frame,
    limitedWidth,
    limitedHeight
  );

  const poster = {
    name: media.title,
    baseWidth: computedZone.canvas.width,
    baseHeight: computedZone.canvas.height,
    baseColor: null,
    template: null,
    elements: [],
  };

  if (frame !== media.file) {
    poster.elements = concat(poster.elements, [
      {
        type: "image",
        value: alioss(frame.url, {
          width: computedZone.canvas.width,
          height: computedZone.canvas.height,
        }),
        options: {
          width: computedZone.canvas.width,
          height: computedZone.canvas.height,
          x: 0,
          y: 0,
          z: 1,
        },
      },
      {
        type: "image",
        value: alioss(media.file.url, {
          width: computedZone.area.width,
          height: computedZone.area.height,
        }),
        options: {
          width: computedZone.area.width,
          height: computedZone.area.height,
          x: computedZone.area.left,
          y: computedZone.area.top,
          z: 2,
        },
      },
    ]);
  }

  if (!isEmpty(options)) {
    poster.baseColor = "white";
    poster.baseHeight += 600;
    poster.elements = concat(poster.elements, [
      {
        type: "text",
        value: options.title,
        options: {
          width: 1000,
          height: 50,
          x: 0,
          y: computedZone.canvas.height,
          fontFamily: "MicrosoftYaHei-Bold,MicrosoftYaHei",
          align: "center",
          verticalAlign: "middle",
          fontSize: 64,
          fontStyle: "bold",
        },
      },
      {
        type: "text",
        value: options.name,
        options: {
          width: 1000,
          height: 50,
          x: 0,
          y: computedZone.canvas.height + 150,
          fontFamily: "MicrosoftYaHei-Bold,MicrosoftYaHei",
          align: "center",
          verticalAlign: "middle",
          fontSize: 48,
          fontStyle: "bold",
        },
      },
      {
        type: "text",
        value: options.merchant,
        options: {
          width: 1000,
          height: 50,
          x: 0,
          y: computedZone.canvas.height + 200,
          fontFamily: "MicrosoftYaHei-Bold,MicrosoftYaHei",
          align: "center",
          verticalAlign: "middle",
          fontSize: 40,
        },
      },
      {
        type: "text",
        value: filters.defaultDay(options.publishedAt),
        options: {
          width: 1000,
          height: 50,
          x: 0,
          y: computedZone.canvas.height + 250,
          fontFamily: "MicrosoftYaHei-Bold,MicrosoftYaHei",
          align: "center",
          verticalAlign: "middle",
          fontSize: 40,
        },
      },
      {
        type: "image",
        value: tools.makeQrcode(options.url),
        options: {
          width: 200,
          height: 200,
          x: 400,
          y: computedZone.canvas.height + 300,
          z: 3,
        },
      },
    ]);
  }
  return poster;
}

export { getPhotoZoneInFrame, getPosterData, checkEditable };