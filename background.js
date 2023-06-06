"use strict";

var haveChrome = false;

if (typeof(browser) === "undefined") {
    // Chrome compatibility
    var browser = chrome;
    haveChrome = true;
}

// Run the quoteMe function in content.js
async function runQuoteMe(tab, command) {
    await browser.scripting.executeScript({
        target: {
            tabId: tab.id,
            allFrames: true,
        },
        files: ["content.js"],
    });
    browser.tabs.query({active: true, currentWindow: true}).then(
        function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {command: command});
        }
    );
}

// Handle toolbar button press
if (haveChrome) {
    // Chrome has no onClickData attribute here
    browser.action.onClicked.addListener(function(tab) {
        runQuoteMe(tab, "default");
    });
} else {
    // Firefox has onClickData which allows to detect modifier keys
    browser.action.onClicked.addListener(function(tab, onClickData) {
        if (onClickData.modifiers.indexOf('Shift') >= 0) {
            runQuoteMe(tab, "alternative");
        } else {
            runQuoteMe(tab, "default");
        }
    });
}

// Handle keyboard shortcut
browser.commands.onCommand.addListener(function(command, tab) {
    if (tab) {
        runQuoteMe(tab, command);
    } else {
        browser.tabs.query({active: true}).then(function(tab) {
            runQuoteMe(tab[0], command);
        });
    }
});

// Add context menue to editable fields
browser.contextMenus.create({
    id: "quote_block",
    title: browser.i18n.getMessage("contextMenuEntryBlock"),
    contexts: ["editable", "action"]
});
browser.contextMenus.create({
    id: "quote_inline",
    title: browser.i18n.getMessage("contextMenuEntryInline"),
    contexts: ["editable", "action"]
});
browser.contextMenus.create({
    id: "quote_settings",
    title: browser.i18n.getMessage("settings"),
    contexts: ["editable"]
});


// Handle editable fields' context menue
browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "quote_block") {
        runQuoteMe(tab, "quote_block");
    }
    else if (info.menuItemId == "quote_inline") {
        runQuoteMe(tab, "quote_inline");
    }
    else if (info.menuItemId == "quote_settings") {
        browser.runtime.openOptionsPage();
    }
});
