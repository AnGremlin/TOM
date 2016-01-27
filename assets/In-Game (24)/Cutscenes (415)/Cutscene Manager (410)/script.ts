module Cutscene {
        export var lineIdx = 0;
        export var sceneLines = [];
        export var sceneName = "";
        export var active = false;
        export var waitingForDialog = false;
        
        export var leftActor: Sup.Actor;
        export var leftImage: string;
        
        export var rightActor: Sup.Actor;
        export var rightImage: string;
        
        export function test() {
          loadScript(TestCutscene);
        }
        
        export function loadScript(scene) {
          reset();
          
          sceneName = scene["name"];
          sceneLines = scene["lines"];
          active = true;
          
          //Game.cameraBehavior.blackscreenTargetOpacity = 0.5;
        }
        
        export function reset()
        {
          lineIdx = 0;
          sceneLines = [];
          sceneName = "";
          waitingForDialog = false;
          active = false;
          
          leftImage = "Blank";
          rightImage = "Blank";
          
          leftActor = Sup.getActor("LCSActor");
          leftActor.spriteRenderer.setSprite(leftImage)
          leftActor.setVisible(false);
          
          rightActor = Sup.getActor("RCSActor");
          rightActor.spriteRenderer.setSprite(rightImage);
          rightActor.setVisible(false);
          
          //Game.cameraBehavior.blackscreenTargetOpacity = 0;
        }
        
        export function update() {
          
          if(active && !waitingForDialog) {
            var line = sceneLines[lineIdx];
          
            while(line != null && active && !waitingForDialog) {
              parseLine(line);

              lineIdx++;
              line = sceneLines[lineIdx];
            }  
          } else if (active && waitingForDialog) {
            if (!Game.dialogBehavior.isVisible && !Game.fsdialogBehavior.isVisible) {
              waitingForDialog = false;
              var line = sceneLines[lineIdx];

              while(line != null && active && !waitingForDialog) {
                parseLine(line);

                lineIdx++;
                line = sceneLines[lineIdx];
              }
            }
          }
          
        }
        
        function parseLine(line: string) {
          if(line == "END") {
            exit("BOTH");
            reset();
          }
          var spaceIdx = line.indexOf(' ');
          if (spaceIdx != -1) {
            var command = line.substr(0,spaceIdx);
            line = line.substr(spaceIdx+1,line.length);
            
            if (command == "ENTER") {
              
              spaceIdx = line.indexOf(' ');
              var side = line.substr(0,spaceIdx);
              line = line.substr(spaceIdx+1,line.length);
              
              enter(side, line);
              
            } else if (command == "SPEAK") {
              
              spaceIdx = line.indexOf(' ');
              var face = line.substr(0,spaceIdx);
              line = line.substr(spaceIdx+1,line.length);
              
              speak(face, line);
              
            } else if (command == "ANIMATE") {
              
              spaceIdx = line.indexOf(' ');
              var side = line.substr(0,spaceIdx);
              line = line.substr(spaceIdx+1,line.length);
              
              animate(side, line);
              
            } else if (command == "EXIT") {
              exit(line);
              
            }  else {
              Sup.log("Error in cutscene '" + sceneName + "': bad line at line " + lineIdx);
            }
            
          }
          
        }
        
        function enter(side: string, art: string) {
          if (side == "LEFT") {
            leftImage = art;
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(true);
          } else if (side == "RIGHT") {
            rightImage = art;
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(true);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ENTER command at line " + lineIdx);
          }
        }
        
        function animate(side: string, anim: string) {
          if (side == "LEFT") {
            leftActor.spriteRenderer.setAnimation(anim);
          } else if (side == "RIGHT") {
            rightActor.spriteRenderer.setAnimation(anim);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ANIMATE command at line " + lineIdx);
          }
        }
        
        function speak(faceSet: string, text: string) {
          waitingForDialog = true;
          Game.dialogBehavior.showRaw(faceSet, text, null, null, null);
        }
        
        function exit(side: string) {
          if (side == "LEFT") {
            leftImage = "Blank";
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(false);
          } else if (side == "RIGHT") {
            rightImage = "Blank";
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(false);
          } else if (side == "BOTH") {
            leftImage = "Blank";
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(false);
            rightImage = "Blank";
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(false);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ENTER command at line " + lineIdx);
          }
        }
}