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
    CutsceneListData.scenes.forEach( (s, i) => {
      add(s);
      //Sup.log("Cutscene " + i + ": " + s["name"]);
    });
  }
        
        
}
