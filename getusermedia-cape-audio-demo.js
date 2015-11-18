Polymer({
  
  is: "getusermedia-cape-audio-demo",
  
  behaviors: [GetUserMediaBehaviors.Audio],
  
  _streamActivated: function(id, stream, url){
    
    this.$.audio.src = url;
    
  },
  
  setSource: function(e){
    
    this.selectedSourceId = e.target.value;
    
  },
  
  setAutoReconfigure: function(e){
    
    this.autoReconfigure = e.target.checked;
    
  }
  
});