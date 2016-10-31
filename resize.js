const gm = require('gm').subClass({imageMagick: true});

gm('./empty-message.jpg')
    .scale('53%')
    .write('./final.png', function (err) {
       console.log('written');
    })