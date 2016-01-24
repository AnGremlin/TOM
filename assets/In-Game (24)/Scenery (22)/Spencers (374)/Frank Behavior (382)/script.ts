class FrankBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if(!Game.state.frankTalkedTo)
    {
      textId = "Frank_intro";
      Game.state.frankTalkedTo = true;
    }
    else if(Game.state.dildoAcquired)
    {
      textId = "Frank_after";
    }
    else {
      textId = "Frank_dialog_again";
      choiceIds = [ "Frank_dildo_yes", "Frank_dildo_no" ];
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Frank", textId, choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var dowieAnim ="Idle";
    
    if (textId === "Frank_intro") {
      
      Game.dialogBehavior.show("Frank", "Frank_dialog", [ "Frank_dildo_yes", "Frank_dildo_no" ], this)
    }
    else if (textId === "Frank_dialog_again" || textId === "Frank_dialog") {
      if (choiceId === "Frank_dildo_yes") {
        Game.getItem("Sucker");
        Game.state.dildoAcquired =true;
      }
    }
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim)
  }
}
Sup.registerBehavior(FrankBehavior);