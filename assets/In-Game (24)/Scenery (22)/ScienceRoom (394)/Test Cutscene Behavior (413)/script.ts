class TCSBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
  }

  activate() {
    Cutscene.loadScript(TestCutscene); 
  }
}
Sup.registerBehavior(TCSBehavior);