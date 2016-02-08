class CameraBehavior extends Sup.Behavior {

  position = new Sup.Math.Vector3(0,0,10);

  offset = 1000000;

  blackscreenActor: Sup.Actor;
  blackscreenOpacity = 1;
  blackscreenTargetOpacity = 0;

  targetScene: string;

  awake() {
    Game.cameraBehavior = this;
  }
    
  start() {
    this.blackscreenActor = this.actor.getChild("Blackscreen");
    this.blackscreenActor.setLocalScale(100, 100, 1);
  }

  update() {
    // Position
    //if (Game.playerBehavior.position.x - this.offset > this.position.x) {
    //  this.position.x = Sup.Math.lerp(this.position.x, Game.playerBehavior.position.x - this.offset, 0.1);
    //} else if (Game.playerBehavior.position.x + this.offset < this.position.x) {
    //  this.position.x = Sup.Math.lerp(this.position.x, Game.playerBehavior.position.x + this.offset, 0.1);
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
          Game.switchToScene(this.targetScene);
          
          this.blackscreenOpacity = 2;
          this.blackscreenTargetOpacity = 0;
        
        } else if (this.blackscreenOpacity === 0) {
          if (!Game.dialogBehavior.isVisible && !Game.fsdialogBehavior.isVisible) {
            Game.playerBehavior.canMove = true;
          }
        }
      }
      
      this.blackscreenActor.spriteRenderer.setOpacity(Sup.Math.clamp(this.blackscreenOpacity, 0, 1));
    }
    
    // Update music volume
    if (Game.music != null) {
      Game.musicVolume = Sup.Math.lerp(Game.musicVolume, Game.targetMusicVolume, 0.01);
      Game.music.setVolume(Game.musicVolume);
    }
  }

  transitionToScene(scene: string) {
    this.targetScene = scene;
    this.blackscreenTargetOpacity = 1;
    
    Game.playerBehavior.canMove = false;
    Game.playerBehavior.hoveredItem = null;
  }

}
Sup.registerBehavior(CameraBehavior);
