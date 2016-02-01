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

    //spencers test room
    add(SecurityExitStop);
    add(SecurityExitPass);   
    
    //Science Room
    add(ScienceRoomUsedAll);
    add(ScienceRoomListen);
    add(ScienceRoomFuckAlone);
    add(ScienceRoomWant);
    add(ScienceRoomFuckYou);
  }
        
        
}
