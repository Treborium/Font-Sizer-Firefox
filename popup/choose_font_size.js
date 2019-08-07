/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        /**
         * Removes the 'px' suffix of the available buttons
         */
        function removePxSuffix(text) {
            return text.slice(0, -2);
        }

        /**
         * Insert the page-hiding CSS into the active tab,
         * then get the beast URL and
         */
        function changeFont(tabs) {
            let fontSize = removePxSuffix(e.target.textContent);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "change-font",
                size: fontSize,
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
            .then(changeFont)
            .catch(reportError);
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute change_font content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
console.error("Please just work!");

browser.tabs.executeScript({ file: "/content_scripts/change_font_size.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);