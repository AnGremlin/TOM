class StateMenuBehavior extends Sup.Behavior {
  
  varNameActor: Sup.Actor;
  varValueActor: Sup.Actor;
  varName= "";
  varValue = false;

  index = 0;
  stateLen = 0;
  
  start() {
    this.varNameActor = this.actor.getChild("VarName");
    this.varValueActor = this.actor.getChild("VarValue");
    
    var idx = 0;
    var found = false;
    for(var key in Game.state)
    {
      if (idx == this.index) {
        found = true;
        this.varName = key;
      } 
      idx++;
    }
    
    this.stateLen = idx;
    this.varNameActor.textRenderer.setText(this.varName);
    this.varValueActor.textRenderer.setText(Game.state[this.varName] ? "TRUE" : "FALSE");
    this.varValue = Game.state[this.varName];
  }

  update() {
    var idxChange = false;
    if (Sup.Input.wasKeyJustPressed(GameConfig.closeDebugKey)) {
      Game.closeMenu();
    } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
      idxChange = true;
      this.index = (this.index - 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
      idxChange = true;
      this.index = (this.index + 1) % this.stateLen;
    } else if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      this.varValue = !this.varValue;
      this.varValueActor.textRenderer.setText(this.varValue ? "TRUE" : "FALSE");
      Game.state[this.varName] = this.varValue;
    }
    
    if(idxChange)
    {
      var idx = 0;
      var key = "";
      for(key in Game.state)
      {
        if (idx == this.index) {
          this.varName = key;
          break;
        }
        idx++;
      }

      this.varNameActor.textRenderer.setText(this.varName);
      this.varValueActor.textRenderer.setText(Game.state[this.varName] ? "TRUE" : "FALSE");
      this.varValue = Game.state[this.varName];
    }
  }
}
Sup.registerBehavior(StateMenuBehavior);
