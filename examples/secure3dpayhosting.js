//please use "npm install express body-parser" command first to use this example.
//3d password is "a" for the test credit card.

var nodeNestpay = require("../index.js");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

nestpay = new nodeNestpay({
  name: "<MERCHANTNAME>",
  clientId: "<YOURCLIENTID>",
  storekey: "<YOURSTOREKEY>",
  callbackSuccess: "http://localhost:3000/success",
  callbackFail: "http://localhost:3000/fail",
  endpoint: "<BANK>",
  currency: "TRY",
});

app.get("/", function (req, res) {
  nestpay
    .secure3dpayhosting({
      storetype: "3D PAY HOSTING",
      amount: "0.01",
      secureFormat: "html",
      refreshtime: 5,
      products: [
        {
          product: {
            price: 10,
          },
          amount: 100,
        },
      ],
    })
    .then(function (secure3dResult) {
      res.send(secure3dResult);
    })
    .catch(function (secure3dError) {
      res.send(secure3dError);
    });
});

app.post("/fail", function (req, res) {
  res.send(req.body);
});

app.post("/success", function (req, res) {
  res.send(req.body);
});

app.listen(3000, function () {
  console.log("Example is ready. (Url: localhost:3000)");
});
