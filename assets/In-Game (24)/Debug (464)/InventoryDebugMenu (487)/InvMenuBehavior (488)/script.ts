class InvMenuBehavior extends Sup.Behavior {
  
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
    for(var key in Game.inventory)
    {
      if (idx == this.index) {
        found = true;
        this.varName = key;
      } 
      idx++;
    }
    
    this.stateLen = idx;
    this.varNameActor.textRenderer.setText(this.varName);
    this.varValueActor.textRenderer.setText(Game.inventory[this.varName] ? "TRUE" : "FALSE");
    this.varValue = Game.inventory[this.varName];
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
    } else if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      this.varValue = !this.varValue;
      this.varValueActor.textRenderer.setText(this.varValue ? "TRUE" : "FALSE");
      if(this.varValue) {
        Game.getItem(this.varName);
      } else {
        Game.useItem(this.varName);
      }
    }
    
    if(idxChange)
    {
      var idx = 0;
      var key = "";
      for(key in Game.inventory)
      {
        if (idx == this.index) {
          this.varName = key;
          break;
        }
        idx++;
      }

      this.varNameActor.textRenderer.setText(this.varName);
      this.varValueActor.textRenderer.setText(Game.inventory[this.varName] ? "TRUE" : "FALSE");
      this.varValue = Game.inventory[this.varName];
    }
  }
}
Sup.registerBehavior(InvMenuBehavior);
