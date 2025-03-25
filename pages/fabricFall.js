// Simplified fabric slide drop animation
const canvas = document.createElement('canvas');
canvas.id = 'fabricCanvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
const cloth_width = 40;
const cloth_height = 20;
const spacing = 12;
const gravity = 900;
let animationRunning = true;

class Point {
  constructor(x, y, pinned = false) {
    this.x = x;
    this.y = y;
    this.oldx = x;
    this.oldy = y;
    this.pinned = pinned;
  }

  update(dt) {
    if (this.pinned) return;
    const vx = this.x - this.oldx;
    const vy = this.y - this.oldy;

    this.oldx = this.x;
    this.oldy = this.y;

    this.x += vx;
    this.y += vy + gravity * dt * dt;
  }

  constrain() {
    if (this.y > canvas.height) {
      this.y = canvas.height;
    }
  }
}

function initCloth() {
  const offsetX = canvas.width / 2 - (cloth_width * spacing) / 2;
  const offsetY = 100;

  for (let y = 0; y <= cloth_height; y++) {
    for (let x = 0; x <= cloth_width; x++) {
      const pinned = y === 0;
      points.push(new Point(offsetX + x * spacing, offsetY + y * spacing, pinned));
    }
  }
}

function update() {
  const dt = 0.016;
  points.forEach((p) => p.update(dt));
  points.forEach((p) => p.constrain());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#555';
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

function animate() {
  if (!animationRunning) return;
  update();
  draw();
  requestAnimationFrame(animate);
}

function cutTopRow() {
  for (let i = 0; i <= cloth_width; i++) {
    points[i].pinned = false;
  }
  setTimeout(() => {
    animationRunning = false;
    document.getElementById('page_container').style.display = 'none';
    loadPage('projects');
  }, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
  initCloth();
  animate();

  const triggerBtn = document.getElementById('nextButton');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', cutTopRow);
  }
});
