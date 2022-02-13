window.addEventListener('load', async function () {
    const autoAd = await getLocalStorage("ad", "false");
    setInputValue("ad-enable", autoAd)

    const endClose = await getLocalStorage("endclose", "false");
    setInputValue("close-enable", endClose)

    const adTime = await getLocalStorage("adTime", "60");
    setInputValue("interval", adTime)

})

window.addEventListener('load', function () {

    document.getElementById("ad-enable").addEventListener('change', function () {
        const selected = $("input[name=ad-enable]:checked").val()
        setLocalStorage("ad", selected)
    })
    document.getElementById("close-enable").addEventListener('change', function () {
        const selected = $("input[name=close-enable]:checked").val()
        setLocalStorage("endclose", selected)
    })

    document.getElementById("interval").addEventListener('change', function () {
        const input = $("input[name=interval]").val()
        setLocalStorage("adTime", input)
    })

})

function setInputValue(key, value) {
    $(`input[name=${key}]`).val([value])
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