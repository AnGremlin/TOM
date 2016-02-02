class SceneMenuBehavior extends Sup.Behavior {
  
  varNameActor: Sup.Actor;
  varName= "";
  varValue = "";

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
    this.varValue = SceneList.list[this.varName];
  }

  update() {
    var idxChange = false;
    if (Sup.Input.wasKeyJustPressed("N")) {
      Game.closeMenu();
    } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
      idxChange = true;
      this.index = (this.index - 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
      idxChange = true;
      this.index = (this.index + 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RETURN")) {
      Game.cameraBehavior.transitionToScene(this.varValue, "Background");
      Game.closeMenu();
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
      this.varValue = SceneList.list[this.varName];
    }
  }
}
Sup.registerBehavior(SceneMenuBehavior);
