window.addEventListener("load", async function () {
    //配信ページでないならなにもしない
    if (!this.location.href.match("^https://studio.youtube.com/video/.+/livestreaming.*$")) return;

    const timeSpace = document.createElement("div");
    timeSpace.id = "YTLIMP_TIME"
    document.getElementsByClassName("left-section style-scope ytls-header")[0].appendChild(timeSpace)

    new Promise(async function () {
        await adRun()
    });
    new Promise(async function () {
        await timeRun()
    })
});

let time = 0;
let normalTime = 0;

//時間ごとに実行するやつ
const adRun = async function () {
    const nextTime = (await getLocalStorage("adTime")) * 1000
    time = nextTime / 1000
    normalTime = time - 20
    setTimeout(function () {
        new Promise(adRun);
    }, nextTime);
    //DO SOMETHING
    await pushLive()
};

//表示をかえるやつ
const timeRun = async function () {
    setTimeout(function () {
        new Promise(timeRun)
    }, 1000)
    time--
    const min = Math.floor(time / 60)
    let sec = time % 60
    if (sec < 10) sec = "0" + sec
    document.getElementById("YTLIMP_TIME").innerText = (min > 0 ? min + ":" : "") + sec
    let query = {
        'font-size': '3em',
        'margin-left': '1em',
        'color': time > normalTime ? 'orange' : 'white'
    }
    $("#YTLIMP_TIME").css(query)

}

async function pushLive() {
    const value = await getLocalStorage("ad");
    if (value === "true") {
        document.getElementById("insert-ad-button").click();
    }
}

async function getLocalStorage(text) {
    return await new Promise(function (resolve) {
        chrome.storage.local.get(text, function (result) {
            resolve(result[text]);
        });
    });
}
