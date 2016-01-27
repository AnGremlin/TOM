class SpenecersExitBehavior extends Sup.Behavior {
  
  targetScene: string;
  targetActor: string;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }

  start() {
    if(!Game.state.moneyAcquired)
    {
      Game.state.moneyAcquired = true;
      Game.getItem("Flower");
    }
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() == "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene(this.targetScene, this.targetActor);
    }
  }
      
  activate() {
    if(!Game.hasItem("Sucker") && !Game.hasItem("Oil")) {
      Game.playerBehavior.canMove = false;
      this.actor.spriteRenderer.setAnimation("Animation", false);
      Sup.Audio.playSound("SFX/Opening Door");
    } else {
      Cutscene.loadScript("security_stop");
    }
  }
}
Sup.registerBehavior(SpenecersExitBehavior);
