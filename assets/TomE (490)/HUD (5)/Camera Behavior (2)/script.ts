class CameraBehavior extends Sup.Behavior {

  position = new Sup.Math.Vector3(0,0,10);

  offset = 1000000;

  blackscreenActor: Sup.Actor;
  blackscreenOpacity = 1;
  blackscreenTargetOpacity = 0;

  targetScene: string;

  awake() {
    TomE.cameraBehavior = this;
  }
    
  start() {
    this.blackscreenActor = this.actor.getChild("Blackscreen");
    this.blackscreenActor.setLocalScale(100, 100, 1);
  }

  update() {
    // Position
    //if (TomE.playerBehavior.position.x - this.offset > this.position.x) {
    //  this.position.x = Sup.Math.lerp(this.position.x, TomE.playerBehavior.position.x - this.offset, 0.1);
    //} else if (TomE.playerBehavior.position.x + this.offset < this.position.x) {
    //  this.position.x = Sup.Math.lerp(this.position.x, TomE.playerBehavior.position.x + this.offset, 0.1);
    //}
    //
    //this.actor.setLocalPosition(this.position);
    
    // Fading
    if (this.blackscreenOpacity != this.blackscreenTargetOpacity) {
      this.blackscreenOpacity = Sup.Math.lerp(this.blackscreenOpacity, this.blackscreenTargetOpacity, 0.1);
      if (Math.abs(this.blackscreenOpacity - this.blackscreenTargetOpacity) < 0.01) {
        this.blackscreenOpacity = this.blackscreenTargetOpacity;
        
        if (this.blackscreenOpacity === 1) {
          Sup.getActor("Scene").destroy();
          TomE.switchToScene(this.targetScene);
          
          this.blackscreenOpacity = 2;
          this.blackscreenTargetOpacity = 0;
        
        } else if (this.blackscreenOpacity === 0) {
          if (!TomE.dialogBehavior.isVisible && !TomE.fsdialogBehavior.isVisible) {
            TomE.playerBehavior.canMove = true;
          }
        }
      }
      
      this.blackscreenActor.spriteRenderer.setOpacity(Sup.Math.clamp(this.blackscreenOpacity, 0, 1));
    }
    
    // Update music volume
    if (TomE.music != null) {
      TomE.musicVolume = Sup.Math.lerp(TomE.musicVolume, TomE.targetMusicVolume, 0.01);
      TomE.music.setVolume(TomE.musicVolume);
    }
  }

  transitionToScene(scene: string) {
    this.targetScene = scene;
    this.blackscreenTargetOpacity = 1;
    
    TomE.playerBehavior.canMove = false;
    TomE.playerBehavior.hoveredItem = null;
  }

}
Sup.registerBehavior(CameraBehavior);
