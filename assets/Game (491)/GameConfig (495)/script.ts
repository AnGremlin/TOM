module GameConfig{
  
  //PATH to the main menu scene. Can be null, will skip to intro
  export var menuScene = null;//"Game/Menu/Scene";
        
  //PATH to the intro scene. Can be null, will skip to start scene
  export var introScene = "Game/Intro/Scene";
        
  //the name of the scene to load after the intro, as recorded in SceneList. CAN'T be null.
  export var startScene = "ScienceRoom";
        
  //Debug menu keys - set to null (no quotes!) to disable that menu
  export var sceneDebugKey = "M";
  export var invDebugKey = "I"
  export var stateDebugKey = "L";
  export var skinDebugKey = "K";
        
  //If you have any of the debug menus enabled you had better have a key bound for this too!
  export var closeDebugKey = "N"
  
  //This list is used to INITIALIZE the game's state
  export var state = {
    
    //Science Room
    foreshadowTriggered: false,
    listenTriggered: false,
    
  };
  
  //This list is used to INITIALIZE the game's inventory
  //Always modify inventory through the TomE.giveItem and TomE.useItem functions
  export var inventory = { 
    
    "ItemName" : false, 
    "ItemName2" : false, 
    
  };
        
}
