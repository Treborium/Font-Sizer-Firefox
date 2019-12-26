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
        return;
    }
    window.hasRun = true;

    function changeFontSize(size) {
        console.info(`Changing the font to ${size}`);
        let paragraphs = document.querySelectorAll("p");
        for (let p of paragraphs) {
            p.style.fontSize = size;
        }
    }

    function pickElement() {
        console.log("Picking some element...");
    }


    /**
     * Listen for messages from the background script.
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