class SimplePhraseBehavior extends Sup.Behavior {
  
  isArray = false;
  index = 0;
  text = null;
  
  awake() {
    this.actor["actionBehavior"] = this;
    this.text = Game.TextData[this.actor.getName()];
    this.isArray = Array.isArray(this.text);
    
    if (Game.TextData[this.actor.getName()] == null) {
      Sup.log(`WARNING: no text set for - ${this.actor.getName()} - item`);
    }
  }
  
  activate() {
    if(!this.isArray) {
      Game.dialogBehavior.show("Tom", this.actor.getName(), null);  
    } else {
      this.index = 1;
      Game.dialogBehavior.showIdx("Tom", this.actor.getName(), 0, this);  
    }
  }

  finishDialog(textId: string, choiceId: string) {
    if(this.index < this.text.length){
      var showIndex = this.index;
      this.index++;
      Game.dialogBehavior.showIdx("Tom", this.actor.getName(), showIndex, this);  
    }
  }
}
Sup.registerBehavior(SimplePhraseBehavior);
