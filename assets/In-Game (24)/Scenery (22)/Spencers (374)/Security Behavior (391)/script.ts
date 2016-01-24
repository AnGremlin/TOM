class SecurityBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if(Game.hasItem("Card"))
    {
      textId = "Sec_after";
    }
    else if(Game.hasItem("Oil") || Game.hasItem("Sucker"))
    {
      textId = "Sec_warn";
    }
    else {
      textId = "Sec_greet";
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Security", textId, choiceIds, this);
  }
  
  update()
  {
    if((Game.hasItem("Oil") || Game.hasItem("Sucker")) && !Game.hasItem("Card")) {
      //you got the goods, but haven't paid
      if(Game.playerBehavior.canMove && Game.playerBehavior.position.x <= this.actor.getPosition().x && Game.playerBehavior.moveTargetX <= this.actor.getPosition().x) {
        this.actor.spriteRenderer.setAnimation("Talk");
        Game.dialogBehavior.show("Security", "Sec_stop", ["Sec_okay"], this);
      }
    }
  }

  finishDialog(textId: string, choiceId: string) {
    if (textId === "Sec_stop") {
      Game.playerBehavior.moveTargetX = this.actor.getPosition().x + 2;
      Game.playerBehavior.autoPilot = true;
    }
    
    this.actor.spriteRenderer.setAnimation("Idle");
  }
}
Sup.registerBehavior(SecurityBehavior);