# Create FireFox version
sed -e '/ *\/\/CHROME/ d' -e 's: *//FF::' manifest.json | zip -r -FS quoteme-firefox.zip - *.html *.css *.js icons/ _locales/
7z rn quoteme-firefox.zip -- - manifest.json

# Create Chrome version
sed -e '/ *\/\/FF/ d' -e 's://CHROME ::' manifest.json | zip -r -FS quoteme-chrome.zip - *.html *.css *.js icons/ _locales/
7z rn quoteme-chrome.zip -- - manifest.json
