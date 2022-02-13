window.addEventListener('load', async function () {
    const autoAd = await getLocalStorage("ad", "false");
    setInputValue("autoad", autoAd)

    const endClose = await getLocalStorage("endclose", "false");
    setInputValue("endclose", endClose)

    const adTime = await getLocalStorage("adTime", "60");
    setInputValue("interval", adTime)

})

window.addEventListener('load', function () {

    document.getElementById("autoad").addEventListener('change', function () {
        const selected = getInputValue("autoad")
        setLocalStorage("ad", selected)
    })
    document.getElementById("endclose").addEventListener('change', function () {
        const selected = getInputValue("endclose")
        setLocalStorage("endclose", selected)
    })

    document.getElementById("interval").addEventListener('change', function () {
        const input = getInputValue("interval")
        setLocalStorage("adTime", input)
    })

})

function setInputValue(key, value) {
    $(`input[name=${key}]`).val([value])
}

function getInputValue(key) {
    return $(`input[name=${key}]`).val()
}

async function getLocalStorage(text, def) {
    return await new Promise(function (resolve) {
        chrome.storage.local.get(text, function (result) {
            if (result[text])
                resolve(result[text])
            else
                resolve(def)
        });
    });
}

function setLocalStorage(key, value) {
    chrome.storage.local.set({[key]: value}, function () {
    })
}