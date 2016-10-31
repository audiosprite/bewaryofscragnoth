const imgur = require('imgur');

imgur.uploadUrl('http://images.akamai.steamusercontent.com/ugc/217690086680659969/D896020A76CDBE9614E34DB7B20F269309B77BF1/')
    .then(function (json) {
        console.log('jsondatalink', json.data.link);
        var imgurOpts = {
            url: json.data.link,
            dist: '1080'
        }
    })
    .catch(function (err) {
        console.error('err', err.message);
    });