window.addEventListener('load',async function(){
    const autoAd = await getLocalStorage("ad","false");
    if(autoAd){
        const select = document.getElementsByName("autoad");
        for(let i = 0; i<select.length; i++){
            const child = select[i];
            if(child.value === autoAd){
                child.checked = true
                break;
            }
        }
    }
    const endClose = await getLocalStorage("endclose","false");
    if(autoAd){
        const select = document.getElementsByName("endclose");
        for(let i = 0; i<select.length; i++){
            const child = select[i];
            if(child.value === endClose){
                child.checked = true
                break;
            }
        }
    }

    const adTime = await getLocalStorage("adTime","60");
    if(adTime){
        const input = document.getElementById("interval");
        input.value = adTime
    }
})
window.addEventListener('load',function(){

    document.getElementById("autoad").addEventListener('change',function(){
        const select = document.getElementsByName("autoad")
        let selected
        for(let i = 0;i<select.length;i++){
            if(select[i].checked)selected = select[i].value
        }
        chrome.storage.local.set({"ad":selected},function(){})
    })
    document.getElementById("endclose").addEventListener('change',function(){
        const select = document.getElementsByName("endclose")
        let selected
        for(let i = 0;i<select.length;i++){
            if(select[i].checked)selected = select[i].value
        }
        chrome.storage.local.set({"endclose":selected},function(){})
    })

    document.getElementById("interval").addEventListener('change',function(){
        const input = document.getElementById("interval").value;
        chrome.storage.local.set({"adTime":input},function(){})
    })

})

async function getLocalStorage(text,def){
    return await new Promise(function(resolve){
        chrome.storage.local.get(text,function(result){
            if(result[text])
                resolve(result[text])
            else
                resolve(def)
        });
    });
}