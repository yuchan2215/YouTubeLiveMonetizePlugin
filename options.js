window.addEventListener('load',async function(){
    const autoAd = await getLocalStorage("ad");
    if(autoAd){
        const select = document.getElementById("autoad");
        for(let i = 0; i<select.children.length; i++){
            const child = select.children[i];
            if(child.value === autoAd){
                child.selected = "true"
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
        const select = document.getElementById("autoad");
        chrome.storage.local.set({"ad":select.children[select.selectedIndex].value},function(){})
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