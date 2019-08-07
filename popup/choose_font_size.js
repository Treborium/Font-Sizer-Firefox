/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        /**
         * Insert the page-hiding CSS into the active tab,
         * then get the beast URL and
         * send a "beastify" message to the content script in the active tab.
         */
        function changeFont(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "change-font",
                size: "18"
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
         * then call "beastify()" or "reset()" as appropriate.
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
    console.error(`Failed to execute font_sizer content script: ${error.message}`);
    alert("Uh Oh, Something bad happened!");
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