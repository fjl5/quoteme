"use strict";

// Predefined sets of quotation markers
const quoteSets = {
    asciiShort: {
        start: ',-------',
        block: '| ',
        stopp: '`-------'
    },
    asciiLong: {
        start: ',---------------',
        block: '| ',
        stopp: '`---------------'
    },
    unicodeLight: {
        start: '\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
        block: '\u2502 ',
        stopp: '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500'
    },
    unicodeStrong: {
        start: '\u250F\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
        block: '\u2503 ',
        stopp: '\u2517\u2501\u2501\u2501\u2501\u2501\u2501\u2501'
    },
    unicodeDouble: {
        start: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
        block: '\u2551 ',
        stopp: '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550'
    },
    eMail: {
        start: 'Quote:',
        block: '> ',
        stopp: ''
    },
}

// Set options from predefined set
function setOptions() {
    let requestedSet = quoteSets[document.querySelector('#quote-set').value];
    if (requestedSet) {
        document.querySelector('#quote-start').value = requestedSet.start;
        document.querySelector('#quote-block').value = requestedSet.block;
        document.querySelector('#quote-stopp').value = requestedSet.stopp;
    }
}

// Save current options
function saveOptions(e) {
    browser.storage.sync.set({
        quoteStart: document.querySelector('#quote-start').value,
        quoteBlock: document.querySelector('#quote-block').value,
        quoteStopp: document.querySelector('#quote-stopp').value,
    });
    e.preventDefault();
}

// Load perviously saved options
function restoreOptions() {
    browser.storage.sync.get(
        ['quoteStart', 'quoteBlock', 'quoteStopp']
    ).then((res) => {
        document.querySelector('#quote-start').value = 
            res.quoteStart || quoteSets.asciiShort.start,
        document.querySelector('#quote-block').value = 
            res.quoteBlock || quoteSets.asciiShort.block,
        document.querySelector('#quote-stopp').value = 
            res.quoteStopp || quoteSets.asciiShort.stopp
    });
}

// Add event handlers
document.querySelector('#quote-set').addEventListener('change', setOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);

// Translate options page
for (const node of document.querySelectorAll('[data-i18n]')) {
    node.innerHTML = browser.i18n.getMessage(node.dataset.i18n);
}
