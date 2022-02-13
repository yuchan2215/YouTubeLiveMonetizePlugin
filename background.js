chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.msg === "close") {
        chrome.tabs.query({title: message.title}, function (result) {
            for (let i = 0; i < result.length; i++) {
                chrome.tabs.remove(result[i].id).then()
            }
        })
    }
    return true
})
