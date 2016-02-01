module Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  
  export let mainDialog: Sup.Actor;
  export let fullscreenDialog: Sup.Actor;
  export let dialogBehavior: DialogBehavior;
  export let fsdialogBehavior: FSDialogBehavior;
  
        
  //vars what get initialized go here for sanity
  export let perRoomObjectUseStatus: Object[] = [];
  export let itemBehaviors: ItemBehavior[] = [];  
  export let music: Sup.Audio.SoundPlayer = null;
  export let musicVolume = 0;
  export let targetMusicVolume = 1;
  export let musicAsset = null;
        
  /* IMPORTANT!!!!!!
   * Do NOT start the player with items! Otherwise saving/loading will be a big mess.
   * Besides it's good practice to let the player pick stuff up in their room anywho.
   */
  export let inventory = { 
    "ItemName" : false, 
  };
  
  /* IMPORTANT!!!!!!
   * ALL state variables must default to false! Otherwise saving/loading will be a big mess
   */
  export let state = {
    
    //Science Room
    listenTriggered: false,
  };
  
  export let TextData: any;
  
  export let hoverSound: Sup.Sound;
  export let selectSound: Sup.Sound;
  
  export function initialize() {
    Game.hoverSound = Sup.get("SFX/Hover", Sup.Sound);
    Game.selectSound = Sup.get("SFX/Select", Sup.Sound);
  
    if (Game.TextData == null) {
      let textData = TextDataEn;
      Game.TextData = textData;
    }
  }
  
  export function newGame() {
    //clear state
    for(var key in state) {
      state[key] = false;
    }
    
    //clear inventory
    for(var key in inventory) {
      inventory[key] = false;
    }
    
    //stop music
    if (music != null) {
      music.stop();
    }
    
    //reset vars as needed
    perRoomObjectUseStatus = [];
    itemBehaviors = [];  
    music = null;
    musicVolume = 0;
    targetMusicVolume = 1;
    musicAsset = null;
    
    //run code formerly found in Start.ts
    Sup.Input.setMouseVisible(false);
    Sup.loadScene("Pre-Intro/Scene");

    // To skip the intro, uncomment this:
    // Game.start();
  }
    
  export function start() {
    Sup.loadScene(Sup.get("In-Game/Scene", Sup.Scene));
    Game.playerBehavior = Sup.getActor("Player").getBehavior(PlayerBehavior);
    
    for (let item in Game.inventory) {
      Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
    }
    
    CutsceneList.buildList();
    
    Game.switchToScene("In-Game/Scenery/ScienceRoom/Prefab", "Start");
  }
  
  export function setBGM(musicName: string) {
    Sup.log("Music name: " + musicName);
    let newMusic = Sup.get("Music/" + musicName);
    if (newMusic == null) {
      Sup.log("NO MUSIC CALLED: " + musicName)
    } else {
      if (newMusic !== Game.musicAsset) {
        if (Game.music != null) {
          Game.music.stop();
          Game.music = null;
        }
        
        Game.musicAsset = newMusic;
        if (Game.musicAsset != null) {
          Game.music = new Sup.Audio.SoundPlayer(Game.musicAsset, 1.0, { loop: true });
          
          Game.musicVolume = 0;
          Game.targetMusicVolume = 1;
          Game.music.setVolume(Game.musicVolume);
          
          Game.music.play();
        }
      }
    }
  }
  
  export function switchToScene(sceneName: string, target: string) {
    Game.itemBehaviors.length = 0;
    
    let sceneRoot = Sup.appendScene(Sup.get(sceneName , Sup.Scene))[0];
    
    // Play correct music
    let musicActor = sceneRoot.getChild("Music");
    let musicName = "Intro";
    if(musicActor != null)
    {
      Sup.log("got music actor.");
      musicName = (musicActor["musicName"]);
    }
    setBGM(musicName);
    
    let targetActor = sceneRoot.getChild(target);
    if (targetActor == null) {
      Sup.log(`Game.switchToScene(): no actor named "${target}" found`);
    }
    
    Game.playerBehavior.position.x = targetActor.getLocalPosition().x;
    //Game.cameraBehavior.position.x = Game.playerBehavior.position.x;
    //Game.playerBehavior.position.y = -1.2;
    
    Game.playerBehavior.actor.setLocalPosition(Game.playerBehavior.position);
  }
    
  export function createText(text: string, position: Sup.Math.Vector3, alignment: string, parent: Sup.Actor) {
    let textActor = new Sup.Actor("Text");
    
    if (parent != null) {
      textActor.setParent(parent);
    }
    
    if (position == null) {
      position = new Sup.Math.Vector3(0,0,0);
    }
    
    textActor.setLocalPosition(position);
    let textActorBehavior = new TextBehavior(textActor);
    textActorBehavior.text = text;
    if (alignment != null) {
      textActorBehavior.alignment = alignment;
    }
    
    return textActor;
  }
  
  export function hasItem(item: string) {
    return Game.inventory[item];
  }
  
  export function getItem(item: string) {
    Sup.Audio.playSound("SFX/Pick Up");
    Game.inventory[item] = true;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(1);
  }
    
  export function useItem(item: string) {
    Game.inventory[item] = false;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
  }
  
  export function saveGame(idx: number) {
    for(var prop in this) {
      
    }
  }
}

Game.initialize();
