import request from "@/utils/request";
import { method } from "lodash";

export async function queryQrcodesAndServicer() {
  return request({
    url: "/api/v2/cms/queryQrcodesAndServicer",
    method: "POST",
    unenc: true,
  });
}

export async function upload2qiniu(playload = {}) {
  return request({
    url: "/api/v2/cms/qiniuUpload",
    method: "POST",
    data: playload,
    unenc: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function queryDiscountInternational() {
  return request({
    url: "/api/v2/cms/discountInternational",
    method: "POST",
    unenc: true,
  });
}

export async function queryAnnounceEssayList(playload = {}) {
  return request({
    url: "/api/v2/cms/queryAnnounceEssayList",
    method: "POST",
    data: playload,
    unenc: true,
  });
}
