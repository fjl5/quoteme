"use strict";

// Add quotes
function quoteMe() {
    // Only quote active textarea
    if (document.activeElement.tagName == "TEXTAREA") {
        let textarea = document.activeElement;
        // Get settings
        let gettingItem = browser.storage.sync.get(
            ['quoteStart', 'quoteBlock', 'quoteStopp', 'quoteClean', 'nix']);
        gettingItem.then((res) => {
            let quoteStart = res.quoteStart || ',-------';
            let quoteBlock = res.quoteBlock || '| ';
            let quoteStopp = res.quoteStopp || '`-------';
            let quoteClean = res.quoteClean ;

            // Get text
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
            // We can't do this in a way that preserves the undo buffer
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1220696#c10
            textarea.setRangeText(quoted, first, last);
        });
    } else {
        alert(browser.i18n.getMessage("noTextareaWarning"));
    }
}
