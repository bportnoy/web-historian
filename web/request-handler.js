var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

var settings = {
  baseUrl: "./public"
};

var actions = {
  GET: function(req, res){
    var url = req.url;

    if(url === "/"){
      url = "/index.html";
    }

    url = archive.paths.siteAssets + url;

    console.log('Serving request for: ' + url);
    fs.readFile(url, function(err, data){
      if (err) {
        if (err.code === "ENOENT") sendResponse(res,null,404);
        else throw err;
      }//error handling
      else {
        res.writeHead(200);
        res.write(data);
        res.end();
      }
      // sendResponse(res,data,200);
    });
  },
  POST: function(req, res){
    console.log('serving POST');
    var requestedSite = '';
    req.on('data',function(chunk){
      requestedSite += chunk;
    });
    req.on('end',function(){
      requestedSite = requestedSite.slice(4);
      //see if exists in sites file
      archive.readListOfUrls(requestedSite,res);
    });
  }
};

exports.siteAdded = function(res){
  fs.readFile('./public/loading.html', function(err,data){
    res.writeHead(302);
    res.write(data);
    res.end();
  });
};

var sendResponse = function(res, data, statusCode) {
  res.writeHead(statusCode, {});
  // res.write(data);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  //find out what kind of request.
    //prase the URL
    //is it GET or POST
    var action = actions[req.method]
    if (action) {
      action(req, res);
    } else {
      sendResponse(res, null, 404);
    }
};

