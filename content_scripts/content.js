/**
 * This script loads when the popup was loaded
 */
(function () {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will only update the current tag and then return
     */
    if (window.hasRun) {
        // Update the currently selected tag in global state to display it in the popup
        browser.runtime.sendMessage({ 'command': 'get', 'key': 'currentTagName' })  // Get the current value from the global state
            .then(handleResponse, null);  // Update popup
        return;
    }


    function handleResponse(response) {
        // Send popup a message to display the currently selected element
        browser.runtime.sendMessage({ 'command': 'change-element', 'tagName': response.value });
    }


    window.hasRun = true;
    // By default only paragraphs are effected by the change
    const DEFAULT_ELEMENT = 'p';

    let affectedElements = document.querySelectorAll(DEFAULT_ELEMENT);
    browser.runtime.sendMessage({ 'command': 'update', 'key': 'currentTagName', 'value': DEFAULT_ELEMENT });
    browser.runtime.sendMessage({ 'command': 'change-element', 'tagName': DEFAULT_ELEMENT });


    function changeFontSize(size) {
        console.info(`Changing the font to "${size}"`);
        for (let element of affectedElements) {
            element.style.fontSize = size;
        }
    }


    function pickElement() {
        function getElementUnderMouse(mouseEvent) {
            element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
            tagName = element.tagName.toLowerCase();
            affectedElements = document.querySelectorAll(tagName);

            browser.runtime.sendMessage({ 'command': 'update', 'key': 'currentTagName', 'value': tagName });

            removeEventListeners();
            element.style.outline = "";
        }

        function abortOnEscape(keyEvent) {
            if (keyEvent.key === "Escape") {
                removeEventListeners();
            }
        }

        function highlightCurrentElement(event) {
            event.target.style.outline = "2px solid #CC6666";
        }

        function resetBorder(event) {
            event.target.style.outline = "";
        }

        function removeEventListeners() {
            // unregister listeners to prevent them from triggering multiple times
            document.removeEventListener('click', getElementUnderMouse);
            document.removeEventListener('keydown', abortOnEscape);
            document.removeEventListener('mouseover', highlightCurrentElement);
            document.documentElement.style.cursor = '';  // Reset mouse cursor style
        }

        browser.runtime.sendMessage({ 'command': 'close-window' });  // Tell the popup to close itself

        document.addEventListener('click', getElementUnderMouse);
        document.addEventListener('keydown', abortOnEscape);
        document.addEventListener('mouseover', highlightCurrentElement);

        // Do NOT remove this event listener. 
        // This prevents borders from not being removed properly
        // e.g. when the picking process is cancelled via ESC
        document.addEventListener('mouseout', resetBorder);
        document.documentElement.style.cursor = 'crosshair';
    }


    /**
     * Listen for messages from the background script or popup.
     */
    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case 'change-font':
                changeFontSize(message.textContent);
                break;
            case 'pick-element':
                pickElement();
                break;
            default:
                console.error(`Undefined command: "${message.command}"`);
        }
    });
})();