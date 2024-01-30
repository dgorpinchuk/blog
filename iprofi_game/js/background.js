document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "img/background1.jpg",
    "img/background2.jpg",
    "img/background3.jpg",
    "img/background4.jpg",
    "img/background5.jpg",
    "img/background6.jpg",
  ];

  function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  function setRandomBackground() {
    const randomImage = getRandomImage();
    document.body.style.backgroundImage = `url(${randomImage})`;
  }

  // Set initial random background
  setRandomBackground();

  // Optionally, you can change the background periodically
  // setInterval(setRandomBackground, 5000); // Change background every 5 seconds (adjust as needed)
});
