"use strict";

var crypto = require("crypto");
var currencyCodes = require("currency-codes");
var uuid = require("uuid/v1");
const HandlebarsRenderer = require("../utils/HandlebarsRenderer");

module.exports = function (nestpay) {
  nestpay.prototype.secure3dpayhosting = function (value = {}) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var currencyNumber = currencyCodes.code(
        value.currency || that.config.currency
      );
      currencyNumber = currencyNumber ? currencyNumber.number : "";
      var order = value.orderId
        ? value.orderId == "Auto"
          ? uuid()
          : value.orderId
        : that.config.orderId == "Auto"
        ? uuid()
        : "";

      var data = {
        form: {
          clientId: that.config.clientId,
          oid: order,
          amount: value.amount || "",
          okUrl: value.callbackSuccess || that.config.callbackSuccess,
          failUrl: value.callbackFail || that.config.callbackFail,
          rnd: value.timestamp || new Date().getTime(),
          currency: currencyNumber,
          storetype: value.storetype || that.config.storetype,
          lang: value.lang || that.config.lang,
          processType: value.processType || that.config.processType,
          refreshtime: value.refreshtime || that.config.refreshtime,
          products: value.products || null,
        },
        url: that.config.endpoints3d[that.config.endpoint],
      };

      const hashstr = [
        data.form.clientId,
        data.form.oid,
        data.form.amount,
        data.form.okUrl,
        data.form.failUrl,
        data.form.processType,
        data.form.rnd,
        value.storekey || that.config.storekey,
      ].join("");

      data.form.hash = crypto
        .createHash("sha1")
        .update(hashstr)
        .digest("base64");

      // if secure format is set
      if (
        value.secureFormat === "html" ||
        that.config.secureFormat === "html"
      ) {
        HandlebarsRenderer.render("secure3dpayhosting", data).then(function (
          html
        ) {
          resolve(html);
        });
      }

      // if secure format is not set
      else {
        resolve(data);
      }
    });
  };
};
