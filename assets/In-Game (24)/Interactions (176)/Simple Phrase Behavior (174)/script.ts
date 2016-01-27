class SimplePhraseBehavior extends Sup.Behavior {
  
  isArray = false;
  index = 0;
  text = null;

  overrideTextId = "";
  overrideText = "";
  overrideFaceset = "";
  
  awake() {
    this.actor["actionBehavior"] = this;
    this.text = this.overrideText != "" ? this.overrideText : Game.TextData[this.overrideTextId ? this.overrideTextId : this.actor.getName()];
    this.isArray = Array.isArray(this.text);
    
    if (this.text == null) {
      Sup.log(`WARNING: no text set for - ${this.actor.getName()} - item`);
    }
  }
  
  activate() {
    if(!this.isArray) {
      Game.dialogBehavior.showRaw(this.overrideFaceset != "" ? this.overrideFaceset : "TomBlank", this.text, null, null);  
    } else {
      this.index = 1;
      Game.dialogBehavior.showIdx(this.overrideFaceset != "" ? this.overrideFaceset : "TomBlank", this.overrideTextId != "" ? this.overrideTextId : this.actor.getName(), 0, this);  
    }
  }

  finishDialog(textId: string, choiceId: string) {
    if(this.index < this.text.length){
      var showIndex = this.index;
      this.index++;
      Game.dialogBehavior.showIdx("TomBlank", this.actor.getName(), showIndex, this);  
    }
  }
}
Sup.registerBehavior(SimplePhraseBehavior);
