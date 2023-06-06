# QuoteMe for Firefox and Chrome (and possibly other browsers)

This browser extensions adds both a toolbar button and two keyboard shortcuts
to either add quotation marks around lines of text in a multiline text field
(`<textarea>`) of any web page, or add regular quotes around some text in
any text or input field. It implements the WebExtensions API, Manifest v3.

The typical use cases of block quotes are text comments or bug reports
which do not support html, markdown or other means of formatting text.
If you want to visually separate your own comments from citations or code
segments, you typically want to add a visual marker, like `-------`. This
add on simplifies adding those markers. The type of markers is configurable:
you can choose from a predefined list of markers or enter your own.

Inserting regular quotes, on the other hand, is a means of adding
typographically correct quotation marks. Again, the type of quotes is
configurable: you can choose from a predefined list of quotes in several
languages or enter your own preferences.

## Usage

### Block quotes

* Set the focus (text cursor) in a multiline text field (`<textarea>`) of
  any web page)
* Select the lines you want to quote. If you only want to quote a single
  line, you don't need to mark any text, just set the cursor to any position
  within this line. In case you want to mark several lines, just select
  (highlight) the text range. The start and end of the selection can be on
  any position within the first and last line - no need to select full lines.
* Now press Ctrl+E (on Chrome: Alt+B) or click the QuoteMe icon
  ![QuoteMe](icons/quote-16.png "QuoteMe icon") in the toolbar.

Before:

    This add-on is GPL licensed:
      The GNU General Public License is a free, copyleft license for
    software and other kinds of works.
    According to FSF, this license is used by more than half of all
    free software packages.

After:

    This add-on is GPL licensed:
    ,-------
    |   The GNU General Public License is a free, copyleft license for
    | software and other kinds of works.
    `-------
    According to FSF, this license is used by more than half of all
    free software packages.

### Regular text quotes

* Set the focus (text cursor) in a text field (`<input>` or `<textarea>`)
  of any web page.
* Select the text range you want to quote. If you only want to quote a single
  word, you don't need to mark any text, just set the cursor to any position
  within this word.
* Now press Alt+M or - if the default action has been configured accordingly -
  click the QuoteMe icon ![QuoteMe](icons/quote-16.png "QuoteMe icon")
  in the toolbar.

Before:

    To be or not to be, she said.

After:

    “To be or not to be”, she said.

## Configuration

Please note that any changes to the configuration only take effect if you
press the "Save" button in the settings page.

### Block quotes

The add-on has a settings page where can select from a range of predefined
marks or enter any characters that should serve as marks. There are three
marks for block quotes:

* Start: This full line is inserted right before the to-be quoted text
* Block: These characters are added to each line of the to-be quoted text
* Stop: This full line inserted right after the to-be quoted text

The default version is the short ASCII as used in the example above;
long ASCII adds more dashes. The Unicode sets use combinations of
[Box-drawing characters](https://en.wikipedia.org/wiki/Box-drawing_character)
while E-Mail adds `> ` to the text block and a literal `Quote` at the start.

There also is an option to remove trailing whitespace on quoted lines.

### Regular text quotes

Regular text quotes have two marks: the opening and closing quote character
at the beginning and the end of the string.
[Quotation marks](https://en.wikipedia.org/wiki/Quotation_mark#Summary_table)
for some western languages are predefined, plus spanish
[Inverted question and exclamation marks](https://en.wikipedia.org/wiki/Inverted_question_and_exclamation_marks).
You can easily enter your own marks.

## Historical note

Firefox 55 changed the behavior of the `<textarea>`: It now nukes the undo
buffer if there are any text changes through JavaScript. The
[Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1220696#c10)
was finally resolved in
[Firefox 89](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/89).
This means that in Firefox from Version 55 up to 88, after adding quotes
through the QuoteMe add-on, you can not undo any previous changes, not even
remove the quotes through Ctrl+Z. Firefox 89 and newer releases work as expected.
Chrome and Chromium were never affected.

Copyright
---------

This add-on is licensed under the terms of GPL v3 by Achim Leitner. The
[icon](https://www.shareicon.net/conversation-quotation-quote-113701)
is GPL'ed as well.
