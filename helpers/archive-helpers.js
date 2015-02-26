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
  'archivedSites' : path.join(__dirname, '../web/archives/sites/'),
  'list' : path.join(__dirname, '../web/archives/sites.txt'),
  'archiveList' : path.join(__dirname, '../web/archives/archives.txt')
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
  fs.readFile(exports.paths.list,
    {encoding: 'utf8'},
    function(err,data){
      if (err) throw err;
      else{
        console.log('data: ' + data);
        data = data.split("\n");
        if (exports.isUrlInList(url,data)){
          handler.siteAdded(res);
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
  // console.log(list);
  list.push(url);
  list = list.join("\n");
  fs.writeFile(exports.paths.list,list,function(err){
    if (err){ throw err;
        console.log(handler);}
    else handler.siteAdded(res);
  });
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};

