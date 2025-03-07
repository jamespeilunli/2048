"use strict";
class SwipingManager {
    constructor(onSwipe, threshold = 20) {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.swiped = false;
        this.onSwipe = onSwipe;
        this.threshold = threshold;
        document.addEventListener('touchstart', e => {
            this.swiped = false;
            this.startX = e.changedTouches[0].screenX;
            this.startY = e.changedTouches[0].screenY;
        });
        document.addEventListener('touchmove', e => {
            this.endX = e.changedTouches[0].screenX;
            this.endY = e.changedTouches[0].screenY;
            this.updateDirection();
        });
    }
    updateDirection() {
        if (this.swiped)
            return;
        let dx = this.endX - this.startX;
        let dy = this.endY - this.startY;
        if (Math.abs(dx) < this.threshold && Math.abs(dy) < this.threshold)
            return;
        let direction;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0)
                direction = "Right";
            else
                direction = "Left";
        }
        else {
            if (dy > 0)
                direction = "Down";
            else
                direction = "Up";
        }
        this.onSwipe(direction);
        this.swiped = true;
    }
}
