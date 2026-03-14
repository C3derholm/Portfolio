const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const fontSize = 18;
const colwidth = 35;
let drops = [];

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

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  let isValid = true;

  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  if (name.value.trim() === '') {
    document.getElementById('name-error').textContent = 'Vänligen fyll i Namn';
    isValid = false;
  } else if (!/^[a-zA-ZåäöÅÄÖ\s]+$/.test(name.value.trim())) {
    document.getElementById('name-error').textContent = 'Namnet får endast innehålla bokstäver';
    isValid = false;
  }

  if (email.value.trim() === '') {
    document.getElementById('email-error').textContent = 'E-postadress är obligatorisk.';
    isValid = false;
  } else if (!email.value.includes('@')) {
    document.getElementById('email-error').textContent = 'Ange en giltig e-postadress.';
    isValid = false;
  }

  if (message.value.trim() === '') {
    document.getElementById('message-error').textContent = 'Meddelande är obligatoriskt.';
    isValid = false;
  }

  if (!isValid) return;

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

async function getWeather() {
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "d460b875a4f7f31a722c38d627ecc822";
  
   navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=sv`;
    

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Nätverksrespons var inte ok");
    }
    const data = await response.json();
    const temperature = Math.round(data.main.temp);
    const location = data.name;
    const icon = data.weather[0].icon;
    const color = temperature <= 0 ? "#6fb3f5" : "#e8a020";
    const weatherInfoElement = document.getElementById("weather-data");
    weatherInfoElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="väderikon"> Temperaturen i ${location} är ${temperature}°C.`;
    weatherInfoElement.style.color = color;
  } catch (error) {
    console.error("Det gick inte att hämta väderdata:", error);
  }
});
}

getWeather();
setInterval(getWeather, 60000);