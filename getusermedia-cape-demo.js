Polymer({
  
  is: "getusermedia-cape-demo",
  
  behaviors: [GetUserMediaBehaviors.Video],
  
  _streamActivated: function(id, stream, url){
    
    this.$.video.src = url;
    
  },
  
  setSource: function(e){
    
    this.selectedSourceId = e.target.value;
    
  },
  
  setResolution: function(e){
    
    this.resolution = e.target.value;
    
  },
  
  setAspectRatio: function(e){
    
    this.aspectRatio = e.target.value;
    
  },
  
  setAutoReconfigure: function(e){
    
    this.autoReconfigure = e.target.checked;
    
  }
  
});