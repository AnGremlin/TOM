module Cutscene {
        export var lineIdx = 0;
        export var sceneLines = [];
        export var sceneName = "";
        export var active = false;
        export var waitingForDialog = false;
        export var waitingForSound = false;
        
        export var leftActor: Sup.Actor;
        export var leftImage: string;
        
        export var rightActor: Sup.Actor;
        export var rightImage: string;
        
        var fdBehavior: Sup.Behavior;
        
        var playingSound: Sup.Audio.SoundPlayer;
        
        export function test() {
          loadScript("test");
        }
        
        export function loadScript(scene: string, finishDialogBehavior?) {
          reset();
          
          scene = CutsceneList.getScene(scene);
          sceneName = scene["name"];
          sceneLines = scene["lines"];
          active = true;
          
          fdBehavior = finishDialogBehavior;
          
          if(Game.fsdialogBehavior != null)
          {
            Game.fsdialogBehavior.actor.setVisible(true);
            Game.fsdialogBehavior.blackoutActor.spriteRenderer.setOpacity(0.8);
          }
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
          
          if(Game.fsdialogBehavior != null)
          {
            Game.fsdialogBehavior.actor.setVisible(true);
            Game.fsdialogBehavior.blackoutActor.spriteRenderer.setOpacity(0);
          }
        }
        
        export function update() {
          
          if(active && !waitingForDialog && !waitingForSound) {
            var line = sceneLines[lineIdx];
          
            while(line != null && active && !waitingForDialog && !waitingForSound) {
              parseLine(line);

              lineIdx++;
              line = sceneLines[lineIdx];
            }  
          } else if (active && waitingForDialog) {
            if (!Game.dialogBehavior.isVisible && !Game.fsdialogBehavior.isVisible) {
              waitingForDialog = false;
              var line = sceneLines[lineIdx];

              while(line != null && active && !waitingForDialog && !waitingForSound) {
                parseLine(line);

                lineIdx++;
                line = sceneLines[lineIdx];
              }
            }
          } else if (active && waitingForSound) {
            if (playingSound == null || !playingSound.isPlaying()) {
              waitingForSound = false;
              playingSound = null;
              var line = sceneLines[lineIdx];

              while(line != null && active && !waitingForDialog && !waitingForSound) {
                parseLine(line);

                lineIdx++;
                line = sceneLines[lineIdx];
              }
            }
          }
          
        }
        
        function parseLine(line: string) {
          Sup.log("Cutscene: " + line)
          if(line == "END") {
            var fdb = fdBehavior;
            var nombre = sceneName;
            
            exit("BOTH");
            reset();
            
            if(fdb != null) fdb["finishDialog"](nombre,"");
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
              
            }  else if (command == "LOADIFITEM") {
              
              spaceIdx = line.indexOf(' ');
              var item = line.substr(0,spaceIdx);
              line = line.substr(spaceIdx+1,line.length);
              
              loadifitem(item, line);
              
            } else if (command == "ANIMATE") {
              
              spaceIdx = line.indexOf(' ');
              var side = line.substr(0,spaceIdx);
              line = line.substr(spaceIdx+1,line.length);
              
              animate(side, line);
              
            } else if (command == "EXIT") {
              exit(line);
              
            } else if (command == "LOAD") {
              load(line);
              
            } else if (command == "SCENE") {
              scene(line, "Background");
              
            }  else if (command == "SFX") {
              sfx(line);
              
            }  else if (command == "USE") {
              use(line);
              
            }  else if (command == "GIVE") {
              give(line);
              
            }  else {
              Sup.log("Error in cutscene '" + sceneName + "': bad line at line " + lineIdx);
            }
            
          }
          
        }
        
        function enter(side: string, art: string) {
          art = CharacterList.getSprite(art);
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
        
        function give(item: string) {
          Game.getItem(item);
        }
        
        function use(item: string) {
          Game.useItem(item);
        }
        
        function sfx(sound: string) {
          playingSound = new Sup.Audio.SoundPlayer(Sup.get("SFX/"+sound, Sup.Sound));
          playingSound.play();
          waitingForSound = true;
        }
        
        function scene(name: string, target: string) {
          fdBehavior = null; //Don't try to call back to destroyed actor!
          Game.cameraBehavior.transitionToScene(name, target);
        }
        
        function load(name: string) {
          Cutscene.loadScript(name, fdBehavior);
        }
        
        function loadifitem(item:string, name: string) {
          if(Game.hasItem(item)) Cutscene.loadScript(name, fdBehavior);
        }
}