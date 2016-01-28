class PlayerBehavior extends Sup.Behavior {
  baseSpeed = 20;//0.05;

  position = this.actor.getLocalPosition();
  moveOffset = new Sup.Math.Vector3(0,0,0);
  moveTargetX: number = null;
  scale = this.actor.getLocalScale();
  canMove = false;
  autoPilot = false;

  mousePosition = new Sup.Math.Vector3(0,0,0);
  hoveredItem: Sup.Actor;
  targetItem: Sup.Actor;
  activateDistance = 100;

  awake() {
    Game.playerBehavior = this;
  }

  update() {    
    let mousePosition = Sup.Input.getMousePosition();
    let screenSize = Sup.Input.getScreenSize();

    mousePosition.x *= 10 / 2 * screenSize.x / screenSize.y;
    mousePosition.x += Game.cameraBehavior.position.x;
    mousePosition.y *= 10 / 2;
    mousePosition.y += Game.cameraBehavior.position.y;

    this.mousePosition.set(mousePosition.x, mousePosition.y, 0);

    if (!this.canMove) {
      return;
    }
    
    this.interaction();
  }
  
  clearMovement() {
    this.moveTargetX = null;
    this.moveOffset.x = 0;
    this.targetItem = null;
    this.autoPilot = false;
  }
    
  interaction() {
    // Update interactions
    let closestItem: Sup.Actor = null;
    let minDistance = 1000;
    
    Game.itemBehaviors.forEach((itemBehavior) => {
      let diff = this.mousePosition.clone().subtract(itemBehavior.position);
      diff.x -= itemBehavior.hitbox.offsetX;
      diff.y -= itemBehavior.hitbox.offsetY;
      let distance = diff.length();
      
      if (Math.abs(diff.x) < itemBehavior.hitbox.width && Math.abs(diff.y) < itemBehavior.hitbox.height) {
        minDistance = distance;
        closestItem = itemBehavior.actor;
      }
    });
    
    if (closestItem == null && this.hoveredItem != null) {
      this.hoveredItem.getBehavior(ItemBehavior).hover(false);
      this.hoveredItem = null;
    }
    
    if (closestItem != null && closestItem != this.hoveredItem) {
      if (this.hoveredItem != null) {
        this.hoveredItem.getBehavior(ItemBehavior).hover(false)
      }
        
      this.hoveredItem = closestItem;
      this.hoveredItem.getBehavior(ItemBehavior).hover(true);
      new Sup.Audio.SoundPlayer(Game.hoverSound).play();
    }
    
    if (Game.dialogBehavior.closedTimer > 2 && Game.fsdialogBehavior.closedTimer > 2 && !Cutscene.active) {
      
      if (Sup.Input.wasMouseButtonJustReleased(0) || Sup.Input.wasKeyJustPressed("SPACE")) {
        this.targetItem = this.hoveredItem;
        if (this.targetItem != null) {
          this.activateItem(this.targetItem);
          new Sup.Audio.SoundPlayer(Game.selectSound).play();
        }
      }
      
    }
  }
  
  activateItem(item: Sup.Actor) {
    if (item["actionBehavior"] == null) {
      Sup.log("ActionBehavior isn't defined");
    } else {
      if (item.getBehavior(ItemBehavior).position.x > this.position.x) {
        this.scale.x = 1;
      } else {
        this.scale.x = -1;
      }
      this.actor.setLocalScale(this.scale);

      this.clearMovement();
      item["actionBehavior"].activate();
    }
  }

}
Sup.registerBehavior(PlayerBehavior);
