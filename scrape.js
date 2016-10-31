var fs = require('fs');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// deleteFolderRecursive('./dl');

var crawler = require('img-crawler');  

const deleteThenCrawl = function(){
    var opts = {
        url: 'http://steamcommunity.com/app/211420/screenshots/?p=1&browsefilter=mostrecent',
        dist: 'dl'
    };
    deleteFolderRecursive('./dl/');
    return crawler.crawl(opts, function(err, data) {
        console.log('Downloaded %d from %s', data.imgs.length, opts.url);
        var imgFolder = './dl/images.akamai.steamusercontent.com/ugc/';
        imgFolder = imgFolder + fs.readdirSync(imgFolder)[0] + '/';
        imgFolder = imgFolder + fs.readdirSync(imgFolder)[0] + '/';
        var imgLocation = imgFolder + fs.readdirSync(imgFolder)[0];
        console.log(imgLocation);
        return imgLocation;
    });   
}

// deleteThenCrawl();

module.exports = deleteThenCrawl;

// var imgFolder = 'http://images.akamai.steamusercontent.com/ugc/395581850122536314/97C8E4F7EB1D142A01F29034DDC4D076EE4BBDA6/'

// console.log(fs.readdirSync(imgFolder));