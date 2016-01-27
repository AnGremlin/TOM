class CashierBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if (!Game.state.receiptAcquired) {
      if(!Game.state.lubeAcquired && !Game.state.dildoAcquired) {
        textId = "Cash_NoItems";
      } else if(!(Game.state.lubeAcquired && Game.state.dildoAcquired)) {
        textId = "Cash_OneItem";
      } else {
        textId = "Cash_Dialog";
        choiceIds = [ "Cash_buy_yes", "Cash_buy_no" ];
      }
    } else {
      textId = "Cash_After";
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("RexMaid", textId, choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var dowieAnim ="Idle";
    
    if (textId === "Cash_Dialog") { 
      if (choiceId === "Cash_buy_yes") {
        if(Game.hasItem("Flower"))
        {
          Game.getItem("Card");
          Game.state.receiptAcquired=true;
          Game.state.hasMoney = false;
          Game.useItem("Flower");
        }
      }
    }
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim)
  }
}
Sup.registerBehavior(CashierBehavior);