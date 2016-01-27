class SecurityBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if(Game.hasItem("Oil") || Game.hasItem("Sucker"))
    {
      textId = "Sec_warn";
    }
    else {
      textId = "lorem_";//"Sec_greet";
    }
    
    if(textId !== "lorem_") {
      Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
      Game.dialogBehavior.show("Security", textId, choiceIds, this);
    }
    else
    {
      Game.fsdialogBehavior.show(textId, ["Gen_okay","Gen_yeah"], this);
    }
  }
  
  update()
  {
  }
}
Sup.registerBehavior(SecurityBehavior);