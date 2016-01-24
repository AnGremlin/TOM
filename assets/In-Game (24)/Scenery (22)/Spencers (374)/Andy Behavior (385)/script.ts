class AndyBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if(!Game.state.andyTalkedTo)
    {
      textId = "Andy_intro";
      Game.state.andyTalkedTo = true;
    }
    else if(Game.state.lubeAcquired)
    {
      textId = "Andy_after";
    }
    else {
      textId = "Andy_dialog_again";
      choiceIds = [ "Andy_lube_yes", "Andy_lube_no" ];
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Andy", textId, choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var dowieAnim ="Idle";
    
    if (textId === "Andy_intro") {
      
      Game.dialogBehavior.show("Andy", "Andy_dialog", [ "Andy_lube_yes", "Andy_lube_no" ], this)
    }
    else if (textId === "Andy_dialog_again" || textId === "Andy_dialog") {
      if (choiceId === "Andy_lube_yes") {
        Game.getItem("Oil");
        Game.state.lubeAcquired =true;
      }
    }
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim)
  }
}
Sup.registerBehavior(AndyBehavior);