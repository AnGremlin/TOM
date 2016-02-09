class CutsceneAfterUseAll extends Sup.Behavior {
  
  roomName = "REPLACE ME"
  neededOverride = -1;
  filterString = ""; 
  triggered = false;
  sceneName = "error";
  
  //when triggered, this value in TomE.state will be set to True
  triggerVar = "";
  
  awake() {
    
  }

  start() {
    //initialize if needed
    if (TomE.perRoomObjectUseStatus[this.roomName] == null) {
      TomE.perRoomObjectUseStatus[this.roomName] = [];
      return;
    }
    
    //get the local and saved items
    var root = Sup.getActor("Scene");
    var roomItems = root.getChildren();
    var savedItems = TomE.perRoomObjectUseStatus[this.roomName];
    
    //restore saved values
    roomItems.forEach((child, i) => {
      if(savedItems.indexOf(child.getName()) != -1) {
        child["used"] = true;
      }  
    });
    
    // HACKY BULLSHIT: if this actor's trigger condition has been met after loading,
    // then the actor should have triggered previously and so should NOT trigger again
    this.update(true);
  }

  update(skip = false) {
    if(this.triggered) return;
    
    var root = Sup.getActor("Scene");
    var children = root.getChildren();
    var needed = (this.neededOverride == -1 ? 0 : this.neededOverride);
    var used = 0;
    
    children.forEach((child, i) => {
      
      if(this.filterString == "" || child.getName().indexOf(this.filterString) != -1) {
        
        //check if this child is an item
        if(this.neededOverride == -1) {
          if(child["actionBehavior"] != null) {
            needed++;
          }
        }
        
        //check if used
        if(child["used"] != null) {
          if(child["used"]) {
            used++;
            if(TomE.perRoomObjectUseStatus[this.roomName].indexOf(child.getName()) == -1) {
              TomE.perRoomObjectUseStatus[this.roomName].push(child.getName());
            }
          } 
        }
        
      } else {
        //continue
      }
    });
    
    if(used == needed) {
      if(!skip)this.trigger();
      this.triggered = true;
    }
  }

  trigger() {
    TomE.state[this.triggerVar] = true;
    Cutscene.loadScript(this.sceneName);
  }
}
Sup.registerBehavior(CutsceneAfterUseAll);
