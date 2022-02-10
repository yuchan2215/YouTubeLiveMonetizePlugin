window.addEventListener('load',async function(){
    const autoAd = await getLocalStorage("ad");
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

    const adTime = await getLocalStorage("adTime");
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
    
    document.getElementById("interval").addEventListener('change',function(){
        const input = document.getElementById("interval").value;
        chrome.storage.local.set({"adTime":input},function(){})
    })

})

async function getLocalStorage(text){
    return await new Promise(function(resolve){
        chrome.storage.local.get(text,function(result){
            resolve(result[text])
        });
    });
}