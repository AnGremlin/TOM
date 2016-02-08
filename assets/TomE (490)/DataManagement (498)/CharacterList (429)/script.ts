module CharacterList {
  export var skins = [];
  export var faces = [];
  export var indices = [];
  export var names = [];
        
  export function getSprite(name: string) {
    if(indices[name] == null) return "Game/Sprites/Blank";
    return skins[name][indices[name]];
  }
        
  export function getFace(name: string) {
    if(name == "TomBlank" || indices[name] == null) return "TomBlank";
    return faces[name][indices[name]];
  }
        
  export function setSkin(charName: string, skinName: string) {
    if(names[charName] != null && names[charName].indexOf(skinName) != -1) {
      indices[charName] = names[charName].indexOf(skinName);
    }
  }     
  
  export function nextSkin(charName: string): string {
    if(names[charName] != null) {
      indices[charName] = (indices[charName] + 1) % skins[charName].length;
      return names[charName][indices[charName]];
    }
  }   
  
  export function prevSkin(charName: string): string {
    if(names[charName] != null) {
      indices[charName] = (indices[charName] - 1) % skins[charName].length;
      return names[charName][indices[charName]];
    }
  }
  
  export function buildList() {
    for (var s in CharacterListData.names) {
      names[s] = CharacterListData.names[s];
      indices[s] = 0; 
    }
    
    for (var s in CharacterListData.skins) {
      skins[s] = CharacterListData.skins[s];
    }
    
    for (var s in CharacterListData.faces) {
      faces[s] = CharacterListData.faces[s];
    }
  }
        
}