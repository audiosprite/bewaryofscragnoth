// const mtg = require('mtgsdk');
const twit = require('twit');
const soapstone = require('./soapstone');
const request = require('request');

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
    console.log(bbtemplates[templateIndex]);
    return bbtemplates[templateIndex];
}

const template = pickTemplate();

//function that organizes which queries to perform

const pickQueries = function(template){
    var nounQueries = 0, verbQueries = 0, vonQueries = 0;
    console.log(template)
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
        console.log(requestObj.url)
    }
}

updateRequestObj(queries);

//function that performs mtg queries

const preformMTGQueries = function(requestObj){
    
}

//function that interpolates the two together

// console.log(soapstone);












// also do it in reverse ! fit dark souls objects ('beanpole') to mtg cards

//pick mtg queries
//hand to function which interpolates using `` with templates
