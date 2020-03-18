zip -r -FS quoteme-firefox.zip *.json *.html *.css *.js icons/ _locales/

# Create Chrome version
cp -a manifest.json manifest.json.bak
sed -i '/^    "applications": {/,/^    }/ d' manifest.json
sed -i -e 's/browser_style/chrome_style/' -e 's/\[Ctrl\]+\[E\]/[Ctrl]+[Shift]+[E]/' -e 's/Ctrl+E/Ctrl+Shift+E/' manifest.json
zip -r -FS quoteme-chrome.zip *.json *.html *.css *.js icons/ _locales/

mv manifest.json.bak manifest.json
