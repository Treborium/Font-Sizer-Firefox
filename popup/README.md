# Popup

The popup is the window which displays when the icon in the toolbar is clicked.
A detailed documentation about Firefox popups can be found [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups).

The `popup.js` file is responsible for registering click events and starting a [content script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts).
Every click inside the popup is sent to the content script where it is properly handled.
The popup may also receive messages, for example to display updates of the currently selected HTML tag.

## Handling Messages

Messages inside the popup can *only* be received and therefore handled when the popup is *open*.
Any messages sent by a background or content script while the popup is closed are *lost* from the view of the popup.