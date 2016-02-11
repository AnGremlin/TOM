class StateMenuBehavior extends Sup.Behavior {
  
  varNameActor: Sup.Actor;
  varValueActor: Sup.Actor;
  varName= "";
  varValue: any;

  index = 0;
  stateLen = 0;
  
  start() {
    this.varNameActor = this.actor.getChild("VarName");
    this.varValueActor = this.actor.getChild("VarValue");
    
    var idx = 0;
    var found = false;
    for(var key in TomE.state)
    {
      if (idx == this.index) {
        found = true;
        this.varName = key;
      } 
      idx++;
    }
    
    this.stateLen = idx;
    this.varNameActor.textRenderer.setText(this.varName);
    this.varValueActor.textRenderer.setText(TomE.state[this.varName] ? "TRUE" : "FALSE");
    this.varValue = TomE.state[this.varName];
  }

  update() {
    var idxChange = false;
    if (Sup.Input.wasKeyJustPressed(GameConfig.closeDebugKey)) {
      TomE.closeMenu();
    } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
      idxChange = true;
      this.index = (this.index - 1 + this.stateLen) % this.stateLen; //adding stateLen stops it from going neg and breaking
    } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
      idxChange = true;
      this.index = (this.index + 1) % this.stateLen;
    } else if (typeof this.varValue == "string" && (Sup.Input.wasKeyJustPressed("SPACE") || Sup.Input.wasKeyJustPressed("RETURN"))) {
      var newText = window.prompt("Enter new value:", this.varValue);
      Sup.log("Prompt returned: " + newText);
      if(newText != null) {
        this.varValue = newText;
        TomE.state[this.varName] = this.varValue;
        this.varValueActor.textRenderer.setText(this.varValue);
      } 
    } else if(Sup.Input.wasKeyJustPressed("UP") || Sup.Input.wasKeyJustPressed("DOWN")) {
      var change = 0;
      if(Sup.Input.isKeyDown("SHIFT")) {
        change = 10;
      } else if(Sup.Input.isKeyDown("CONTROL")) {
        change = 0.1;
      } else if(Sup.Input.isKeyDown("ALT")) {
        change = 0.01;
      } else {
        change = 1;
      }

      if(Sup.Input.wasKeyJustPressed("UP")) TomE.state[this.varName] += change;
      else TomE.state[this.varName] -= change;

      this.varValue = TomE.state[this.varName];

      //floating point error is rampant and there's no formatting code
      //so write some code to truncate and round after hundredths
      var tStr = String(TomE.state[this.varName]);
      if(tStr.lastIndexOf('.') != -1) {
        var dotPos = tStr.lastIndexOf('.');
        if(tStr.length > dotPos+3) {
          tStr = tStr.substr(0, dotPos+3);
        }
      }

      this.varValueActor.textRenderer.setText(tStr); 
    } else if (typeof this.varValue == "bool" && Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      this.varValue = !this.varValue;
      this.varValueActor.textRenderer.setText(this.varValue ? "TRUE" : "FALSE");
      TomE.state[this.varName] = this.varValue;
    }
    
    if(idxChange)
    {
      var idx = 0;
      var key = "";
      for(key in TomE.state)
      {
        if (idx == this.index) {
          this.varName = key;
          break;
        }
        idx++;
      }

      this.varNameActor.textRenderer.setText(this.varName);
      
      if (typeof TomE.state[this.varName] == "boolean") {
        this.varValueActor.textRenderer.setText(TomE.state[this.varName] ? "TRUE" : "FALSE"); 
      } else if (typeof TomE.state[this.varName] == "string") {
        this.varValueActor.textRenderer.setText(TomE.state[this.varName]); 
      } else if (typeof TomE.state[this.varName] == "number") {
        this.varValueActor.textRenderer.setText(String(TomE.state[this.varName])); 
      }
      
      this.varValue = TomE.state[this.varName];
    }
  }
}
Sup.registerBehavior(StateMenuBehavior);
