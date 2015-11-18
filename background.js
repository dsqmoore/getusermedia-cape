chrome.app.runtime.onLaunched.addListener(function(){
  
  chrome.app.window.create("getusermedia-cape-video-demo.html", {id: "video"});
  
  chrome.app.window.create("getusermedia-cape-audio-demo.html", {id: "audio"});
  
});