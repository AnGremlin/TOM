class CutsceneAfterUseAll extends Sup.Behavior {
  
  neededOverride = -1;
  filterString = ""; 
  triggered = false;
  sceneName = "error";
  
  awake() {
    
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
