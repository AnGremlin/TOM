module SceneList {
        
  export var list = [];
        
  export function getScene(name: string) {
    if(list[name] != null) return list[name];
    Sup.log("Tried to load bad scene name '" + name + "'!!!");   
    return null;
  }
  
  export function buildList() {
    for (var s in SceneListData.scenes) {
      list[SceneListData.scenes[s][0]] = SceneListData.scenes[s][1];
    }
  }
  
}