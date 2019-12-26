/**
 * This script loads when the popup was loaded
 */

(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        browser.runtime.sendMessage({"command": "get", "key": "currentTagName"})
            .then((response) => {
                browser.runtime.sendMessage({"command": "change-element", "tagName": response.value});
            }, null);
        return;
    }
    window.hasRun = true;

    // By default only paragraphs are effected by the change
    let affectedElements = document.querySelectorAll("p");
    sendMessage({"command": "update", "key": "currentTagName", "value": "p"});
    
    function sendMessage(msg) {
        console.info(`Sending message with content: `, msg);
        browser.runtime.sendMessage(msg);
    }

    function changeFontSize(size) {
        console.info(`Changing the font to "${size}"`);
        for (let element of affectedElements) {
            element.style.fontSize = size;
        }
    }

    function pickElement() {
        function getElementUnderMouse(mouseEvent) {
            tagName = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY).tagName;
            affectedElements = document.querySelectorAll(tagName);

            sendMessage({"command": "update", "key": "currentTagName", "value": tagName});

            // unregister listener to prevent triggering this function multiple times
            document.removeEventListener('click', this);
            document.documentElement.style.cursor = "";  // Reset mouse cursor style
        }

        document.addEventListener('click', getElementUnderMouse);
        document.documentElement.style.cursor = "crosshair";
    }


    /**
     * Listen for messages from the background script or popup.
     */
    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case "change-font": 
                changeFontSize(message.textContent);
                break;
            case "pick-element":
                pickElement();
                break;
            default:
                console.error(`Undefined command: "${message.command}"`);
        }
    });

})();