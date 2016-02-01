class CutsceneAfterUseAll extends Sup.Behavior {
  
  roomName = "REPLACE ME"
  neededOverride = -1;
  filterString = ""; 
  triggered = false;
  sceneName = "error";
  
  //when triggered, this value in Game.state will be set to True
  triggerVar = "";
  
  awake() {
    
  }

  start() {
    //initialize if needed
    if (Game.perRoomObjectUseStatus[this.roomName] == null) {
      Game.perRoomObjectUseStatus[this.roomName] = [];
      return;
    }
    
    //get the local and saved items
    var root = Sup.getActor("Scene");
    var roomItems = root.getChildren();
    var savedItems = Game.perRoomObjectUseStatus[this.roomName];
    
    //restore saved values
    roomItems.forEach((child, i) => {
      if(savedItems[child.getName()] != null) {
        child["used"] = savedItems[child.getName()];
      }  
    });
    
    // HACKY BULLSHIT: if this actor's trigger condition has been met after loading,
    // then the actor should have triggered previously and so should NOT trigger again
    var needed = (this.neededOverride == -1 ? 0 : this.neededOverride);
    var used = 0;
    roomItems.forEach((child, i) => {
      
      if(this.filterString == "" || child.getName().indexOf(this.filterString) != -1) {
        
        //check if this child is an item
        if(this.neededOverride == -1) {
          if(child["actionBehavior"] != null) {
            needed++;
          }
        }
        
        //check if used
        if(child["used"] != null) {
          Game.perRoomObjectUseStatus[this.roomName][child.getName()] = child["used"];
          if(child["used"]) {
            used++;
          } 
        }
        
      } else {
        //continue
      }
    });
    
    if(used == needed) {
      this.trigger();
    }
  }

  update() {
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
          Game.perRoomObjectUseStatus[this.roomName][child.getName()] = child["used"];
          if(child["used"]) {
            used++;
          } 
        }
        
      } else {
        //continue
      }
    });
    
    if(used == needed) {
      this.trigger();
    }
  }

  trigger() {
    this.triggered = true;
    Cutscene.loadScript(this.sceneName);
  }
}
Sup.registerBehavior(CutsceneAfterUseAll);
