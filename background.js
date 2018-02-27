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

// Add context menue
browser.contextMenus.create({
    id: "quote-context",
    title: browser.i18n.getMessage("contextMenuEntry"),
    contexts: ["editable"]
});

// Handle context menue
browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "quote-context") {
        runQuoteMe();
    }
})
