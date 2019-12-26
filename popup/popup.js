/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (element) => {
        function sendMessage(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: element.target.className,  // The class of the clicked element is the command identifier
                textContent: element.target.textContent,  // The text content of the element is used for the new font size (i.e. 18px, 20px, etc.)
            });
        }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not change font: ${error}`);
        }

        /**
         * Get the active tab,
         * then call changeFont() or catch the error if something goes wrong.
         */
        browser.tabs.query({ active: true, currentWindow: true })
            .then(sendMessage)
            .catch(reportError);
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    // document.querySelector("#popup-content").classList.add("hidden");
    // document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute change_font content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/change_font_size.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);