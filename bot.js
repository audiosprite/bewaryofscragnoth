// const mtg = require('mtgsdk');
const Twit = require('twit');
const soapstone = require('./soapstone');
const request = require('request');
var rp = require('request-promise');

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
const pickTemplate = function({bloodborne, dasouls, dasouls3}){
    var randomTemplate = Math.random();
    (randomTemplate > 0.66) ? (usedTemplates = dasouls3) :
    (0.66 >= randomTemplate > 0.33) ? (usedTemplates = bloodborne) :
    usedTemplates = dasouls;
    var templateIndexA = Math.floor(Math.random() * (usedTemplates.templates.length));
    // console.log('usedtemplates', usedTemplates);
    if ((usedTemplates === bloodborne || usedTemplates === dasouls3) && (Math.random() > 0.5)){
        var templateIndexB = Math.floor(Math.random() * (usedTemplates.templates.length));
        var whichConjunction = usedTemplates.conjunctions[Math.floor(Math.random() * (usedTemplates.conjunctions.length))];
        // console.log('whichConjunction: ', whichConjunction, usedTemplates.length)
        var template = usedTemplates.templates[templateIndexA] + " " + whichConjunction + " " + usedTemplates.templates[templateIndexB];
    } else {
        template = usedTemplates.templates[templateIndexA];
    }
    // console.log(template)
    return template;
}

const template = pickTemplate(soapstone);
// const template = '{vbg} is effective but treat {nn} with care';

//function that organizes which queries to perform

const pickQueries = function(template){
    var nounQueries = 0, verbQueries = 0, vonQueries = 0;
    for (var i = 0; i < template.length; i++){
        if (template[i] === '{'){
            if (template.substring(i, i+4) === '{nn}'){
                nounQueries++;
            } if (template.substring(i, i+5) === '{vbg}'){
                verbQueries++;
            } if (template.substring(i, i+4) === '{vbg_or_nn}'){
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
    var requestObj = queries;
    var requestUrl = 'https://api.magicthegathering.io/v1/cards';
    var totalQueries = queries.nounQueries + queries.verbQueries + queries.vonQueries;
    // console.log('totalqueries', totalQueries)
    for (var i = 0; i < totalQueries; i++){
        // console.log('nounqueries', queries.nounQueries)
        if (queries.nounQueries > 0){
            var thisUrl = 'url' + i;
            // console.log('thisUrl', thisUrl)
            requestObj[thisUrl] = requestUrl + '?types=creature';
        }
        if (queries.verbQueries > 0) {
            var thisUrl = 'url' + i;
            requestObj[thisUrl] = requestUrl + '?types=instant';
        }
    }
    // console.log('reqobj', requestObj);
    return requestObj;
}

requestObj = updateRequestObj(queries);

//function that performs mtg queries, then posts

const performMTGQueries = function(requestObj){
    for (var query in requestObj){
        console.log('query', requestObj[query]);
    }
    console.log(requestObj);
    request(requestObj.url0, function(err, res, body){
        cards = JSON.parse(body).cards;
        var card = cards[Math.floor(Math.random() * (cards.length + 1))].name.toLowerCase();
        var status = interpolate(template, card);
        console.log('final: ', status);

        // POST !!!
        // T.post('statuses/update', { status }, function(err, data, response) {
        //     console.log(data.created_at);
        // })
    })
}

const creature = performMTGQueries(requestObj);

//function that interpolates the two together
// have: template, creature

const interpolate = function(template, card){
    var supplantObj = {
        nn: card,
        vbg: card
    }
    return template.supplant(supplantObj);
}

// const oneMTGQuery = function(){

// }








// also do it in reverse ! fit dark souls objects ('beanpole') to mtg cards

//pick mtg queries
//hand to function which interpolates using `` with templates
