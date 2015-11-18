chrome.app.runtime.onLaunched.addListener(function(){
  
  chrome.app.window.create("getusermedia-cape-demo.html", {id: "main"});
  
});