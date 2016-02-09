class SceneMenuBehavior extends Sup.Behavior {
  
  varNameActor: Sup.Actor;
  varName= "";

  index = 0;
  stateLen = 0;
  
  start() {
    this.varNameActor = this.actor.getChild("VarName");
    
    var idx = 0;
    var found = false;
    for(var key in SceneList.list)
    {
      if (idx == this.index) {
        found = true;
        this.varName = key;
      } 
      idx++;
    }
    
    this.stateLen = idx;
    this.varNameActor.textRenderer.setText(this.varName);
  }

  update() {
    var idxChange = false;
    if (Sup.Input.wasKeyJustPressed(GameConfig.closeDebugKey)) {
      TomE.closeMenu();
    } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
      idxChange = true;
      this.index = (this.index - 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
      idxChange = true;
      this.index = (this.index + 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      TomE.cameraBehavior.transitionToScene(this.varName);
      TomE.closeMenu();
    }
    
    if(idxChange)
    {
      var idx = 0;
      var key = "";
      for(key in SceneList.list)
      {
        if (idx == this.index) {
          this.varName = key;
          break;
        }
        idx++;
      }

      this.varNameActor.textRenderer.setText(this.varName);
    }
  }
}
Sup.registerBehavior(SceneMenuBehavior);
