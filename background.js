"use strict";

if (typeof browser === "undefined") {
    // Chrome compatibility
    var browser = chrome;
}

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

// Add context menue to editable fields
browser.contextMenus.create({
    id: "quote-context",
    title: browser.i18n.getMessage("contextMenuEntry"),
    contexts: ["editable"]
});

// Handle editable fields' context menue
browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "quote-context") {
        runQuoteMe();
    }
});

// Add context menue browser_action icon
browser.contextMenus.create({
    id: "quote-settings",
    title: browser.i18n.getMessage("settings"),
    contexts: ["browser_action"]
});

// Handle browser_action context menue
browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "quote-settings") {
        browser.runtime.openOptionsPage();
    }
});
