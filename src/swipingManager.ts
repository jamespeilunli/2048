class SwipingManager {
  startX: number = 0;
  startY: number = 0;
  endX: number = 0;
  endY: number = 0;
  threshold: number;
  onSwipe: (direction: Direction) => void;

  constructor(onSwipe: (direction: Direction) => void, threshold = 20) {
    this.onSwipe = onSwipe;
    this.threshold = threshold;

    document.addEventListener('touchstart', e => {
      this.startX = e.changedTouches[0].screenX;
      this.startY = e.changedTouches[0].screenY;
      if ((e.target as HTMLElement).nodeName !== 'INPUT') {
        e.preventDefault();
      }
    });

    document.addEventListener('touchend', e => {
      this.endX = e.changedTouches[0].screenX;
      this.endY = e.changedTouches[0].screenY;
      this.updateDirection();
    });
  }

  updateDirection() {
    let dx = this.endX - this.startX;
    let dy = this.endY - this.startY;

    if (Math.abs(dx) < this.threshold && Math.abs(dy) < this.threshold) return;

    let direction: Direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) direction = "Right";
      else direction = "Left";
    } else {
      if (dy > 0) direction = "Down";
      else direction = "Up";
    }

    this.onSwipe(direction);
  }
}
