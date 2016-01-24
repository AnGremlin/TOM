class FSDialogBehavior extends Sup.Behavior {
  mainTextBehavior: TextBehavior;
  
  isVisible = false;
  blackedOut = false;
  closedTimer = 10;
  textId: string;
  blackoutActor: Sup.Actor;
  blackscreenTargetOpacity = 0;
  blackscreenOpacity = 0;
  
  awake() {
    Game.fullscreenDialog = this.actor;
    Game.fsdialogBehavior = this;
  }

  start() {
    this.actor.setVisible(false);
    
    this.mainTextBehavior = this.actor.getChild("Text").getBehavior(TextBehavior);
    this.mainTextBehavior.alignment = "left";  
    
    this.blackoutActor = this.actor.getChild("Blackout");
    this.blackoutActor.spriteRenderer.setOpacity(0);
  }

  update() {
    if (!this.isVisible) {
      this.closedTimer++;
      return;
    }
    
     // Fading
    if (this.blackscreenOpacity != this.blackscreenTargetOpacity) {
      this.blackscreenOpacity = Sup.Math.lerp(this.blackscreenOpacity, this.blackscreenTargetOpacity, 0.1);
      if (Math.abs(this.blackscreenOpacity - this.blackscreenTargetOpacity) < 0.01) {
        this.blackscreenOpacity = this.blackscreenTargetOpacity;
        
        if (this.blackscreenOpacity === 1 && !this.blackedOut) {
          this.blackedOut = true;
          
          let text = Game.TextData[this.textId];
          if (text == null) text = this.textId;
          this.mainTextBehavior.setText(text, 45);
          
        } else if (this.blackscreenOpacity === 0) {
          this.isVisible = false;
          this.actor.setVisible(false);
          Game.playerBehavior.canMove = true;
          this.blackedOut = false;
        }
      }
      
      this.blackoutActor.spriteRenderer.setOpacity(Sup.Math.clamp(this.blackscreenOpacity, 0, 1));
    }
    
    // Skip text / close dialog
    if (this.blackedOut && Sup.Input.wasMouseButtonJustReleased(0)) {
      if (! this.mainTextBehavior.skipToEnd()) {
        this.close();
        return;
      }
    }
  }
  
  show(textId: string, dialogFinishBehavior?) {
    Game.playerBehavior.canMove = false;
    this.textId = textId;
    if(!this.blackedOut) {
      this.blackscreenTargetOpacity = 1;
    } else {
      let text = Game.TextData[textId];
      if (text == null) text = textId;

      this.mainTextBehavior.setText(text, 45);
    }
    // this.textId is used in close()
    
    this.isVisible = true;
    this.actor.setVisible(true);
    this.mainTextBehavior.actor.setVisible(true);
    
    Game.playerBehavior.canMove = false;
    
    this["dialogFinishBehavior"] = dialogFinishBehavior;
  }
  
  close() {
    this.closedTimer = 0;
  
    //this.isVisible = false;
    //this.actor.setVisible(false);
    this.mainTextBehavior.setText("");
    //Game.playerBehavior.canMove = true;
    
    this.blackscreenTargetOpacity = 0;
  
    if (this["dialogFinishBehavior"] != null) {      
      let dialogFinishBehavior = this["dialogFinishBehavior"];
      this["dialogFinishBehavior"] = null;
      dialogFinishBehavior.finishDialog(this.textId, "");
    }
  }
  
}
Sup.registerBehavior(FSDialogBehavior);
