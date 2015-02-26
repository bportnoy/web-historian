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
    //handle routing cases for static assets
    if(url === "/" || url === '/loading.html' || url === '/styles.css'){
      if(url === "/"){
        url =  "/index.html";
      }
      url = archive.paths.siteAssets + url;
      console.log('Serving request for: ' + url);
      fs.readFile(url, function(err, data){
        if (err) { //error handling
          if (err.code === "ENOENT") sendResponse(res,null,404);
          else throw err;
        }
        else {
          res.writeHead(200);
          res.write(data);
          res.end();
        }
      });
    } else { //handle cases for dynamic assets
        fs.readFile(archive.paths.archiveList, {encoding:"utf8"}, function(err, archiveData){
          if (err) throw err;
          else archive.isURLArchived(url, archiveData, res);
        });
    };

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

exports.serveArchive = function (url,res){
  url = archive.paths.archivedSites + url + '.html';
  res.writeHead(200);
  fs.readFile(url, {encoding:'utf8'}, function(err,data){
    if (err) throw err;
    res.end(data);
    console.log('Served archived site: ' + url)
  });

}

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

