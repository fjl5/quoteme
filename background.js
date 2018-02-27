"use strict";

// Run the quoteMe function in content.js
function runQuoteMe() {
    browser.tabs.executeScript({
        code: "quoteMe()",
    });
}

// Handle toolbar button press
browser.browserAction.onClicked.addListener(runQuoteMe);

// Handle keyboard shortcut
browser.commands.onCommand.addListener(function(command) {
    if (command == "quote-text") {
        runQuoteMe();
    }
});
