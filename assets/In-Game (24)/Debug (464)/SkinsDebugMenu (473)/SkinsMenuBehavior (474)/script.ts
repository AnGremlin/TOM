class SkinsMenuBehavior extends Sup.Behavior {
  
  varNameActor: Sup.Actor;
  varValueActor: Sup.Actor;
  redCol: Sup.Color;
  greenCol: Sup.Color;
  varName= "";
  varValue = "";

  charDex = 0;
  charLen = 0;
  currentSkin = 0;
  skinDex = 0;
  skinLen = 0;
  
  start() {
    this.varNameActor = this.actor.getChild("VarName");
    this.varValueActor = this.actor.getChild("VarValue");
    this.greenCol = new Sup.Color(0,1,0);
    this.redCol = new Sup.Color(1,0,0);
    
    var cidx = 0;
    var found = false;
    for(var key in CharacterList.skins)
    {
      if (cidx == this.charDex) {
        found = true;
        this.varName = key;
      } 
      cidx++;
    }
    
    this.skinDex = CharacterList.indices[this.varName];
    var sidx = 0;
    var found = false;
    for(var key in CharacterList.names[this.varName])
    {
      if (sidx == this.skinDex) {
        found = true;
        this.varValue = CharacterList.names[this.varName][key];
        this.currentSkin = sidx;
      } 
      sidx++;
    }
    
    this.charLen = cidx;
    this.skinLen = sidx;
    this.varNameActor.textRenderer.setText(this.varName);
    this.varValueActor.textRenderer.setText(this.varValue);
    this.varValueActor.textRenderer.setColor(this.greenCol);
  }

  update() {
    var sidxChange = false;
    var cidxChange = false;
    if (Sup.Input.wasKeyJustPressed("N")) {
      Game.closeMenu();
    } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
      sidxChange = true;
      this.skinDex = (this.skinDex - 1) % this.skinLen;
    } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
      sidxChange = true;
      this.skinDex = (this.skinDex + 1) % this.skinLen;
    } else if (Sup.Input.wasKeyJustPressed("UP")) {
      cidxChange = true;
      this.charDex = (this.charDex - 1) % this.charLen;
    } else if (Sup.Input.wasKeyJustPressed("DOWN")) {
      cidxChange = true;
      this.charDex = (this.charDex + 1) % this.charLen;
    } else if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      CharacterList.setSkin(this.varName, this.varValue);
      this.varValueActor.textRenderer.setColor(this.greenCol);
      this.currentSkin = this.skinDex;
    }
    
    if(sidxChange)
    {
      var idx = 0;
      var key = "";
      for(key in CharacterList.names[this.varName])
      {
        if (idx == this.skinDex) {
          this.varValue = CharacterList.names[this.varName][key];
          break;
        }
        idx++;
      }

      this.varValueActor.textRenderer.setText(this.varValue);
      this.varValueActor.textRenderer.setColor(idx == this.currentSkin ? this.greenCol : this.redCol);
    }
    
    if(cidxChange)
    {
      var idx = 0;
      var key = "";
      for(key in CharacterList.names)
      {
        if (idx == this.charDex) {
          this.varName = key;
          break;
        }
        idx++;
      }
      
      this.skinDex = CharacterList.indices[this.varName];
      var sidx = 0;
      var found = false;
      for(var skey in CharacterList.names[this.varName])
      {
        if (sidx == this.skinDex) {
          found = true;
          this.varValue = CharacterList.names[this.varName][skey];
          this.currentSkin = sidx;
        } 
        sidx++;
      }

      this.skinLen = sidx;
      this.varNameActor.textRenderer.setText(this.varName);
      this.varValueActor.textRenderer.setText(this.varValue);
      this.varValueActor.textRenderer.setColor(this.greenCol);
    }
  }
}
Sup.registerBehavior(SkinsMenuBehavior);
