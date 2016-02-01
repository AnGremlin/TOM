module CharacterList {
  export var list = [];
        
  list["RobotTom"] = "In-Game/Pnj/TomNew";
  list["AngelTom"] = "In-Game/Pnj/AngelTom";
  list["Silas"] = "In-Game/Pnj/SilasNew";
  list["KetchupKids"] = "In-Game/Pnj/KetchupKids";
  list["Security"] = "In-Game/Pnj/Security";
        
  export function getSprite(name: string) {
    if(list[name] != null) return list[name];
    else return "Blank";
  }
}