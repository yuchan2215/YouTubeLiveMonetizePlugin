let status = 0 //0 なんでもない 1 ライブ待ち 2 ライブ中 3 ライブ終了 4 カウントダウン
let url = location.href
const REGEXP = "^https://studio.youtube.com/video/.+/livestreaming.*$"
window.addEventListener("load", async function () {
    new Promise(async function () {
        await checkContent()
    })
    urlChangeEvent()

});

let time = 0;
let normalTime = 0;
const checkContent = async function () {
    setTimeout(function () {
        new Promise(checkContent)
    }, 1000)
    if (url.match(REGEXP)) {
        if (!document.getElementById("end-stream-button").hidden) {
            if (status !== 2) {
                console.log("Streaming")
                status = 2
                try {
                    clearInterval(adTimeout)
                } catch (_) {
                }
                try {
                    clearInterval(timeTimeout)
                } catch (_) {
                }
                //定期実行の作成
                new Promise(async function () {
                    await adRun()
                }).then();
                new Promise(async function () {
                    await timeRun()
                }).then()
            }
        } else if (status === 2) {
            status = 3
            clearInterval(adTimeout)
            //配信のタブを閉じるときの処理
            if (await getLocalStorage("endclose", "false") === "true") {

                status = 4
                time = 10
                normalTime = -1
                document.getElementById("YTLIMP_SUB").innerText = "秒でタブを閉じます"
                setTimeout(async function () {
                    await chrome.runtime.sendMessage({msg: "close", title: document.title}, function (response) {
                        console.log(response)
                    })
                }, 10000)

            }
        }
    }
    if (url !== location.href) {
        urlChangeEvent()
        url = location.href
    }
}

let adTimeout
let timeTimeout

//ユーザーが設定した時間ごとに実行するやつ
const adRun = async function () {
    const nextTime = (await getNextTime()) * 1000
    time = nextTime / 1000
    normalTime = time - 20
    adTimeout = setTimeout(function () {
        new Promise(adRun);
    }, nextTime);
    await pushLive()
};

//次の時間を取得
async function getNextTime() {
    const minTime = parseInt(await getLocalStorage("adTime", "60"))
    const maxTime = parseInt(await getLocalStorage("maxAdTime", "0"))
    if (maxTime === 0) return minTime
    return getRandomInt(minTime, maxTime + 1)
}

//https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//表示をかえるやつ
const timeRun = async function () {
    timeTimeout = setTimeout(function () {
        new Promise(timeRun)
    }, 1000)
    time--
    const value = await getLocalStorage("ad", "false");
    if (value === "true" && status !== 3 || status === 4) {
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
    status = 1
    //要素がないなら作成
    if (!document.getElementById("YTLIMP_TIME")) {
        const timeSpace = document.createElement("div");
        timeSpace.id = "YTLIMP_TIME"
        document.getElementsByClassName("left-section style-scope ytls-header")[0].appendChild(timeSpace)
        const subSpace = document.createElement("div");
        subSpace.id = "YTLIMP_SUB"
        document.getElementsByClassName("left-section style-scope ytls-header")[0].appendChild(subSpace)
    }


}

async function pushLive() {
    const value = await getLocalStorage("ad", "false");
    if (value === "true") {
        document.getElementById("insert-ad-button").click();
    }
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
