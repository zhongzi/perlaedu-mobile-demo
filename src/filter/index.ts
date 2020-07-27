import safe from "@jukejia/egret-utils/dist/filters/safe";
import postfix from "@jukejia/egret-utils/dist/filters/postfix";
import round from "@jukejia/egret-utils/dist/filters/round";
import html from "@jukejia/egret-utils/dist/filters/html";
import watermark from "@jukejia/egret-utils/dist/filters/watermark";

import qrcode from "./qrcode";
import qrcodeWhite from "./qrcode_white";
import alioss from "./alioss";
import prettyBytes from "./pretty_bytes";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import isSameDay from "date-fns/isSameDay";
import _isPast from "date-fns/isPast";
import differenceInDays from "date-fns/differenceInDays";
import differenceInSeconds from "date-fns/differenceInSeconds";

function parseDate(value) {
  return parseISO(value);
}

function distanceFromDatetime(
  value: Date | string,
  simplify: boolean = false
): string {
  return distanceFromSeconds(
    differenceInSeconds(new Date(), parseDate(value)),
    simplify
  );
}

function distanceFromSeconds(seconds, simplify = false) {
  console.log(seconds);
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  let dDisplay = "";
  if (d > 0) {
    dDisplay = d + "天";
    if (simplify) {
      return ["今天", "昨天", "前天"][d] || dDisplay + "前";
    }
  }
  let hDisplay = "";
  if (h > 0) {
    hDisplay = h + "小时";
    if (simplify) {
      return hDisplay + "前";
    }
  }

  let mDisplay = "";
  if (m > 0) {
    mDisplay = m + "分";
    if (simplify) {
      return mDisplay + "钟前";
    }
  }

  let sDisplay = "";
  if (s > 0) {
    sDisplay = m + "秒";
    if (simplify) {
      return sDisplay + "前";
    }
  }
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function mask(value, num, slot = "...") {
  const _v = value.substring(0, num);
  if (_v === value) {
    return _v;
  }
  return _v + slot;
}

function date(value, formatStr, option = {}) {
  if (value) {
    if (typeof value.getMonth !== "function") {
      value = parseISO(value);
    }
    return format(value, formatStr, option);
  } else {
    return null;
  }
}

function isPast(value: string): boolean {
  return _isPast(parseISO(value));
}

function defaultDate(value: Date | string | void): string {
  return date(value, "yyyy-MM-dd HH:mm:ss");
}

function defaultDay(value: Date | string | void): string {
  return date(value, "yyyy-MM-dd");
}

function dayOnly(value: Date | string | void): string {
  return date(value, "MM-DD");
}

function diffInDays(value: Date | string): number {
  return differenceInDays(new Date(), parseDate(value));
}

function sameDay(
  left: Date | string | void,
  right: Date | string | void
): boolean {
  left = parseDate(left);
  right = parseDate(right);
  return isSameDay(left, right);
}

function fillZero(value: Number) {
  if (value < 10) {
    return "0" + value;
  }
  return value;
}

const filters: { [k: string]: any } = {
  fillZero,
  html,
  safe,
  parseDate,
  date,
  postfix,
  round,
  watermark,
  defaultDate,
  defaultDay,
  dayOnly,
  sameDay,
  qrcode,
  qrcodeWhite,
  alioss,
  mask,
  isPast,
  diffInDays,
  distanceFromSeconds,
  distanceFromDatetime,
  prettyBytes,
};

export default filters;
