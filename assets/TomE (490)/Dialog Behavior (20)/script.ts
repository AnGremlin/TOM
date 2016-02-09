class DialogBehavior extends Sup.Behavior {
  mainTextBehavior: TextBehavior;
  
  isVisible = false;
  closedTimer = 10;
  previousTextId: string;
  previousRandomTextIndex = -1;
  faceSetSpriteRenderer: Sup.SpriteRenderer;

  choicesOrigin: Sup.Actor;
  choicesOriginPosition: Sup.Math.Vector3;
  choiceTextBehaviors: TextBehavior[] = [];
  choiceSelectActor: Sup.Actor;
  activeChoiceIndex = -1;
  textId: string;
  choiceIds: string[];
  
  awake() {
    TomE.dialogBehavior = this;
  }

  start() {
    this.actor.setVisible(false);
    this.faceSetSpriteRenderer = this.actor.getChild("Face Set").spriteRenderer;
    
    this.mainTextBehavior = this.actor.getChild("Text").getBehavior(TextBehavior);
    this.mainTextBehavior.alignment = "left";
    
    this.choicesOrigin = this.actor.getChild("Choices");
    this.choicesOriginPosition = this.choicesOrigin.getLocalPosition();
    
    this.choiceSelectActor = this.actor.getChild("Select Choice");
    
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
    
    // Hover choices
    if (this.choiceIds != null) {
      if (!this.mainTextBehavior.isOver()) {
        this.choicesOrigin.setVisible(false);
      } else {
        this.choicesOrigin.setVisible(true);
      
        let oldActiveChoiceIndex = this.activeChoiceIndex;

        if (TomE.playerBehavior.mousePosition.y < -3.75 && TomE.playerBehavior.mousePosition.y >= -3.75 - 0.3 * 3) {
          let choiceY = Math.min(this.choiceIds.length - 1, Math.floor(-(TomE.playerBehavior.mousePosition.y + 3.75) / 0.3));

          let choiceX = 0;
          if (this.choiceIds.length > 3) {
            choiceX = Sup.Math.clamp(Math.floor((TomE.playerBehavior.mousePosition.x + 7.5) / 5), 0, 1);
          }

          this.activeChoiceIndex = Math.min(choiceX * 3 + choiceY, this.choiceIds.length - 1);
        } else {
          this.activeChoiceIndex = -1;
        }

        if (this.activeChoiceIndex >= 0) {' '
          if (oldActiveChoiceIndex !== this.activeChoiceIndex) {
            new Sup.Audio.SoundPlayer(TomE.hoverSound).play();
          }
          this.choiceSelectActor.setVisible(true);
          this.choiceSelectActor.setLocalPosition(-5.35 + Math.floor(this.activeChoiceIndex / 3) * 5, -this.activeChoiceIndex % 3 * 0.3 - 0.15, 1);
        } else {
          this.choiceSelectActor.setVisible(false);
        }
      }
    }
    
    // Skip text / close dialog
    if (Sup.Input.wasMouseButtonJustReleased(0) || Sup.Input.wasKeyJustPressed("SPACE")) {
      if (! this.mainTextBehavior.skipToEnd() && (this.choiceIds == null || this.activeChoiceIndex >= 0)) {
        if (this.choiceIds != null) {
          new Sup.Audio.SoundPlayer(TomE.selectSound).play();
        }
        this.close();
        return;
      }
    }
  }
  
  show(characterId: string, textId: string, choiceIds: string[], dialogFinishBehavior?) {
    let text = TomE.TextData[textId];
    if (text == null) text = textId;
    var choiceTexts = [];
    if (choiceIds != null) {
      choiceIds.forEach((choiceId, i) => {
        choiceTexts[i] = TomE.TextData[choiceId];
      });
    }
    
    this.showRaw(characterId, text, choiceIds, choiceTexts, dialogFinishBehavior, textId)
  }
  
  showRaw(characterId: string, text: string, choiceIds: string[], choiceTexts: string[], dialogFinishBehavior?, textId?) {
    this.textId = textId;
    this.choiceIds = choiceIds;
    
    this.isVisible = true;
    this.actor.setVisible(true);
    this.choiceIds = choiceIds;
    this.activeChoiceIndex = -1;
    
    this.choicesOrigin.setVisible(false);
    this.choiceSelectActor.setVisible(false);
    
    TomE.playerBehavior.canMove = false;
    this.faceSetSpriteRenderer.setSprite(Sup.get("Game/Faces/"+characterId, Sup.Sprite))
    
    this.mainTextBehavior.setText(text, 45);
    
    if (choiceIds != null) {
      choiceTexts.forEach((choiceText, i) => {
        this.choiceTextBehaviors[i].setText(choiceText);
      });
    }
    
    this["dialogFinishBehavior"] = dialogFinishBehavior;
  }
  
  showIdx(characterId: string, textId: string, index: number, dialogFinishBehavior?) {
    this.textId = textId;
    // this.textId is used in close()
    
    this.choicesOrigin.setVisible(false);
    this.choiceSelectActor.setVisible(false);
    
    this.isVisible = true;
    this.actor.setVisible(true);
    
    TomE.playerBehavior.canMove = false;
    this.faceSetSpriteRenderer.setSprite(Sup.get("Game/Faces/"+characterId, Sup.Sprite))
    
    let text = TomE.TextData[textId];
    if (text == null) text = textId;
      
    text = text[index];
      
    this.mainTextBehavior.setText(text, 45);
    
    this["dialogFinishBehavior"] = dialogFinishBehavior;
  }
  
  close() {
    this.closedTimer = 0;
  
    this.isVisible = false;
    this.actor.setVisible(false);
    this.mainTextBehavior.setText("");
    TomE.playerBehavior.canMove = true;
    
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
Sup.registerBehavior(DialogBehavior);
