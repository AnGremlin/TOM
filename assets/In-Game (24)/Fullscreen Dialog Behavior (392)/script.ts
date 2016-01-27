class FSDialogBehavior extends Sup.Behavior {
  mainTextBehavior: TextBehavior;
  
  isVisible = false;
  blackedOut = false;
  closedTimer = 10;
  textId: string;
  blackoutActor: Sup.Actor;
  blackscreenTargetOpacity = 0;
  blackscreenOpacity = 0;

  choicesOrigin: Sup.Actor;
  choicesOriginPosition: Sup.Math.Vector3;
  choiceTextBehaviors: TextBehavior[] = [];
  choiceSelectActor: Sup.Actor;
  activeChoiceIndex = -1;
  choiceIds: string[];
  
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
    
    this.choicesOrigin = this.actor.getChild("Choices");
    this.choicesOriginPosition = this.choicesOrigin.getLocalPosition();
    
    this.choiceSelectActor = this.actor.getChild("Select Choice");
    this.choiceSelectActor.setVisible(false);
    
    for (let i = 0; i < 5; i++) {
      let choiceActor = new Sup.Actor("Choice" + i, this.choicesOrigin);
      choiceActor.setLocalPosition(0.3 + Math.floor(i / 3) * 5, -i % 3 * 0.3, 0);
      let textBehavior = choiceActor.addBehavior(TextBehavior, {"delay": 0, "alignment": "left", "opacity": 0.5});
      this.choiceTextBehaviors.push(textBehavior);
    }   
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
    
          if (this.choiceIds != null) {
            this.choiceIds.forEach((choiceId, i) => {
              this.choiceTextBehaviors[i].setText(Game.TextData[choiceId]);
            });
          }
          
        } else if (this.blackscreenOpacity === 0) {
          this.isVisible = false;
          this.actor.setVisible(false);
          Game.playerBehavior.canMove = true;
          this.blackedOut = false;
        }
      }
      
      this.blackoutActor.spriteRenderer.setOpacity(Sup.Math.clamp(this.blackscreenOpacity, 0, 1));
    }
    
    // Hover choices
    if (this.choiceIds != null) {
      if (!this.mainTextBehavior.isOver()) {
        this.choicesOrigin.setVisible(false);
      } else {
        this.choicesOrigin.setVisible(true);
      
        let oldActiveChoiceIndex = this.activeChoiceIndex;

        if (Game.playerBehavior.mousePosition.y < -3.75 && Game.playerBehavior.mousePosition.y >= -3.75 - 0.3 * 3) {
          let choiceY = Math.min(this.choiceIds.length - 1, Math.floor(-(Game.playerBehavior.mousePosition.y + 3.75) / 0.3));

          let choiceX = 0;
          if (this.choiceIds.length > 3) {
            choiceX = Sup.Math.clamp(Math.floor((Game.playerBehavior.mousePosition.x + 7.5) / 5), 0, 1);
          }

          this.activeChoiceIndex = Math.min(choiceX * 3 + choiceY, this.choiceIds.length - 1);
        } else {
          this.activeChoiceIndex = -1;
        }

        if (this.activeChoiceIndex >= 0 && this.blackscreenTargetOpacity != 0) {
          if (oldActiveChoiceIndex !== this.activeChoiceIndex) {
            new Sup.Audio.SoundPlayer(Game.hoverSound).play();
          }
          this.choiceSelectActor.setVisible(true);
          this.choiceSelectActor.setLocalPosition(-5.35 + Math.floor(this.activeChoiceIndex / 3) * 5, -this.activeChoiceIndex % 3 * 0.3 - 4.682, 0);
        } else {
          this.choiceSelectActor.setVisible(false);
        }
      }
    }
    
    // Skip text / close dialog
    if (Sup.Input.wasMouseButtonJustReleased(0)) {
      if (! this.mainTextBehavior.skipToEnd() && (this.choiceIds == null || this.activeChoiceIndex >= 0)) {
        if (this.choiceIds != null) {
          new Sup.Audio.SoundPlayer(Game.selectSound).play();
        }
        this.close();
        return;
      }
    }
  }
  
  show(textId: string, choiceIds: string[], dialogFinishBehavior?) {
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
    
    this.choiceIds = choiceIds;
    this.activeChoiceIndex = -1;
    
    this.choicesOrigin.setVisible(false);
    this.choiceSelectActor.setVisible(false);
    
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
    
    for (let i = 0; i < 5; i++) {
      this.choiceTextBehaviors[i].setText("");
    }
  
    if (this["dialogFinishBehavior"] != null) {
      let choiceId = "";
      if (this.choiceIds != null) {
        choiceId = this.choiceIds[this.activeChoiceIndex];
      }
      
      let dialogFinishBehavior = this["dialogFinishBehavior"];
      this["dialogFinishBehavior"] = null;
      dialogFinishBehavior.finishDialog(this.textId, choiceId);
    }
  }
  
}
Sup.registerBehavior(FSDialogBehavior);
