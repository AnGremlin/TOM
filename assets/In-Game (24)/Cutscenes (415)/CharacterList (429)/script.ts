module CharacterList {
  export var list = [];
        
  list["RobotTom"] = "In-Game/Pnj/RobotTom";
  list["AngelTom"] = "In-Game/Pnj/AngelTom";
  list["Silas"] = "In-Game/Pnj/Silas";
  list["KetchupKids"] = "In-Game/Pnj/KetchupKids";
        
  export function getSprite(name: string) {
    if(list[name] != null) return list[name];
    else return "Blank";
  }
}