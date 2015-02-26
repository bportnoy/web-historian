var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var handler = require('../web/request-handler.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(url,res){

  fs.readFile("../web/archives/sites.txt",
    {encoding: 'utf8'},
    function(err,data){
      // console.log(data);
      if (err) throw err;
      else{
        data = data.split("\n");
        if (exports.isUrlInList(url,data)){
          //don't add, tell them it's loading
        } else{
          exports.addUrlToList(url,data,res);
        }
      }
    });
};

exports.isUrlInList = function(url, list){
  return (list.indexOf(url) === -1) ? false : true;
};

exports.addUrlToList = function(url, list, res){
  list.push(url);
  list.join("\r\n");
  fs.writeFile("../web/archives/sites.txt",list,function(err){
    if (err){ throw err;
        console.log(handler);}
    else handler.siteAdded(res);
  });
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};

