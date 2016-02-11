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
        var branches = [];
        var choiceIds = [];
        var choiceTexts = [];
        
        var playingSound: Sup.Audio.SoundPlayer;
        
        /**
         * Load a script into the manager and run it. 
         * If the script name is invalid an error message will be displayed instead.
         * 
         * @method update
         * @param scene {string} 'name' value of the script to load
         * @param finishDialogBehavior {Sup.Behavior} If a behavior is passed into the function,
         * on completeion of the script 'finishDialog' will be called on the behavior with
         * the name of the script passed in as the textId
         * @public
         */
        export function loadScript(scene: string, finishDialogBehavior?) {
          reset();
          
          scene = CutsceneList.getScene(scene);
          sceneName = scene["name"];
          sceneLines = scene["lines"];
          active = true;
          
          fdBehavior = finishDialogBehavior;
          
          if(TomE.fsdialogBehavior != null)
          {
            TomE.fsdialogBehavior.actor.setVisible(true);
            TomE.fsdialogBehavior.blackoutActor.spriteRenderer.setOpacity(0.8);
          }
        }
        
        /**
         * Initialize all values of the cutscene manager
         * 
         * @method update
         * @public
         */
        export function reset()
        {
          lineIdx = 0;
          sceneLines = [];
          sceneName = "";
          waitingForDialog = false;
          active = false;
          
          leftImage = "Game/Sprites/Blank";
          rightImage = "Game/Sprites/Blank";
          
          leftActor = Sup.getActor("LCSActor");
          if (leftActor != null) {
            leftActor.spriteRenderer.setSprite(leftImage)
            leftActor.setVisible(false);
          } else {
            Sup.log("!!!!! FATAL ERROR: LEFT CUTSCENE ACTOR NOT FOUND")
          }
          
          rightActor = Sup.getActor("RCSActor");
          if (rightActor != null) {
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(false);
          } else {
            Sup.log("!!!!! FATAL ERROR: RIGHT CUTSCENE ACTOR NOT FOUND")
          }
          
          if(TomE.fsdialogBehavior != null)
          {
            TomE.fsdialogBehavior.actor.setVisible(true);
            TomE.fsdialogBehavior.blackoutActor.spriteRenderer.setOpacity(0);
          }
          
          this["finishDialog"] = null;
          branches = [];
          choiceIds = [];
          choiceTexts = [];
        }
        
        /**
         * If a cutscene is active, run the script parser until hitting an END call or a blocking call
         * 
         * @method update
         * @public
         */
        export function update() {
          
          if(active && !waitingForDialog && !waitingForSound) {
            var line = sceneLines[lineIdx];
          
            while(line != null && active && !waitingForDialog && !waitingForSound) {
              parseLine(line);

              lineIdx++;
              line = sceneLines[lineIdx];
            }  
          } else if (active && waitingForDialog) {
            if (!TomE.dialogBehavior.isVisible && !TomE.fsdialogBehavior.isVisible) {
              waitingForDialog = false;
              this["finishDialog"] = null;
              branches = [];
              choiceIds = [];
              choiceTexts = [];
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
        
        /**
         * Takes a script line and parses it into a command
         * 
         * @method parseLine
         * @param line {string} The line to parse
         * @private
         */
        function parseLine(line: string) {
          Sup.log("Cutscene: " + line)
          
          //process any no-arg commands before splitting
          if(line == "END") {
            var fdb = fdBehavior;
            var nombre = sceneName;
            
            exit("BOTH");
            reset();
            
            if(fdb != null) fdb["finishDialog"](nombre,"");
          }
          
          //now split the command from its arguments
          var spaceIdx = line.indexOf(' ');
          if (spaceIdx != -1) {
            var command = line.substr(0,spaceIdx);
            line = line.substr(spaceIdx+1,line.length);
            
            //process the command
            {
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

              } else if (command == "FSD" || command == "FULLSCREENDIALOG") {

                fsd(line);

              }  else if (command == "BRANCH") {

                spaceIdx = line.indexOf(' ');
                var n = parseInt(line.substr(0,spaceIdx));
                line = line.substr(spaceIdx+1,line.length);
                
                spaceIdx = line.indexOf(' ');
                var face = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                branch(face, n, line);

              }  else if (command == "BIFITEM" || command == "BRANCHIFITEM") {

                spaceIdx = line.indexOf(' ');
                var item = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                loadifitem(item, line);

              } else if (command == "ANIMATE") {

                spaceIdx = line.indexOf(' ');
                var side = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                animate(side, line);

              }  else if (command == "SKIN") {

                spaceIdx = line.indexOf(' ');
                var char = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                skin(char, line);

              }  else if (command == "SETBOOL" || command == "SETBOOLEAN") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                setbool(varname, line);

              }  else if (command == "SETSTR" || command == "SETSTRING") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                setstr(varname, line);

              }  else if (command == "SETNUM" || command == "SETNUMBER") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                setnum(varname, line);

              }  else if (command == "BIFBOOL" || command == "BRANCHIFBOOLEAN") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);
                
                spaceIdx = line.indexOf(' ');
                var testval = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                bifbool(varname, testval, line);

              }  else if (command == "BIFNUM" || command == "BRANCHIFNUMBER") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);
                
                spaceIdx = line.indexOf(' ');
                var testval = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                bifnum(varname, testval, line);

              }  else if (command == "BIFSTR" || command == "BRANCHIFSTRING") {

                spaceIdx = line.indexOf(' ');
                var varname = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);
                
                spaceIdx = line.indexOf(' ');
                var testval = line.substr(0,spaceIdx);
                line = line.substr(spaceIdx+1,line.length);

                bifstr(varname, testval, line);

              } else if (command == "EXIT") {
                exit(line);

              } else if (command == "LOAD") {
                load(line);

              } else if (command == "SCENE") {
                scene(line);

              } else if (command == "SFX" || command == "SOUND") {
                sfx(line);

              } else if (command == "BGM" || command == "MUSIC") {
                bgm(line);

              } else if (command == "USE" || command == "REMOVE") {
                use(line);

              } else if (command == "GIVE"  || command == "GET") {
                give(line);

              } else {
                Sup.log("Error in cutscene '" + sceneName + "': bad line at line " + lineIdx);
              }
            }
          }
          
        }
        
         /**
         * Set the current display actor for one side of the cutscene
         * 
         * @method enter
         * @param side {string} Either "RIGHT" or "LEFT"
         * @param art {string} Entry name from the CharacterList file
         * @private
         */
        function enter(side: string, art: string) {
          art = CharacterList.getSprite(art);
          if (side == "LEFT") {
            leftImage = art;
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(true);
          } else if (side == "RIGHT") {
            rightImage = art;
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.spriteRenderer.setHorizontalFlip(true);
            rightActor.setVisible(true);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ENTER command at line " + lineIdx);
          }
        }
        
        /***
         * Set the current animation for one of the current actors in the cutscene
         * 
         * @method animate
         * @param side {string} Either "RIGHT" or "LEFT"
         * @param anim {string} Name of an animation in the character sprite
         * @private
         */
        function animate(side: string, anim: string) {
          if (side == "LEFT") {
            leftActor.spriteRenderer.setAnimation(anim);
          } else if (side == "RIGHT") {
            rightActor.spriteRenderer.setAnimation(anim);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ANIMATE command at line " + lineIdx);
          }
        }
        
        /***
         * Display a basic dialog with a given faceset
         * 
         * @method speak
         * @param faceSet {string} Name of the face set to show
         * @param text {string} The text to be displayed in the dialog
         * @private
         */
        function speak(faceSet: string, text: string) {
          waitingForDialog = true;
          var face = CharacterList.getFace(faceSet); 
          TomE.dialogBehavior.showRaw(face, text, null, null, null);
        }
        
        /***
         * Display a fullscreen dialog
         * 
         * @method fsd
         * @param text {string} The ID of the text to be displayed in the dialog
         * @private
         */
        function fsd(textId: string) {
          waitingForDialog = true;
          TomE.fsdialogBehavior.show(textId,null,null);
        }
        /***
         * Set a character's skin
         * 
         * @method skin
         * @param char {string} The name of the character
         * @param skin {string} The name of the skin to adopt
         * @private
         */
        function skin(char: string, skin: string) {
          CharacterList.setSkin(char,skin.trim());
        }
        
        /***
         * Set a game state variable to a boolean
         * 
         * @method setbool
         * @param varname {string} The name of the variable
         * @param val {string} ideally "true" or "false" but actually only cares if the first letter is a T/t or not
         * @private
         */
        function setbool(varname: string, val: string) {
          TomE.state[varname] = (val[0] == "T" || val[0] == "t");
        }
        
        /***
         * Set a game state variable to a string
         * 
         * @method setstr
         * @param varname {string} The name of the variable
         * @param val {string} Any string
         * @private
         */
        function setstr(varname: string, val: string) {
          TomE.state[varname] = val;
        }
        
        /***
         * Set a game state variable to a number
         * 
         * @method setnum
         * @param varname {string} The name of the variable
         * @param val {string} Any number
         * @private
         */
        function setnum(varname: string, val: string) {
          TomE.state[varname] = Number(val);
        }
        
        /***
         * Clear one or both of the cutscene actors.
         * 
         * @method exit
         * @param side {string} Either "RIGHT" or "LEFT" or "BOTH"
         * @private
         */
        function exit(side: string) {
          if (side == "LEFT") {
            leftImage = "Game/Sprites/Blank";
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(false);
          } else if (side == "RIGHT") {
            rightImage = "Game/Sprites/Blank";
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(false);
          } else if (side == "BOTH") {
            leftImage = "Game/Sprites/Blank";
            leftActor.spriteRenderer.setSprite(leftImage);
            leftActor.setVisible(false);
            rightImage = "Game/Sprites/Blank";
            rightActor.spriteRenderer.setSprite(rightImage);
            rightActor.setVisible(false);
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad ENTER command at line " + lineIdx);
          }
        }
        
        /***
         * Add an item to inventory
         * [cText1,cText2]
         * @method give
         * @param item {string} Name of the item to add
         * @private
         */
        function give(item: string) {
          TomE.getItem(item);
        }
        
        /***
         * Use an item from inventory
         * 
         * @method use
         * @param item {string} Name of the item to add
         * @private
         */
        function use(item: string) {
          TomE.useItem(item);
        }
        
        /***
         * Play a sound effect and wait for it to finish
         * 
         * @method sfx
         * @param sound {string} Name of the effect to play
         * @private
         */
        function sfx(sound: string) {
          playingSound = new Sup.Audio.SoundPlayer(Sup.get("SFX/"+sound, Sup.Sound));
          playingSound.play();
          waitingForSound = true;
        }
        
        /***
         * Play a sound effect and wait for it to finish
         * 
         * @method sfx
         * @param sound {string} Name of the effect to play
         * @private
         */
        function bgm(sound: string) {
          TomE.setBGM(sound);
        }
        
        /***
         * Transition ot another scene
         * 
         * @method scene
         * @param name {string} Path to the scene
         * @param target {string} Target actor on which to center the camera in the new scene
         * @private
         */
        function scene(name: string) {
          fdBehavior = null; //Don't try to call back to destroyed actor!
          TomE.cameraBehavior.transitionToScene(name);
        }
        
        /***
         * Load and run another cutscene script
         * 
         * @method load
         * @param sound {string} Name of the script to load
         * @private
         */
        function load(name: string) {
          Cutscene.loadScript(name, fdBehavior);
        }
        
        /***
         * Load and run another cutscene script IF the player has a certain item.
         * Anything after this call is inherently the "else" clause
         * 
         * @method load
         * @param item {string} Name of the item to check for
         * @param sound {string} Name of the script to load
         * @private
         */
        function loadifitem(item:string, name: string) {
          if (TomE.hasItem(item)) Cutscene.loadScript(name, fdBehavior);
        }
        
        /***
         * Load and run another cutscene script IF a state variable is a certain boolean value
         * Anything after this call is inherently the "else" clause
         * 
         * @method bifbool
         * @param varname {string} Name of the variable to check
         * @param testVal {string} Value to test the state var against. Considered "true" if starts with T/t
         * @param branch {string} Name of the script to load
         * @private
         */
        function bifbool(varname:string, testVal: string, branch:string) {
          if (TomE.state[varname] == (testVal[0] == "T" || testVal[0] == "t")) Cutscene.loadScript(branch, fdBehavior);
        }
        
        /***
         * Load and run another cutscene script IF a state variable is a certain boolean value
         * Anything after this call is inherently the "else" clause
         * 
         * @method bifbool
         * @param varname {string} Name of the variable to check
         * @param testVal {string} Value to test the state var against
         * @param branch {string} Name of the script to load
         * @private
         */
        function bifstr(varname:string, testVal: string, branch:string) {
          if (TomE.state[varname] == testVal) Cutscene.loadScript(branch, fdBehavior);
        }
        
        /***
         * Load and run another cutscene script IF a state variable is a certain boolean value
         * Anything after this call is inherently the "else" clause
         * 
         * @method bifbool
         * @param varname {string} Name of the variable to check
         * @param testVal {string} Value to test the state var against
         * @param branch {string} Name of the script to load
         * @private
         */
        function bifnum(varname:string, testVal: string, branch:string) {
          //I've seen pretty serious FPE while debuging, so give this a tolerance
          if (Math.abs(TomE.state[varname] - Number(testVal)) < 0.0001) Cutscene.loadScript(branch, fdBehavior);
        }
        
        /***
         * Display a dialog with N choices and load a new script depending on the choice selected.
         * Always results in a LOAD command, so any lines after this call will never be reached
         * 
         * @method branch
         * @param faceset {string} face to display on the dialog
         * @param n {number} number of branches
         * @param args {string} A string of five '|'-separated arguments:
         *    * N many names of the script to load, one per choice
         *    * The text to display in the dialog
         *    * N many choice text strings
         * @private
         */
        function branch(faceSet: string, n: number, args: string){
          var argArray = args.split('|');
          if (argArray.length == (2*n + 1)) {
            
            for(var i = 0; i < n; i++) {
              branches[i] = argArray[i];
              branches[i] = branches[i].trim();
              choiceIds[i] = String(i);
            }
            
            var dText = argArray[n];
            
            
            for(var i = 0; i < n; i++) {
              choiceTexts[i] = argArray[n+1+i];
            }
            
            this["finishDialog"] = function(textId: string, choiceid: string) {
              load(branches[parseInt(choiceid)])
            };
            
            waitingForDialog = true;
            var face = CharacterList.getFace(faceSet);
            TomE.dialogBehavior.showRaw(face, dText, choiceIds, choiceTexts, this);
            
          } else {
            Sup.log("Error in cutscene '" + sceneName + "': bad BRANCH command at line " + lineIdx);
          }
        }
}