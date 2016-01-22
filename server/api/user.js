'use strict';

var multiparty = require('multiparty');
var fs = require('fs');
var request = require('request');

function isBodyValid(body) {
  return (body.firstName && body.lastName && body.email);
}

module.exports.create = function (req, res) {
  var fields = req.body;

  if (!isBodyValid(fields)) {
    return res.send(400, {message: 'Fields missing'});
  }

  return res.send(200);
};

module.exports.upload = function (req, res) {

  var form = new multiparty.Form();

  form.on('file', function (name, file) {

    var options = {
      method: 'POST',
      url: 'https://apicloud-facerect.p.mashape.com/process-file.json',
      headers: {
        'X-Mashape-Key': 'jiYKzMkjIBmshJTva1hgdCKFHrkyp17jtdcjsnWVrHq070ZHr2'
      },
      formData: {
        image: fs.createReadStream(file.path)
      }
    };

    request(options, function (err, httpResponse, body) {
      if (err) {
        res.send(500);
        return console.error('upload failed:', err);
      }
      var faces = JSON.parse(body).faces;
      var status = (faces && faces.length) ? 201 : 406;
      res.send(status);
      console.log('Picture uploaded successfully. Facerect responded with:', body);
    });

  });
  form.parse(req);

};
