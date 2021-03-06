class Bike {
  constructor(x, y, radius, arcStart, xDir, yDir, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.arcStart = arcStart;
    this.xDir = xDir;
    this.yDir = yDir;
    this.color = color;
    this.pOneDirection = this.pOneDirection.bind(this);
    this.pTwoDirection = this.pTwoDirection.bind(this);
    this.tail = [];
    this.crashed = false;
    this.lives = 5;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, this.arcStart, Math.PI * 2, false);
    context.fill();
    context.fillStyle = this.color;
    return this;
  }

  move() {
    this.x += this.xDir;
    this.y += this.yDir;
    if (this.xDir === 0) {
      for (var i = 0; i <= Math.abs(this.yDir) - 1; i++) {
        let increment = this.yDir > 0 ? i : -i;
        this.tail.push({ x: this.x, y: this.y + increment });
      }
    } else {
      for (var j = 0; j <= Math.abs(this.xDir) - 1; j++) {
        let increment = this.xDir > 0 ? j : -j;
        this.tail.push({ x: this.x + increment, y: this.y });
      }
    }
    return this;
  }

  clearTail(context) {
    if (this.tail.length > 1200) {
      var velocity = this.getVelocity();
      for (var i = 0; i < velocity; i++) {
        var coords = this.tail.shift();
        context.beginPath();
        context.clearRect(coords.x - this.radius - 1, coords.y - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
        context.closePath();
      }
    }
  }

  changeDirection(new_xDir, new_yDir) {
    if (this.preventSelfTrace(new_xDir, new_yDir)) {
      return;
    }
    this.xDir = new_xDir;
    this.yDir = new_yDir;
  }

  pTwoDirection(e) {
    if (e.keyCode == 37) {
      e.preventDefault();
      this.changeDirection(-3, 0);
    }

    if (e.keyCode == 38) {
      e.preventDefault();
      this.changeDirection(0, -3);
    }

    if (e.keyCode == 39) {
      e.preventDefault();
      this.changeDirection(3, 0);
    }

    if (e.keyCode == 40) {
      e.preventDefault();
      this.changeDirection(0, 3);
    }
  }

  pOneDirection(e) {
    if (e.keyCode == 65) {
      this.changeDirection(-3, 0);
    }

    if (e.keyCode == 87) {
      this.changeDirection(0, -3);
    }

    if (e.keyCode == 68) {
      this.changeDirection(3, 0);
    }

    if (e.keyCode == 83) {
      this.changeDirection(0, 3);
    }
  }

  sideCollision() {
    if (this.x < 10 || this.x > 840) {
      this.xDir = 0;
      this.yDir = 0;
      this.crashed = true;
    }
  }

  verticalCollision() {
    if (this.y < 10 || this.y > 625) {
      this.xDir = 0;
      this.yDir = 0;
      this.crashed = true;
    }
  }

  distanceBetween(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  distanceBetweenSelf() {
    var velocity = this.getVelocity();
    for (var i = 0; i < this.tail.length - velocity * this.radius - 1; i++) {
      let trailCoordinate = this.tail[i];
      if (this.distanceBetween(this.x, this.y, trailCoordinate.x, trailCoordinate.y) < this.radius * 2) {
        this.crashed = true;
      }
    }
  }

  collisionDetection(oppositeBike) {
    for (var i = 0; i < oppositeBike.tail.length - 1; i++) {
      let trailCoordinate = oppositeBike.tail[i];
      if (this.distanceBetween(this.x, this.y, trailCoordinate.x, trailCoordinate.y) < this.radius * 2) {
        this.crashed = true;
      }
    }
    return false;
  }

  preventSelfTrace(xDir, yDir) {
    var velocity = this.getVelocity();
    if (Math.abs(this.xDir - xDir) > velocity || Math.abs(this.yDir - yDir) > velocity) {
      return true;
    }
    return false
  }

  loseLife(domEl) { 
    domEl.innerText = this.lives;
  }

  getVelocity() {
    return Math.max(Math.abs(this.xDir), Math.abs(this.yDir));
  }

  // playAudio(audio) {
  //   audio.play();
  // }  
}

module.exports = Bike;