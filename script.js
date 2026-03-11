const canvas=document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const fontSize=18;
const colwidth= 35;
let drops=[];

const chars = 'namespace class public private static void string int bool return new using Console WriteLine if else for foreach while try catch async await Task var override interface abstract protected'.split(' ');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / colwidth);
  drops = Array.from({ length: cols }, () => Math.random() * -50);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(11, 12, 16, 0.20)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px Space Mono, monospace';

  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = i * colwidth;

    if (Math.random() > 0.95) {
      ctx.fillStyle = '#e8e9f0';
    } else {
      ctx.fillStyle = 'rgba(232, 160, 32, 1)';
    }

    ctx.fillText(char, x, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
setInterval(drawMatrix, 70);


const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
