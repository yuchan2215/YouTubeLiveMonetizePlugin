window.addEventListener('load', async function () {
    const autoAd = await getLocalStorage("ad", "false");
    setInputValue("ad-enable", autoAd,true)

    const endClose = await getLocalStorage("endclose", "false");
    setInputValue("close-enable", endClose,true)

    const adTime = await getLocalStorage("adTime", "60");
    setInputValue("interval-value", adTime)

    const maxAdTime = await getLocalStorage("maxAdTime","0")
    setInputValue("interval-max-value",maxAdTime)

    const apiKey = await getLocalStorage("apiKey","")
    setInputValue("api-key",apiKey)

    const apiTime = await getLocalStorage("apiTime","")
    setInputValue("api-time-value",apiTime)

    const apiChannel = await getLocalStorage("apiChannel","")
    setInputValue("api-channel-value",apiChannel)

    const apiTiming = await getLocalStorage("apiTiming","")
    setInputValue("api-timing",apiTiming.split(","))

})

window.addEventListener('load', function () {
    setInputListener("ad-enable","ad",":checked")
    setInputListener("close-enable","endclose",":checked")
    setInputListener("interval-value","adTime")
    setInputListener("interval-max-value","maxAdTime")
    setInputListener("api-key","apiKey")
    setInputListener("api-time-value","apiTime")
    setInputListener("api-channel-value","apiChannel")
    document.getElementById("api-timing").addEventListener('change',function(){
        const timings = []
        $('input[name=api-timing]:checked').each(function(){
            timings.push($(this).val())
        })
        setLocalStorage("apiTiming",timings.join(","))
    })

})
function setInputListener(divId,storageName,option = ""){
    document.getElementById(divId).addEventListener('change',function(){
        const input = $(`input[name=${divId}]${option}`).val()
        setLocalStorage(storageName,input)
    })
}

function setInputValue(key, value,arr = false) {
    $(`input[name=${key}]`).val(arr? [value] : value)
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