class CursorBehavior extends Sup.Behavior {
  position = this.actor.getLocalPosition();
  currentSprite = Sup.get("TomE/HUD/Cursor/Normal");

  normalSprite = Sup.get("TomE/HUD/Cursor/Normal", Sup.Sprite);
  interactionSprite = Sup.get("TomE/HUD/Cursor/Interaction", Sup.Sprite);
  bubbleSprite = Sup.get("TomE/HUD/Cursor/Bubble", Sup.Sprite);
  
  update() {
    var mousePosition = Sup.Input.getMousePosition();
    var screenSize = Sup.Input.getScreenSize();
    mousePosition.x *= 10 / 2 * screenSize.x / screenSize.y;
    mousePosition.y *= 10 / 2;
    
    this.position.x = mousePosition.x;
    this.position.y = mousePosition.y;
    this.actor.setLocalPosition(this.position);
    
    var newSprite = this.normalSprite;
    
    if (Game.dialogBehavior != null) {
      if (Game.dialogBehavior.isVisible || Game.fsdialogBehavior.isVisible || Cutscene.active) {
        newSprite = this.normalSprite;
      }else if (Game.playerBehavior.hoveredItem != null) {
        if (Game.playerBehavior.hoveredItem.getBehavior(ItemBehavior).type === "bubble") {
          newSprite = this.bubbleSprite;
        } else {
          newSprite = this.interactionSprite;
        }
      }
    } else {
      newSprite = this.interactionSprite;
    }
    
    if (this.currentSprite !== newSprite) {
      this.currentSprite = newSprite;
      this.actor.spriteRenderer.setSprite(newSprite);
      
      if (newSprite === this.bubbleSprite) {
        this.actor.spriteRenderer.setAnimation("Animation");
      }
    }
  }
}
Sup.registerBehavior(CursorBehavior);