const phantom = require('phantom');

// var webPage = require('webpage');
// var page = webPage.create();
// page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
// page.set('settings.userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36');

const ss = 'http://images.akamai.steamusercontent.com/ugc/218815564750590996/731E99181B135D37960B0CF2D92ABA907FCFB98C/'

let sitepage;
let phInstance;
phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        // page.settings = {};
        // page.set('settings.userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36');
        // sitepage.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
        sitepage.property('settings', {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11"
        });
        return page.open(ss);
    })
    .then(status => {
        console.log(status);
        return sitepage.property('content');
    })
    .then(content => {
        console.log(content);
        sitepage.close();
        phInstance.exit();
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });