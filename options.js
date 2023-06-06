"use strict";

function _doRestoreOptions(res) {
    // Restore individual fields
    document.querySelector('#quote-start').value   = res.quoteStart;
    document.querySelector('#quote-block').value   = res.quoteBlock;
    document.querySelector('#quote-stopp').value   = res.quoteStopp;
    document.querySelector('#quote-clean').checked = res.quoteClean;
    document.querySelector('#quote-prev').value    = res.quotePrev;
    document.querySelector('#quote-post').value    = res.quotePost;
    document.quoteme.defaultAction.value           = res.defaultAction;

    // Find out if the block fields match a predefined setting
    var data;
    for (const block in quoteSets.block) {
        data = quoteSets.block[block];
        if (
            data.start == res.quoteStart &&
            data.block == res.quoteBlock &&
            data.stopp == res.quoteStopp
        ) {
            // Select setting
            document.querySelector('#block-quote-set').value = block;
            break;
        }
    }
    // Find out if the inline fields match a predefined setting
    for (const inline in quoteSets.inline) {
        data = quoteSets.inline[inline];
        if (
            data.prev == res.quotePrev &&
            data.post == res.quotePost
        ) {
            // Select setting
            document.querySelector('#inline-quote-set').value = inline;
            break;
        }
    }
}

if (typeof browser === "undefined") {
    // As long as the API calls are compatible, redirect
    // the "browser" namespace to "chrome".
    var browser = chrome;

    // Chrome has no promise on the storage API
    var restoreOptions = function() {
        chrome.storage.sync.get(
            {
                quoteStart:    quoteSets.block.asciiShort.start,
                quoteBlock:    quoteSets.block.asciiShort.block,
                quoteStopp:    quoteSets.block.asciiShort.stopp,
                quoteClean:    true,
                quotePrev:     quoteSets.inline.englishPrimary.prev,
                quotePost:     quoteSets.inline.englishPrimary.post,
                defaultAction: "quote_block",
            },
            _doRestoreOptions
        );
    }
} else {
    // Firefox uses promises
    restoreOptions = function() {
        browser.storage.sync.get({
            quoteStart:    quoteSets.block.asciiShort.start,
            quoteBlock:    quoteSets.block.asciiShort.block,
            quoteStopp:    quoteSets.block.asciiShort.stopp,
            quoteClean:    true,
            quotePrev:     quoteSets.inline.englishPrimary.prev,
            quotePost:     quoteSets.inline.englishPrimary.post,
            defaultAction: "quote_block",
        }).then(_doRestoreOptions);
    }
}

// Predefined sets of quotation markers
const quoteSets = {
    block: {
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
    },
    inline: {
        englishPrimary: {
            prev: '“',
            post: '”'
        },
        englishSecondary: {
            prev: '‘',
            post: '’'
        },
        germanPrimary: {
            prev: '„',
            post: '“'
        },
        germanSecondary: {
            prev: '‚',
            post: '‘'
        },
        germanAlternativePrimary: {
            prev: '»',
            post: '«'
        },
        germanAlternativeSecondary: {
            prev: '›',
            post: '‹'
        },
        frenchPrimary: {
            prev: '«',
            post: '»'
        },
        frenchSecondary: {
            prev: '‹',
            post: '›'
        },
        hungarianPrimary: {
            prev: '„',
            post: '”'
        },
        hungarianSecondary: {
            prev: '»',
            post: '«'
        },
        spanishExclamation: {
            prev: '¡',
            post: '!'
        },
        spanishQuestion: {
            prev: '¿',
            post: '?'
        },
    },
}

// Set block options from predefined set
function setBlockOptions() {
    let requestedSet = quoteSets.block[document.querySelector('#block-quote-set').value];
    if (requestedSet) {
        document.querySelector('#quote-start').value = requestedSet.start;
        document.querySelector('#quote-block').value = requestedSet.block;
        document.querySelector('#quote-stopp').value = requestedSet.stopp;
    }
    changedOptions();
}

// Set inline options from predefined set
function setInlineOptions() {
    let requestedSet = quoteSets.inline[document.querySelector('#inline-quote-set').value];
    if (requestedSet) {
        document.querySelector('#quote-prev').value = requestedSet.prev;
        document.querySelector('#quote-post').value = requestedSet.post;
    }
    changedOptions();
}

// Save current options
const saved = document.querySelector('#saved');

function saveOptions(e) {
    browser.storage.sync.set({
        quoteStart:    document.querySelector('#quote-start').value,
        quoteBlock:    document.querySelector('#quote-block').value,
        quoteStopp:    document.querySelector('#quote-stopp').value,
        quoteClean:    document.querySelector('#quote-clean').checked,
        quotePrev:     document.querySelector('#quote-prev').value,
        quotePost:     document.querySelector('#quote-post').value,
        defaultAction: document.quoteme.defaultAction.value,
    });
    e.preventDefault();
    saved.style.display = '';  // show
}

function changedOptions() {
    saved.style.display = 'none';  // hide
}

// Add event handlers
document.querySelector('#block-quote-set').addEventListener('change', setBlockOptions);
document.querySelector('#inline-quote-set').addEventListener('change', setInlineOptions);

document.quoteme.addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);

document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('change', changedOptions);
});

// Translate options page
for (const node of document.querySelectorAll('[data-i18n]')) {
    node.innerHTML = browser.i18n.getMessage(node.dataset.i18n);
}
