"use strict";
(function() {
    // Only need to run once
    if (window.quoteMeHasRun) {
        return;
    }
    window.quoteMeHasRun = true;

    // Add block quotes
    function addBlockQuotes(res) {
        let quoteStart = res.quoteStart;
        let quoteBlock = res.quoteBlock;
        let quoteStopp = res.quoteStopp;
        let quoteClean = res.quoteClean;

        // Get text
        let textfield = document.activeElement;
        let first  = textfield.selectionStart;
        let last   = textfield.selectionEnd;
        let text   = textfield.value;
        let before = text.substring(0, first);
        let after  = text.substring(last);

        // Set "first" to beginning of first line
        first -= before.split("\n").pop().length;
        textfield.selectionStart = first;
        before = text.substring(0, first);

        // Set "last" to end of last line
        last += after.split("\n")[0].length;
        textfield.selectionEnd = last;
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
        if (!document.execCommand("insertText", false, quoted)) {
            textfield.setRangeText(quoted, first, last);
        }
    }

    // Add inline quotes
    function addInlineQuotes(res) {
        let quotePrev = res.quotePrev;
        let quotePost = res.quotePost;

        // Get text
        let textfield = document.activeElement;
        let first  = textfield.selectionStart;
        let last   = textfield.selectionEnd;
        let text   = textfield.value;
        let before = text.substring(0, first);
        let after  = text.substring(last);

        // Select word if nothing is selected
        if (first === last) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape#unicode_property_escapes_vs._character_classes
            let wordStartBefore = before.search(/\p{Letter}+$/gu);
            if (wordStartBefore >= 0 && wordStartBefore < first) {
                first = wordStartBefore;
            }
            let wordAfter = after.match(/^\p{Letter}+/gu);
            if (wordAfter) {
                last += wordAfter[0].length;
            }
        }

        // Create quoted text
        var quoted = quotePrev + text.substring(first, last) + quotePost;

        // Insert quotes
        // In Firefox < 89 we can't do this in a way that preserves the undo buffer
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1220696#c10
        // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/89
        textfield.selectionStart = first;
        textfield.selectionEnd = last;
        if (!document.execCommand("insertText", false, quoted)) {
            textfield.setRangeText(quoted, first, last);
        }
    }

    // Start adding block quotes
    // Only quote active textarea
    function quoteBlock() {
        if (document.activeElement.tagName === "TEXTAREA") {
            // Get settings
            if (typeof(browser) === "undefined") {
                // Chrome extension
                chrome.storage.sync.get(
                    {
                        quoteStart: ",-------",
                        quoteBlock: "| ",
                        quoteStopp: "`-------",
                        quoteClean: true
                    },
                    addBlockQuotes);
            } else {
                // Firefox extension
                browser.storage.sync.get({
                    quoteStart: ",-------",
                    quoteBlock: "| ",
                    quoteStopp: "`-------",
                    quoteClean: true
                }).then(addBlockQuotes);
            }
        } else if (document.activeElement.tagName !== "IFRAME") {
            if (typeof(browser) === "undefined") {
                // Chrome extension
                alert(chrome.i18n.getMessage("noTextareaWarning"));
            } else {
                // Firefox extension
                alert(browser.i18n.getMessage("noTextareaWarning"));
            }
        }
    }

    // Start adding inline quotes
    // Only quote active textarea and text input fields plus search input fields.
    function quoteInline() {
        let valid = ["textarea", "text", "search"];
        if (valid.indexOf(document.activeElement.type) >= 0)
        {
            // Get settings
            if (typeof(browser) === "undefined") {
                // Chrome extension
                chrome.storage.sync.get(
                    {
                        quotePrev: "“",
                        quotePost: "”"
                    },
                    addInlineQuotes);
            } else {
                // Firefox extension
                browser.storage.sync.get({
                    quotePrev: "“",
                    quotePost: "”"
                }).then(addInlineQuotes);
            }
        } else if (document.activeElement.tagName !== "IFRAME") {
            if (typeof(browser) === "undefined") {
                // Chrome extension
                alert(chrome.i18n.getMessage("noTextInputWarning"));
            } else {
                // Firefox extension
                alert(browser.i18n.getMessage("noTextInputWarning"));
            }
        }
    }

    function handleCommand(command, defaultAction) {
        if (command === "default") {
            command = defaultAction;
        } else if (command === "alternative") {
            command = defaultAction === "quote_inline" ? "quote_block" : "quote_inline"
        }

        if (command === "quote_block") {
            quoteBlock();
        } else if (command === "quote_inline") {
            quoteInline();
        }
    }

    // Listen for messages from the background script.
    if (typeof(browser) === "undefined") {
        // Chrome extension
        chrome.runtime.onMessage.addListener(function(message) {
            chrome.storage.sync.get(
                {defaultAction: "quote_block"},
                function(res) {
                    handleCommand(message.command, res.defaultAction);
                }
            );
        });
    } else {
        browser.runtime.onMessage.addListener(function(message) {
            browser.storage.sync.get(
                {defaultAction: "quote_block"}
            ).then(function (res) {
                handleCommand(message.command, res.defaultAction);
            });
        });
    }

})();
