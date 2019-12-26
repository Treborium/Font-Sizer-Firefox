let globalState = {
    "currentTagName": "p"
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background got message");
    switch (message.command) {
        case "update": 
            console.log(`Updating global state`);
            globalState[message.key] = message.value;
            break;
        case "get":
            console.log("returning value: ",globalState[message.key]);
            sendResponse({"value": globalState[message.key]});
            break;
        default:
            console.error(`Undefined command: "${message.command}"`);
    }
});
