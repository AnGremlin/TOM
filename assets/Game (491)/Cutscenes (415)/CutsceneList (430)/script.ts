module CutsceneList {
  
  export var scenes = [];
        
  export function getScene(name: string) {
    if(scenes[name] != null) return scenes[name];
    else return scenes["error"];
  }
  
  function add(scene) {
    scenes[scene["name"]] = scene;
  }
        
  export function buildList()
  {
    //UTILITY
    add(TestCutscene);
    add(TestCutsceneA);
    add(TestCutsceneB);
    add(TestCutsceneC);
    add(ErrorCutscene); 
    
    //Skin test
    add(SkinTestStart);
    add(SkinTestBlack);
    add(SkinTestRed);
    add(SkinTestBlue);
    
    //Science Room
    add(ScienceRoomForeshadow);
    add(ScienceRoomUsedAll);
    add(ScienceRoomListen);
    add(ScienceRoomFuckAlone);
    add(ScienceRoomWant);
    add(ScienceRoomFuckYou);
  }
        
        
}
