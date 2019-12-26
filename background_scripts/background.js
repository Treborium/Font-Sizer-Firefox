let globalState = {
    'currentTagName': 'p'
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case 'update': 
            globalState[message.key] = message.value;
            break;
        case 'get':
            sendResponse({'value': globalState[message.key]});
            break;
        default:
            console.error(`Undefined command: "${message.command}"`);
    }
});
