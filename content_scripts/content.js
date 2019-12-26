/**
 * This script loads when the popup was loaded
 */
(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will only update the current tag and then return
     */
    if (window.hasRun) {
        // Update the currently selected tag in global state to display it in the popup
        browser.runtime.sendMessage({'command': 'get', 'key': 'currentTagName'})  // Get the current value from the global state
            .then(handleResponse, null);  // Update popup
        return;
    }

    const DEFAULT_ELEMENT = 'p';
    window.hasRun = true;

    // By default only paragraphs are effected by the change
    let affectedElements = document.querySelectorAll(DEFAULT_ELEMENT);
    browser.runtime.sendMessage({'command': 'update', 'key': 'currentTagName', 'value': DEFAULT_ELEMENT});
    browser.runtime.sendMessage({'command': 'change-element', 'tagName': DEFAULT_ELEMENT});
    

    function handleResponse(response) {
        // Send popup window a message to display the currently selected element
        browser.runtime.sendMessage({'command': 'change-element', 'tagName': response.value});
    }


    function changeFontSize(size) {
        console.info(`Changing the font to "${size}"`);
        for (let element of affectedElements) {
            element.style.fontSize = size;
        }
    }


    function pickElement() {
        function getElementUnderMouse(mouseEvent) {
            tagName = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY).tagName.toLowerCase();
            affectedElements = document.querySelectorAll(tagName);

            browser.runtime.sendMessage({'command': 'update', 'key': 'currentTagName', 'value': tagName});

            // unregister listener to prevent triggering this function multiple times
            document.removeEventListener('click', this);
            document.documentElement.style.cursor = '';  // Reset mouse cursor style
        }

        document.addEventListener('click', getElementUnderMouse);
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