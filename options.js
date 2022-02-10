window.addEventListener('load',async function(){
    var autoAd = await getLocalStorage("ad")
    if(autoAd){
        var select = document.getElementById("autoad")
        for(var i = 0;i<select.children.length;i++){
            var child = select.children[i]
            if(child.value == autoAd){
                child.selected = "true"
                break;
            }
        }
    }

    var adTime = await getLocalStorage("adTime")
    if(adTime){
        var input = document.getElementById("interval")
        input.value = adTime
    }
})
window.addEventListener('load',function(){

    document.getElementById("autoad").addEventListener('change',function(){
        var select = document.getElementById("autoad")
        chrome.storage.local.set({"ad":select.children[select.selectedIndex].value},function(){})
    })
    
    document.getElementById("interval").addEventListener('change',function(){
        var input = document.getElementById("interval").value
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