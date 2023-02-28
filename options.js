"use strict";

function _doRestoreOptions(res) {
    document.querySelector('#quote-start').value = res.quoteStart;
    document.querySelector('#quote-block').value = res.quoteBlock;
    document.querySelector('#quote-stopp').value = res.quoteStopp;
    document.querySelector('#quote-clean').checked = res.quoteClean;
}

if (typeof browser === "undefined") {
    // As long as the API calls are compatible, redirect
    // the "browser" namespace to "chrome".
    var browser = chrome;

    // Chrome has no promise on the storage API
    var restoreOptions = function() {
        chrome.storage.sync.get(
            {
                quoteStart: quoteSets.asciiShort.start,
                quoteBlock: quoteSets.asciiShort.block,
                quoteStopp: quoteSets.asciiShort.stopp,
                quoteClean: true
            },
            _doRestoreOptions
        );
    }
} else {
    // Firefox uses promises
    restoreOptions = function() {
        browser.storage.sync.get({
            quoteStart: quoteSets.asciiShort.start,
            quoteBlock: quoteSets.asciiShort.block,
            quoteStopp: quoteSets.asciiShort.stopp,
            quoteClean: true
        }).then(_doRestoreOptions);
    }
}

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
    changedOptions();
}

const saved = document.querySelector('#saved');

// Save current options
function saveOptions(e) {
    browser.storage.sync.set({
        quoteStart: document.querySelector('#quote-start').value,
        quoteBlock: document.querySelector('#quote-block').value,
        quoteStopp: document.querySelector('#quote-stopp').value,
        quoteClean: document.querySelector('#quote-clean').checked,
    });
    e.preventDefault();
    saved.style.display = '';  // show
}

function changedOptions() {
    saved.style.display = 'none';  // hide
}

// Add event handlers
document.querySelector('#quote-set').addEventListener('change', setOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);

document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', changedOptions);
});

// Translate options page
for (const node of document.querySelectorAll('[data-i18n]')) {
    node.innerHTML = browser.i18n.getMessage(node.dataset.i18n);
}
