window.GetUserMediaBehaviors = window.GetUserMediaBehaviors || {};

GetUserMediaBehaviors.Controller = [{
  
  properties: {
    sources: {
      type: Array,
      value: function(){return [];},
      notify: true
    },
    selectedSourceId: {
      type: String,
      value: "",
      notify: true
    },
    acitveStream: Object,
    activeStreamURL: {
      type: String,
      value: "",
      notify: true
    },
    autoReconfigure: {
      type: Boolean,
      value: false,
      notify: true
    }
  },
  
  observers: [
    "_reconfigure(selectedSourceId)"
  ],
  
  ready: function(){
    
    this._updateSources();
    
  },
  
  activateStream: function(){
    
    if(!this.activeStream || !this.activeStream.active){
      
      navigator.webkitGetUserMedia(this._getStreamConstraints(),
                                   this._initStream.bind(this),
                                   this._streamEnded.bind(this));
      
    }
    
  },
  
  deactivateStream: function(reconfigure){
    
    console.log(this.selectedSourceId);
    
    if(this.activeStream.active){
      
      var tracks = this.activeStream.getTracks();
      
      for(var i = 0; i != tracks.length; i++){
        
        tracks[i].stop();
        
      }
      
      this.activeStreamURL = null;
      
    }
    
    if(this.autoReconfigure){
      
      this.activateStream();
      
    }
    
  },
  
  _getStreamConstraints: function(){},
  
  _reconfigure: function(){
    
    if(this.autoReconfigure){
      
      if(this.activeStream){
        
        this.deactivateStream();
        
      }
      
      else{
        
        this.activateStream();
        
      }
      
    }
    
  },
  
  _updateSources: function(){

    MediaStreamTrack.getSources(function(sources){
      
      var newSources = [];
      
      for(var i = 0; i != sources.length; i++){
        
        if(this._validateSource(sources[i])){
          
          newSources.push({
            type: sources[i].kind,
            id: sources[i].id,
            label: sources[i].label || "Unamed Source"
          });
          
        }
        
      }
      
      if(newSources.length != this.sources.length){
        
        this.sources = newSources;
        
      }
      
      if(!this.activeStream && this.autoStart && this.sources.length > 0){
        
        this.selectedSourceId = this.sources[0].id;
        
        this.activateStream();
        
      }
      
      this.debounce("update sources", this._updateSources, 500);
      
    }.bind(this));
    
  },
  
  _validateSource: function(source){},

  _initStream: function(stream){

    this.activeStream = stream;

    this.activeStreamURL = URL.createObjectURL(this.activeStream);
    
    this._streamActivated(this.selectedSourceId, this.activeStream, this.activeStreamURL);

  },

  _streamEnded: function(){
    
    this.cancelDebouncer("update sources");
    
    this.activeStream = null;
    
    this.activeStreamURL = "";
    
    this._updateSources();

  },
  
  _streamActivated: function(id, stream, url){}
  
}];

GetUserMediaBehaviors.Audio = [GetUserMediaBehaviors.Controller, {
  
  _getStreamConstraints: function(){

    return {
      video: null,
      audio: true
    };
    
  },
  
  _validateSource: function(source){
    
    return source.kind == "audio";
    
  }
  
}];

GetUserMediaBehaviors.Video = [GetUserMediaBehaviors.Controller, {
  
  properties: {
    resolution: {
      type: String,
      value: "HD"
    },
    aspectRatio: {
      type: String,
      value: "16:9"
    },
    _resolutions: {
      type: Object,
      value: function(){
        
        return {
          "16:9": {
            widths:{FHD: 1920, HD: 1280, SD: 640, VGA: 320, QVGA: 160},
            heights:{FHD: 1080, HD: 720, SD: 360, VGA: 180, QVGA: 90},
          },
          "3:2": {
            widths:{FHD: 1920, HD: 1280, SD: 640, VGA: 320, QVGA: 160},
            heights:{FHD: 1280, HD: 853, SD: 427, VGA: 213, QVGA: 107},
          },
          "4:3": {
            widths:{FHD: 1920, HD: 1280, SD: 640, VGA: 320, QVGA: 160},
            heights:{FHD: 1440, HD: 960, SD: 480, VGA: 240, QVGA: 120},
          },
          "1:1": {
            widths:{FHD: 1920, HD: 1280, SD: 640, VGA: 320, QVGA: 160},
            heights:{FHD: 1920, HD: 1280, SD: 640, VGA: 320, QVGA: 160},
          }
        };
        
      }
    }
  },
  
  observers: [
    "_reconfigure(resolution, aspectRatio)"
  ],
  
  _getStreamConstraints: function(){

    var video = {
      optional: [{sourceId: this.selectedSourceId}],
      mandatory: {
        minWidth: this._resolutions[this.aspectRatio].widths[this.resolution],
        minHeight: this._resolutions[this.aspectRatio].heights[this.resolution],
        maxWidth: this._resolutions[this.aspectRatio].widths[this.resolution],
        maxHeight: this._resolutions[this.aspectRatio].heights[this.resolution]
      }
    };

    return {
      video: video,
      audio: null
    };
    
  },
  
  _validateSource: function(source){
    
    return source.kind == "video";
    
  }
  
}];