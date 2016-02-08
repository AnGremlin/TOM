module SceneList {
        
  export var list = [];
  
  list["ScienceRoom"] = "Game/Scenery/ScienceRoom/Prefab";
  list["Cyberspace1"] = "Game/Scenery/Cyberspace1/Prefab";
        
  export function getScene(name: string) {
    if(list[name] != null) return list[name];
    Sup.log("Tried to load bad scene name '" + name + "'!!!");   
    return null;
  }
  
}