// const mtg = require('mtgsdk');
const Twit = require('twit');
const soapstone = require('./soapstone');
const request = require('request');
const rp = require('request-promise');
const rita = require('rita');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const framptraw = './frampt-raw.jpg';

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
    if ((usedTemplates === bloodborne || usedTemplates === dasouls3) && (Math.random() > 0.5)){
        var templateIndexB = Math.floor(Math.random() * (usedTemplates.templates.length));
        var whichConjunction = usedTemplates.conjunctions[Math.floor(Math.random() * (usedTemplates.conjunctions.length))];
        // console.log('whichConjunction: ', whichConjunction, usedTemplates.length)
        var template = usedTemplates.templates[templateIndexA] + whichConjunction + " " + usedTemplates.templates[templateIndexB];
    } else {
        template = usedTemplates.templates[templateIndexA];
    }
    // console.log(rita.RiTa.getPosTagsInline(template));
    return template;
}

const template = pickTemplate(soapstone);
// var template = '{vbg} is effective but treat {anycard} with care';

//function that organizes which queries to perform

const pickQueries = function(){
    var nounQueries = 0, verbQueries = 0, vonQueries = 0, anyQueries = 0;
    for (var i = 0; i < template.length; i++){
        if (template[i] === '{'){
            if (template.substring(i, i+4) === '{nn}'){
                nounQueries++;
            } if (template.substring(i, i+5) === '{vbg}'){
                verbQueries++;
            } if (template.substring(i, i+8) === '{either}' ||
                  template.substring(i, i+9) === '{anycard}'){
                if (Math.random() > 0.5){
                    nounQueries++;
                    var supplObj = {
                        either: '{nn}',
                        anycard: '{nn}'
                    }
                } else {
                    verbQueries++;
                    supplyObj = {
                        either: '{vbg}',
                        anycard: '{vbg}'
                    }
                }
                template = template.supplant(supplObj);
            } if (template.substring(i, i+9) === '{anycard}'){
                anyQueries++;
            }
        }
    }
    return {
        nounQueries,
        verbQueries,
        vonQueries,
        anyQueries
    }
}

const queries = pickQueries();

//function that updates requestObj

const updateRequestObj = function(queries){
    var requestObj = queries;
    var requestUrl = 'https://api.magicthegathering.io/v1/cards';
    var querycount = 0;
    while (queries.nounQueries || queries.verbQueries || queries.vonQueries){
        if (queries.nounQueries){
            var thisUrl = 'url' + querycount;
            requestObj[thisUrl] = requestUrl + '?types=creature';
            querycount++;
            queries.nounQueries--;
        }
        if (queries.verbQueries){
            var thisUrl = 'url' + querycount;
            requestObj[thisUrl] = requestUrl + '?types=instant||sorcery';
            querycount++;
            queries.verbQueries--;
        }
        if (queries.vonQueries){
            var thisUrl = 'url' + querycount;
            if (Math.random() > 0.5){
                requestObj[thisUrl] = requestUrl + '?types=instant||sorcery';
            } else {
                requestObj[thisUrl] = requestUrl + '?types=creature';
            }
            querycount++;
            queries.vonQueries--;
        }
    }
    requestObj.json = true;
    return requestObj;
}

requestObj = updateRequestObj(queries);

//function that performs mtg queries, then posts

const performMTGQueries = function(requestObj){
    for (var query in requestObj){
        // console.log('query', requestObj[query]);
    }
    // console.log(requestObj);
    rp(requestObj.url0)
        .then(function(cards){
            // console.log(cards)
            cards = JSON.parse(cards).cards;
            var card = cards[Math.floor(Math.random() * (cards.length + 1))].name.toLowerCase();
            if (requestObj.url0 === 'https://api.magicthegathering.io/v1/cards?types=creature') {
                if (Math.random() > 0.4){ cardObj = { nn: card } }
                else { cardObj = { 
                    nn: card
                    // nn:pluralizeNouns(card) replace when fix puralizeNouns
                } }
            } else if (requestObj.url0 === 'https://api.magicthegathering.io/v1/cards?types=instant||sorcery') {
                cardObj = {
                    vbg: participleVerbs(card)
                }
            }
            // console.log(cardObj)
            var status = interpolate(template, cardObj);
            // console.log('final: ', status);
            if(requestObj.url1)
            {rp(requestObj.url1)
                .then(function(cards2){
                    cards2 = JSON.parse(cards2).cards;
                    var card2 = cards2[Math.floor(Math.random() * (cards2.length + 1))].name.toLowerCase();
                    if (requestObj.url1 === 'https://api.magicthegathering.io/v1/cards?types=creature') {
                        card2Obj = {
                            nn: card2
                        }
                    } else if (requestObj.url1 === 'https://api.magicthegathering.io/v1/cards?types=instant||sorcery') {
                        card2Obj = {
                            vbg: participleVerbs(card2)
                        }
                    }
                    // console.log(card2Obj)
                    status = interpolate(status, card2Obj);
                    console.log('final2: ', status);
                    imageInterpolate(status);
                    // T.post('statuses/update', { status }, function(err, data, response) {
                    //     console.log(data.created_at);
                    // })
                })} else {
                    console.log('final1: ', status);
                    imageInterpolate(status);
                    // T.post('statuses/update', { status }, function(err, data, response) {
                    //     console.log(data.created_at);
                    // })
                }
        })
}

const imageInterpolate = function(status){
    gm(framptraw)
        .composite('./empty-message.jpg')
        .geometry('+317+200')
        .write('./final.png', function (err) {
            // if (!err) console.log('done-img');
            gm('./final.png')
                .stroke("#ffffff")
                .font("./Edmundsbury-Serif-Revised.ttf", 40)
                .fill('#FFFFFF')
                .stroke('#AAAAAA')
                .drawText(590, 250, status)
                .write('./final.png', function (err) {
                    if (!err) console.log('done');
                })
            // add ratings text too
        })
}

const creature = performMTGQueries(requestObj);

//function that interpolates the two together
// have: template, creature

const interpolate = function(template, supplantObj){
    var final = template.supplant(supplantObj);
    return final;
}

//function to find verbs in mtg card

const findVerbs = function(spell){
    var ritaspell = rita.RiTa.getPosTags(spell);
    var numverbs = 0;
    for (var i = 0; i < ritaspell.length; i++){
        ritaspell[i] === 'vb' ?
        numverbs++ :
        numverbs;
    }
    numverbs === 1 ? index = ritaspell.indexOf('vb') : index = -1;
    return index;
}

//function to turn verbs (instants/sorceries) into present participle versions

const participleVerbs = function(spell){
    spell = spell.split(' ');
    var indexOfVerb = findVerbs(spell);
    // if (spell.length === 1){
    //     spell[0][spell[0].length-1] === 'i' || spell[0][spell[0].length-1] === 'e' ?
    //     addIng = spell[0].substring(0, spell[0].length-1) + 'ing' :
    //     addIng = spell[0] + 'ing';
    //     return addIng;
    // } else if (indexOfVerb !== -1){
    if (indexOfVerb !== -1){
        console.log('in -1', spell)
        spell[indexOfVerb] = rita.RiTa.getPresentParticiple(spell[indexOfVerb]);
        return spell.join(' ');
    } else {
        return spell.join(' ');
    }
}

// console.log(participleVerbs('boomerang'))
// console.log('testfinal', interpolate('try {vbg}', 'chaoslace'));

//function to find nouns in creature

const findNouns = function(creature){
    var ritaCreature = rita.RiTa.getPosTags(creature);
    var numnouns = 0;
    for (var i = 0; i < ritaCreature.length; i++){
        ritaCreature[i] === 'nn' ?
        numnouns++ :
        numnouns;
        // rita.RiLexicon.isVerb(spell[i]) ? numnouns++ : numnouns;
    }
    numnouns === 1 ? index = ritaCreature.indexOf('nn') : index = -1;
    return index;
}

//function to puralize nouns 

const pluralizeNouns = function(creature){
    creature = creature.split(' ');
    var indexOfNoun = findNouns(creature);
    if (indexOfNoun !== -1){
        creature[indexOfNoun] = rita.RiTa.pluralize(creature[indexOfNoun]);
    }
    return creature.join(' ');
}

// console.log(pluralizeNouns('ravenous rat'));

// const oneMTGQuery = function(){

// }








// also do it in reverse ! fit dark souls objects ('beanpole') to mtg cards

//pick mtg queries
//hand to function which interpolates using `` with templates
