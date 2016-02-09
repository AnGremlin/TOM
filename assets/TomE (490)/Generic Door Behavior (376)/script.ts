class GenericDoorBehavior extends Sup.Behavior {
  
  targetScene: string;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() == "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      TomE.cameraBehavior.transitionToScene(this.targetScene);
    }
  }
      
  activate() {
    TomE.playerBehavior.canMove = false;
    this.actor.spriteRenderer.setAnimation("Animation", false);
    Sup.Audio.playSound("SFX/Opening Door");
  }
}
Sup.registerBehavior(GenericDoorBehavior);
