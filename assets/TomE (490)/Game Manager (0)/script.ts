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
  export let loadedScene = "";
  export let menuOpen = false;
        
  /* IMPORTANT!!!!!!
   * Do NOT start the player with items! Otherwise saving/loading will be a big mess.
   * Besides it's good practice to let the player pick stuff up in their room anywho.
   */
  export var inventory = {};
  
  /* IMPORTANT!!!!!!
   * ALL state variables must default to false! Otherwise saving/loading will be a big mess
   */
  export var state = {};
  
  export let TextData: any;
  
  export let hoverSound: Sup.Sound;
  export let selectSound: Sup.Sound;
  
  export function initialize() {
    Game.hoverSound = Sup.get("TomE/SFX/Hover", Sup.Sound);
    Game.selectSound = Sup.get("TomE/SFX/Select", Sup.Sound);
  }
  
  export function newGame() {
    if(Sup.getActor("Scene") != null) {
      Sup.getActor("Scene").destroy();
      Sup.log("Destroyed current scene node.")
    }
  
    //load text
    if (Game.TextData == null) {
      Game.TextData = TextDataEn;
    }
    
    //reset state
    state = GameConfig.state;
    
    //reset inventory
    inventory = GameConfig.inventory;
    
    //stop music
    if (music != null) {
      music.stop();
      Sup.log("Stopped music");
    }
    
    //reset vars as needed
    perRoomObjectUseStatus = [];
    itemBehaviors = [];  
    music = null;
    musicVolume = 0;
    targetMusicVolume = 1;
    musicAsset = null;
    loadedScene = "";
    
    Sup.Input.setMouseVisible(false);
    if(GameConfig.menuScene != null) Sup.loadScene(GameConfig.menuScene);
    else if(GameConfig.introScene != null) Sup.loadScene(GameConfig.introScene);
    else Game.start();
  }
    
  export function start() {
    Sup.loadScene(Sup.get("Game/HUD", Sup.Scene));
    Game.playerBehavior = Sup.getActor("Player").getBehavior(PlayerBehavior);
    
    for (let item in Game.inventory) {
      Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
    }
    
    CharacterList.buildList();
    SceneList.buildList();
    CutsceneList.buildList();
    
    Game.switchToScene(GameConfig.startScene);
    Game.saveGame("new");
  }
    
  export function restoreScene(name: string) {
    Sup.loadScene(Sup.get("Game/HUD", Sup.Scene));
    Game.playerBehavior = Sup.getActor("Player").getBehavior(PlayerBehavior);
    
    for (var item in Game.inventory) {
      Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
    }
    
    Game.switchToScene(name);
  }
  
  export function setBGM(musicName: string) {
    Sup.log("Music name: " + musicName);
    let newMusic = Sup.get("Game/Music/" + musicName);
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
  
  export function switchToScene(sceneName: string) {
    Game.itemBehaviors.length = 0;
    
    Game.loadedScene = sceneName;
    
    sceneName = SceneList.getScene(sceneName);
    if(sceneName == null) return; //error prints in call above
    
    var sceneRoot = Sup.appendScene(Sup.get(sceneName , Sup.Scene))[0];
    
    // Play correct music
    var musicActor = sceneRoot.getChild("Music");
    var musicName = "";
    if (musicActor != null) {
      musicName = (musicActor["musicName"]);
      setBGM(musicName);
    }
    
    Game.playerBehavior.position.x = 0;
    //Game.cameraBehavior.position.x = Game.playerBehavior.position.x;
    //Game.playerBehavior.position.y = -1.2;
    
    Game.playerBehavior.actor.setLocalPosition(Game.playerBehavior.position);
    
    Game.saveGame("auto");
  }
  
  export function openMenu(name: string) {
    var menuPath = "TomE/Debug/" + name + "/Prefab";
    if (Sup.getActor("Menu") != null) {
      Sup.getActor("Menu").destroy();
    }
    
    Sup.appendScene(menuPath);
    menuOpen = true;
  }
  
  export function closeMenu() {
    if (Sup.getActor("Menu") != null) {
      Sup.getActor("Menu").destroy();
    }
    
    menuOpen = false;
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
    //Sup.Audio.playSound("SFX/Pick Up");
    Game.inventory[item] = true;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(1);
  }
    
  export function useItem(item: string) {
    Game.inventory[item] = false;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
  }
  
  export function printUseState(obj: Object) {
    Sup.log("Printing use state object.....");
    for(var roomName in obj) {
      Sup.log("\tROOM: " + roomName);
      var room = obj[roomName];
      for(var itemName in room) {
        var item = room[itemName];
        Sup.log("\t\tITEM: " + itemName + " = " + (item == null ? "NULL" : item ? "TRUE" : "FALSE"));
      }
    }
  }
  
  export function saveGame(idx: string) {
    //unzip use state
    var useKeys = [];
    var useVals = [];
    var i = 0;
    for(var key in Game.perRoomObjectUseStatus) {
      useKeys[i] = key;
      useVals[i] = Game.perRoomObjectUseStatus[key];
      i++;
    }
    //unzip skindices
    var skinKeys = [];
    var skinVals = [];
    for(var key in CharacterList.indices) {
      skinKeys[i] = key;
      skinVals[i] = CharacterList.indices[key];
      i++;
    }
    
    Sup.Storage.setJSON(idx + "_state", Game.state);
    
    Sup.Storage.setJSON(idx + "_usedKeys", useKeys);
    Sup.Storage.setJSON(idx + "_usedVals", useVals);
    
    Sup.Storage.setJSON(idx + "_skinKeys", skinKeys);
    Sup.Storage.setJSON(idx + "_skinVals", skinVals);
    
    Sup.Storage.setJSON(idx + "_room", Game.loadedScene);
    
    Sup.log("Saved game in slot " + idx);
  }
  
  
  
  export function loadGame(idx: string) {
    //if you haven't saved to the slot obviously just skip it
    if (Sup.Storage.getJSON(idx+"_room") == null) {
      return;
    }
    
    //first just clear everything
    Game.newGame();
    
    //now load the saved data
    Game.state = Sup.Storage.getJSON(idx + "_state");
    CharacterList.indices = Sup.Storage.getJSON(idx + "_skins");
    Game.loadedScene = Sup.Storage.getJSON(idx + "_room");
    
    var usedKeys = Sup.Storage.getJSON(idx + "_usedKeys");
    var usedVals = Sup.Storage.getJSON(idx + "_usedVals");
    
    var skinKeys = Sup.Storage.getJSON(idx + "_skinKeys");
    var skinVals = Sup.Storage.getJSON(idx + "_skinVals");
    
    //zip use info
    for (var i = 0; i < usedKeys.length; i++) {
      Game.perRoomObjectUseStatus[usedKeys[i]] = usedVals[i];
    }
    
    //zip skindices
    for (var i = 0; i < skinKeys.length; i++) {
      CharacterList.indices[skinKeys[i]] = skinVals[i];
    }
    
    //and load the room
    Game.restoreScene(Game.loadedScene);
    
    Sup.log("Loaded game from slot " + idx);
  }
}

Game.initialize();
