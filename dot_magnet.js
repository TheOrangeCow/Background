const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initDots();
}

class Dot {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.originalX = x;
    this.originalY = y;
    this.distance = 0;
    this.maxDistance = 150;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;

    if (this.distance < maxDistance) {
      const angle = Math.atan2(dy, dx);
      const force = (1 - (this.distance / maxDistance)) * 5;
      this.x += Math.cos(angle) * force;
      this.y += Math.sin(angle) * force;
    } else {
      this.x += this.dx;
      this.y += this.dy;
    }

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.draw();
  }
}

let dots = [];
let mouseX = 0;
let mouseY = 0;

function initDots() {
  dots = [];
  const numDots = Math.floor(window.innerWidth / 10);
  for (let i = 0; i < numDots; i++) {
    const radius = Math.random() * 3 + 1;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = '#ffffff';
    dots.push(new Dot(x, y, radius, color));
  }
}

function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = 'rgba(250, 250, 250, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < dots.length; i++) {
    dots[i].update(mouseX, mouseY);
  }
  connectDots();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

resizeCanvas();
animate();
