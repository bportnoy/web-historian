var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');
var http = require('http-request');

var main = function(){
console.log('initiating archive');

//open archivedsites.txt
  fs.readFile(archive.paths.archiveList, {encoding:"utf8"}, function(err, data){
    if (err) throw err;
      data = data.split("\n");
      openSites(data);
  });

//open sites.txt
  //execute callback when opened
  //split based on newline
  //for each item in array, see if url already exists in archivedsites
  //if it's not there, grab it and archive it
  //if it is there, do nothing

};

var openSites = function(archiveList){
  fs.readFile(archive.paths.list, {encoding:"utf8"}, function(err, data){
    if (err) throw err;
      sites = data.split("\n");
      fetchSites(sites, archiveList);
  });
};

var fetchSites = function(sites, archiveList){
  var grab = _.difference(sites, archiveList);
  _.each(grab, function(url){
    getUrl = "http://" + url;
    http.get(getUrl, archive.paths.archivedSites + url + '.html', function(err, response){
      if (err) throw err;
      else archive.addUrlToArchiveList(url,archiveList);
    });
  });
};

main();
