let status = 0 //0 なんでもない 1 ライブ待ち 2 ライブ中 3 ライブ終了
let url = location.href
const REGEXP = "^https://studio.youtube.com/video/.+/livestreaming.*$"
window.addEventListener("load", async function () {
    new Promise(async function () {
        await checkURL()
    })

});

let time = 0;
let normalTime = 0;
const checkURL = async function () {
    setTimeout(function () {
        new Promise(checkURL)
    }, 1000)

    if (url !== location.href) {
        urlChangeEvent()
        url = location.href
    }
}

let adTimeout
let timeTimeout

//ユーザーが設定した時間ごとに実行するやつ
const adRun = async function () {
    const nextTime = (await getLocalStorage("adTime")) * 1000
    time = nextTime / 1000
    normalTime = time - 20
    adTimeout = setTimeout(function () {
        new Promise(adRun);
    }, nextTime);
    await pushLive()
};

//表示をかえるやつ
const timeRun = async function () {
    timeTimeout = setTimeout(function () {
        new Promise(timeRun)
    }, 1000)
    time--
    const value = await getLocalStorage("ad");
    if (value === "true") {
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
    } else {
        document.getElementById("YTLIMP_TIME").innerText = ""
    }

}

function urlChangeEvent() {
    console.log(location.href)
    //もし配信ページでないなら定期実行をキャンセル
    if (!this.location.href.match(REGEXP)) {
        clearTimeout(adTimeout)
        clearTimeout(timeTimeout)
        return
    }

    //要素がないなら作成
    if (!document.getElementById("YTLIMP_TIME")) {
        const timeSpace = document.createElement("div");
        timeSpace.id = "YTLIMP_TIME"
        document.getElementsByClassName("left-section style-scope ytls-header")[0].appendChild(timeSpace)
    }
    //定期実行の作成
    new Promise(async function () {
        await adRun()
    }).then();
    new Promise(async function () {
        await timeRun()
    }).then()


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
