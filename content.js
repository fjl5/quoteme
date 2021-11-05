"use strict";

function _addQuotes(res) {
    let quoteStart = res.quoteStart || ',-------';
    let quoteBlock = res.quoteBlock || '| ';
    let quoteStopp = res.quoteStopp || '`-------';
    let quoteClean = res.quoteClean ;

    // Get text
    let textarea = document.activeElement;
    let first = textarea.selectionStart;
    let last = textarea.selectionEnd;
    let text = textarea.value;
    let before = text.substring(0, first);
    let after = text.substring(last);

    // Set "first" to beginning of first line
    first -= before.split("\n").pop().length;
    textarea.selectionStart = first;
    before = text.substring(0, first);

    // Set "last" to end of last line
    last += after.split("\n")[0].length;
    textarea.selectionEnd = last;
    after = text.substring(last);

    // Create quoted text
    let quoted = quoteStart + "\n";
    text.substring(first, last).split("\n").forEach(function(line) {
        if (quoteClean) {
            line = line.replace(/\s+$/g, "");
        }
        quoted += quoteBlock + line + "\n";
    });
    quoted += quoteStopp;

    // Insert quoted text
    // In Firefox < 89 we can't do this in a way that preserves the undo buffer
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1220696#c10
    // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/89
    if (!document.execCommand('insertText', false, quoted)) {
        textarea.setRangeText(quoted, first, last);
    }
}

// Add quotes
// Only quote active textarea
if (document.activeElement.tagName == "TEXTAREA") {
    // Get settings
    if (typeof browser === "undefined") {
        // Chrome extension
        chrome.storage.sync.get(
            ['quoteStart', 'quoteBlock', 'quoteStopp', 'quoteClean', 'nix'],
            _addQuotes);
    } else {
        // Firefox extension
        browser.storage.sync.get(
            ['quoteStart', 'quoteBlock', 'quoteStopp', 'quoteClean', 'nix']
        ).then(_addQuotes)
    }
} else {
    if (typeof browser === "undefined") {
        // Chrome extension
        alert(chrome.i18n.getMessage("noTextareaWarning"));
    } else {
        // Firefox extension
        alert(browser.i18n.getMessage("noTextareaWarning"));
    }
}
