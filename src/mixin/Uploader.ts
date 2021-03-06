import { Component, Vue } from "vue-property-decorator";

import axios from "axios";
import format from "date-fns/format";
import imageCompression from "browser-image-compression";
import _get from "lodash/get";

import FileApi from "@/api/common/file";
import MediaFileApi from "@/api/media/media_file";

const urljoin = require("url-join");
const uuidv4 = require("uuid/v4");
const MD5 = require("crypto-js/md5");

@Component
export default class UploaderMixin extends Vue {
  requiredCompression = true;

  uploadBlob(
    blob,
    type,
    prefix,
    suffix,
    callback,
    callbackPrg = null,
    fileOptions = null
  ) {
    this.upload(blob, type, prefix, suffix, callback, callbackPrg, fileOptions);
  }

  uploadFile(
    file,
    type,
    prefix,
    callback,
    callbackPrg = null,
    fileOptions = null
  ) {
    const suffixPos = file.name.lastIndexOf(".");
    const suffix = suffixPos >= 0 && file.name.substring(suffixPos);
    this.upload(file, type, prefix, suffix, callback, callbackPrg, fileOptions);
  }

  upload(
    file,
    type,
    prefix,
    suffix,
    callback,
    callbackPrg,
    fileOptions = null
  ) {
    prefix = urljoin(prefix, format(new Date(), "yyyyMMdd"));

    // md5
    // const stage1 = (new Date()).getTime();
    this.md5(file, (md5) => {
      // const stage2 = (new Date()).getTime();
      // console.log("md5 cost: ", stage2 - stage1, md5);

      // 压缩
      this.compression(file, (compressedFile) => {
        // const stage3 = (new Date()).getTime();
        // console.log("compresseion cost: ", stage3 - stage2);

        // key
        const key = urljoin(prefix, md5 + suffix);

        // token
        this.fetchToken(type, key).then((resp) => {
          const token = resp.data.token;
          const size = compressedFile.size;
          const url = token.url;

          // media_file
          this.createMediaFile(md5, size, url, fileOptions, (mediaFile) => {
            if (mediaFile.is_uploaded) {
              callbackPrg && callbackPrg(100);
              callback(mediaFile.url, mediaFile);
              return;
            }

            // upload
            this.sendFile(compressedFile, key, token, callbackPrg)
              .then(() => {
                this.confirmedMediaFile(mediaFile, () => {
                  callback(mediaFile.url, mediaFile);
                });
              })
              .catch((error) => console.log(error));
          });
        });
      });
    });
  }

  md5(file, callback) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      callback(MD5(reader.result).toString());
    };
  }

  confirmedMediaFile(mediaFile, callback) {
    MediaFileApi.update({
      id: mediaFile.md5,
      res: {
        is_uploaded: true,
      },
      headers: null,
      args: null,
      query: null,
    }).then(() => {
      callback();
    });
  }

  createMediaFile(md5, size, url, fileOptions, callback) {
    MediaFileApi.create({
      res: {
        size: size,
        md5: md5,
        url: url,
        width: _get(fileOptions, "width", 0),
        height: _get(fileOptions, "height", 0),
      },
      headers: null,
      args: null,
      query: null,
    }).then((resp) => {
      callback(resp.data);
    });
  }

  compression(file, callback) {
    /*
     * browser-image-compression 在window工作可能存在问题
     * window+微信 工作不正常
     * window+微信开发者工具，工作正常
     * window+chrome/edge，工作正常
     * 暂时如此规避
     */
    const isInPCWinWechat =
      this.$client.device.isPC &&
      this.$client.pc.isWin &&
      this.$client.browser.isMicromessenger;
    if (!this.requiredCompression || isInPCWinWechat) {
      callback && callback(file);
      return;
    }
    // console.log('originalFile instanceof Blob', file instanceof Blob); // true
    // console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    // const maxSizeMB = Math.floor(file.size * 0.2 / (1024.0 * 1024.0))

    const options = {
      maxSizeMB: 1,
      useWebWorker: false,
    };
    imageCompression(file, options)
      .then(function (compressedFile) {
        // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        callback && callback(compressedFile);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  fetchToken(type, key) {
    return FileApi.create({
      res: {
        type,
        key,
      },
      headers: null,
      args: null,
      query: null,
    });
  }
  sendFile(file, filename, token, callbackPrg) {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    };

    const formData = new FormData();
    formData.append("key", token.path);
    formData.append("policy", token.policy);
    formData.append("OSSAccessKeyId", token.accessid);
    formData.append("success_action_status", "200");
    formData.append("signature", token.signature);

    formData.append("name", filename);
    formData.append("file", file, filename);

    return axios.post(token.host, formData, {
      headers: headers,
      onUploadProgress: (result) => {
        callbackPrg &&
          callbackPrg(Math.round((result.loaded * 100) / result.total));
      },
    });
  }
}
