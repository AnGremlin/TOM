class PreIntroBehavior extends Sup.Behavior {
  timer = 300;
  sprite: Sup.SpriteRenderer;

  start() {
    //Game.music = new Sup.Audio.SoundPlayer("Music/Intro", 0.2);
    //Game.music.play();
    
    //this.sprite = Sup.getActor("Background").spriteRenderer;
    
    //let textBehavior = new Sup.Actor("Text").addBehavior(TextBehavior, { alignment: "left" });
    //textBehavior.actor.setLocalPosition(-6, -3, 6);
    //textBehavior.setText(Game.TextData.Intro, 50);
  }
    
  update() {
    this.timer -= 1;
    if (this.timer === 0) {
      Game.start();
      
    }// else if (this.lightOn.indexOf(this.timer) !== -1) {
    //  this.sprite.setSprite(Sup.get("Pre-Intro/Chair Light", Sup.Sprite));
    //
    //} else if (this.lightOff.indexOf(this.timer) !== -1) {
    //  this.sprite.setSprite(Sup.get("Pre-Intro/Chair", Sup.Sprite));
    //}
  }
}
Sup.registerBehavior(PreIntroBehavior);