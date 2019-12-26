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

    window.hasRun = true;
    // By default only paragraphs are effected by the change
    const DEFAULT_ELEMENT = 'p';

    let affectedElements = document.querySelectorAll(DEFAULT_ELEMENT);
    browser.runtime.sendMessage({ 'command': 'update', 'key': 'currentTagName', 'value': DEFAULT_ELEMENT });
    browser.runtime.sendMessage({ 'command': 'change-element', 'tagName': DEFAULT_ELEMENT });


    function handleResponse(response) {
        // Send popup window a message to display the currently selected element
        browser.runtime.sendMessage({ 'command': 'change-element', 'tagName': response.value });
    }


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
            document.removeEventListener('keypress', abortOnEscape);
            document.removeEventListener('mouseover', highlightCurrentElement);
            document.removeEventListener('mouseout', resetBorder);
            document.documentElement.style.cursor = '';  // Reset mouse cursor style
        }

        document.addEventListener('click', getElementUnderMouse);
        document.addEventListener('keypress', abortOnEscape);
        document.addEventListener('mouseover', highlightCurrentElement);
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