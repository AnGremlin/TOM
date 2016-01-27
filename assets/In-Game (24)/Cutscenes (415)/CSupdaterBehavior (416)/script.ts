class CSUpdaterBehavior extends Sup.Behavior {
  awake() {
    Cutscene.reset();
  }

  update() {
    Cutscene.update();
  }
}
Sup.registerBehavior(CSUpdaterBehavior);
