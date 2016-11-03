var cheerio = require('cheerio'); // Basically jQuery for node.js
var rp = require('request-promise');
var request = require('request');
var fs = require('fs');

var options = {
    uri: 'http://www.steamcommunity.com/app/211420/screenshots/?p=1&browsefilter=mostrecent',
    transform: function (body) {
        return cheerio.load(body);
    }
};

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });

rp(options)
    .then(function ($) {
        let imgs = [];
        $('img').each(function(i, element){
            if (element.attribs.src.indexOf('images.akamai') !== -1){
                imgs.push(element);
            }
        })
        console.log(imgs, imgs.length);
        let whichImg = Math.floor(Math.random() * 10);
        let source = imgs[whichImg].attribs.src;
        console.log(source);
        download(source, 'screenshot', function(){
            console.log('downloaded');
        })
    })
    .catch(function (err) {
        console.log(err);
    });

// rp(options.uri)
//     .then(function(body){
//         console.log(body);
//     })