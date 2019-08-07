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
        let paragraphs = document.querySelectorAll("p");
        for (let p of paragraphs) {
            p.style.fontSize = size;
        }
    }


    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "change-font") {
            console.log(`Changing the font to ${message.size}`)
            changeFontSize(message.size);
        }
    });

})();