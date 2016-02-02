module SceneList {
  export var list = [];
  
  //THIS LIST IS ONLY USED FOR THE DEBUG MENU. ANYTHING IN IT CAN BE JUMPED TO.
  list["Science Room"] = "In-Game/Scenery/ScienceRoom/Prefab";
  list["Cyberspace 1"] = "In-Game/Scenery/Cyberspace1/Prefab";
        
  export function getScene(name: string) {
    if(list[name] != null) return list[name];
    else return "Blank";
  }
}