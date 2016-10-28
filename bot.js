// const mtg = require('mtgsdk');
const Twit = require('twit');
const soapstone = require('./soapstone');
const request = require('request');

var T = new Twit({
  consumer_key:         't1E9h6v79789TovbKyiQ1pBhB',
  consumer_secret:      '0yHMEgTEWBiUenMmiahLzkUWtFE0iKTH4jupEoqq3Nxz7jyTxH',
  access_token:         '792118844148023296-DgHa6H4ju6Efeq8La4OdhIi7SWijYx6',
  access_token_secret:  'i2B31R52neKt1qrZWUF0R42r4EqLM4nJFDGl9iX6Eh76h',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

//trying to practice API so using api.magicthegathering.io instead of mtgsdk

//function that picks a dark souls message template
const pickTemplate = function(){
    var bbtemplates = soapstone.bloodborne.templates;
    var templateIndex = Math.floor(Math.random() * (bbtemplates.length + 1));
    // console.log(bbtemplates[templateIndex]);
    return bbtemplates[templateIndex];
}

const template = pickTemplate();

//function that organizes which queries to perform

const pickQueries = function(template){
    var nounQueries = 0, verbQueries = 0, vonQueries = 0;
    // console.log(template)
    for (var i = 0; i < template.length; i++){
        if (template[i] === '{'){
            if (template.substring(i, i+4) === '{nn}'){
                nounQueries++;
            } else if (template.substring(i, i+5) === '{vbg}'){
                verbQueries++;
            } else if (template.substring(i, i+4) === '{vbg_or_nn}'){
                vonQueries++;
            }
        }
    }
    return {
        nounQueries,
        verbQueries,
        vonQueries
    }
}

const queries = pickQueries(template);

//function that updates requestObj

const updateRequestObj = function(queries){
    var requestObj = {
        url: 'https://api.magicthegathering.io/v1/cards'
    }
    if (queries.nounQueries > 0){
        requestObj.url += '?types=creature'
        // console.log(requestObj.url)
    }
    return requestObj;
}

requestObj = updateRequestObj(queries);

//function that performs mtg queries, then posts

const performMTGQueries = function(requestObj){
    request(requestObj, function(err, res, body){
        cards = JSON.parse(body).cards;
        // console.log(cards[0]);
        var card = cards[Math.floor(Math.random() * (cards.length + 1))].name.toLowerCase();
        // console.log('beforefinal', template, card)
        var status = interpolate(template, card);
        console.log('final: ', status);
        
        T.post('statuses/update', { status }, function(err, data, response) {
            console.log(data)
        })
    })
}

const creature = performMTGQueries(requestObj);
// console.log(creature);

//function that interpolates the two together
// have: template, creature

const interpolate = function(template, creature){
    // console.log('template: ', template, 'creature: ', creature)
    var supplantObj = {
        nn: creature
    }
    return template.supplant(supplantObj);
}

// const final = interpolate(template, creature);
// console.log(final);

// console.log(soapstone);












// also do it in reverse ! fit dark souls objects ('beanpole') to mtg cards

//pick mtg queries
//hand to function which interpolates using `` with templates
