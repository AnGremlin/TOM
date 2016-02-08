class MusicBehavior extends Sup.Behavior {
  
  musicName: string;
  
  awake() {
    this.actor["musicName"] = this.musicName;
  }
}
Sup.registerBehavior(MusicBehavior);
