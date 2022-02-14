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

console.log("Loading...")
//Chrome開始時にスクリプトを読み込む
chrome.runtime.onStartup.addListener(function(){
    console.log("Hello")
})

/**
 * 1日に9750Quotasを利用できると仮定して、何秒間隔でAPIを利用できるかを確認します。
 * @returns {number} 間隔
 */
function getRate(){
    const daySecs = 60*60*24
    const apiQuota = 9750
    const usingAPIs = 1 + checkList.length - checkedList.length
    return Math.ceil(daySecs / (apiQuota / usingAPIs))
}

let time = 1

//不具合防止にintervalを消す
for(let i = 0;i<5;i++){
    clearInterval(i)
}

//CheckList
let checkList = []
let checkedList = []

setInterval(async function () {
    time--
    //タイマーが0でないなら何もしない
    if(time > 0)return

    //タイマーの再設定

    const apiKey = await getLocalStorage("apiKey","")
    const channelId = await getLocalStorage("apiChannel","")

    //APIのタイミングを取得
    let timing = (await getLocalStorage("apiTiming","")).split(",")
    if(timing.length === 1 && timing[0] === "") timing = []

    if(apiKey.length === 0 || channelId.length === 0 || timing.length === 0)return

    const playListId = channelId.replace("UC","UU")



    const videoId = await getLatestVideoId()
    if(!checkList.includes(videoId)){
        checkList.push(videoId)
        console.log("CheckListに追加しました:" + videoId)
    }

    time = getRate()
    console.log(`次の間隔：${time}`)

    for(const id of checkList.filter(n => !checkedList.includes(n))){
        const status = await getVideoStatus(id)
        //ビデオか不明ならなにもしない
        if(status === VideoStatus.Unknown || status === VideoStatus.Video){
            console.log(`${id}はライブではありませんでした`)
            checkedList.push(id)
            return
        }
        const timing = (await getLocalStorage("apiTiming","")).split(",")

        if(status === VideoStatus.PreStreaming && timing.includes("reserve")){
            console.log(`${id}は予約状態です！！`)
            checkedList.push(id)
            openVideo(id)
            return
        }else if(status === VideoStatus.Streaming && (timing.includes("start") || timing.includes("reserve"))){
            console.log(`${id}は放送状態です！！`)
            checkedList.push(id)
            openVideo(id)
            return
        }
    }
},1000)

function openVideo(id){
    //TODO
}

/**
 * 最後に投稿した動画のビデオIDを取得します。
 * @returns {Promise<String>} VideoId
 */
async function getLatestVideoId(){
    const apiKey = await getLocalStorage("apiKey","")
    const playListId = (await getLocalStorage("apiChannel","")).replace("UC","UU")
    const fet = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playListId}&part=contentDetails&maxResults=1`,{
            method: "GET",
            mode: "cors",
            cache: "no-cache"
    })
    if(!fet.ok){
        console.error("Error")
        return undefined
    }
    const txt = await fet.text()
    return JSON.parse(txt)["items"][0]["contentDetails"]["videoId"]
}
const VideoStatus = {
    Unknown : 0,
    Video : 1,
    PreStreaming : 2,
    Streaming : 3
}
async function getVideoStatus(videoId){
    const apiKey = await getLocalStorage("apiKey","")
    const fet = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=liveStreamingDetails&id=${videoId}`,{
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    })
    if(!fet.ok){
        console.error("Error")
        return undefined
    }
    const txt = await fet.text()
    const json = JSON.parse(txt)
    if(!json["items"][0])
        return VideoStatus.Unknown
    const item = json["items"][0]
    const details = item["liveStreamingDetails"]
    if(!details || details["actualEndTime"])
        return VideoStatus.Video
    if(details["actualStartTime"])
        return VideoStatus.Streaming
    if(details["scheduledStartTime"])
        return VideoStatus.PreStreaming
    return VideoStatus.Unknown

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