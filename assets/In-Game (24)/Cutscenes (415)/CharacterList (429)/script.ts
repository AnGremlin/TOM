module CharacterList {
  export var skins = [];
  export var faces = [];
  export var indices = [];
  export var names = [];
        
  skins["RobotTom"] = ["In-Game/Pnj/Tom/Normal","In-Game/Pnj/Tom/Red","In-Game/Pnj/Tom/Blue",];
  faces["RobotTom"] = ["Tom/Normal","Tom/Red","Tom/Blue",];
  names["RobotTom"] = ["Normal", "Red", "Blue",];
  indices["RobotTom"] = 0;
        
  skins["AngelTom"] = ["In-Game/Pnj/AngelTom"]
  faces["AngelTom"] = ["TomBlank"];
  names["AngelTom"] = ["Normal"];
  indices["AngelTom"] = 0;
        
  skins["Silas"] = ["In-Game/Pnj/SilasNew"];
  faces["Silas"] = ["Silas/Face"];
  names["Silas"] = ["Normal"];
  indices["Silas"] = 0;
        
  skins["KetchupKids"] = ["In-Game/Pnj/KetchupKids"];
  faces["KetchupKids"] = ["TomBlank"]
  names["KetchupKids"] = ["Normal"];
  indices["KetchupKids"] = 0;
        
  export function getSprite(name: string) {
    if(indices[name] == null) return "Blank";
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
        
}