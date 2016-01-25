class GenericDoorBehavior extends Sup.Behavior {
  
  targetScene: string;
  targetActor: string;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() == "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene(this.targetScene, this.targetActor);
    }
  }
      
  activate() {
    Game.playerBehavior.canMove = false;
    this.actor.spriteRenderer.setAnimation("Animation", false);
    Sup.Audio.playSound("SFX/Opening Door");
  }
}
Sup.registerBehavior(GenericDoorBehavior);