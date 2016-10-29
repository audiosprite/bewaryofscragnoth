String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

const dasouls = {
    templates: [
        '{nn} ahead',
        'be wary of {nn}',
        'try {vbg}',
        'need {vbg}',
        'imminent {nn}...',
        'weakness: {either}',
        '{nn}',
        '{either}?'
    ]
}

const bloodborne = {
    templates: [
        'fear {nn}',
        'remember {nn}',
        'time for {vbg}',
        "it's the sourge of {nn}",
        'reeks of {nn}',
        '{vbg} is effective',
        'beware of {nn}',
        'treat {nn} with care',
        'it is all thanks to {anycard}',
        'despicable {nn}',
        'woeful {nn}',
        'wondrous {nn}',
        'nothing but {nn} here',
        '{nn} waits ahead',
        // 'you must accept {concept}',
        'have mercy, {nn}',
        'no mercy for {nn}',
        'have audience with {nn}',
        'reminiscient of {nn}',
        'oh, {nn}!'
    ],
    conjunctions: [
        'and',
        'but',
        'or',
        'therefore',
        'eventually',
        ','
    ]
};

const soapstone = {
    bloodborne,
    dasouls
};

module.exports = soapstone;