// Elements
const content = document.querySelector(".content");
const leftBtn = document.querySelector("#left-btn");
const rightBtn = document.querySelector("#right-btn");
const darkModeBtn = document.querySelector(".dark-mode-btn");
const suraSelect = document.getElementById("souraSelect");
const ayahSelect = document.getElementById("ayahSelect");
const audio = document.getElementById("myAudio");
const audioBtn = document.getElementById("audioBtn");

// Variables
let surahsIndex = 0;
let ayahsIndex = 0;
let data; // Store fetched data

// Fetch all ayahs
const fetchAllAyahs = async () => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/quran/ar.alafasy`
    );
    const jsonData = await response.json();
    data = jsonData.data;
    // Store fetched data
    document.getElementById("loader").style.display = "none";
    // Hide the loader once the data is fetched
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Display current ayah
const displayAyah = () => {
  content.textContent = data.surahs[surahsIndex].ayahs[ayahsIndex].text;
  audio.src = data.surahs[surahsIndex].ayahs[ayahsIndex].audio;
};

// Move to previous ayah or previous surah if the current surah is finished
const leftMove = () => {
  if (ayahsIndex > 0) {
    ayahsIndex--;
    rightBtn.style.opacity = 1;
  } else if (surahsIndex > 0) {
    surahsIndex--;
    ayahsIndex = data.surahs[surahsIndex].ayahs.length - 1;
    rightBtn.style.opacity = 1;
  } else {
    leftBtn.style.opacity = 0.5;
    return;
  }
  updateDropdownValues();
  // Update dropdown values
  displayAyah();
};

// Move to next ayah or next surah if the current surah is finished
const rightMove = () => {
  if (ayahsIndex < data.surahs[surahsIndex].ayahs.length - 1) {
    ayahsIndex++;
    leftBtn.style.opacity = 1;
  } else if (surahsIndex < data.surahs.length - 1) {
    surahsIndex++;
    ayahsIndex = 0;
    leftBtn.style.opacity = 1;
  } else {
    rightBtn.style.opacity = 0.5;
    return;
  }
  updateDropdownValues(); 
  // Update dropdown values
  displayAyah();
};

// Update dropdown values
const updateDropdownValues = () => {
  suraSelect.value = surahsIndex;
  ayahSelect.value = ayahsIndex + 1; // values start from 1
};

// Toggle dark mode
const toggleDarkMode = () => {
  if (localStorage["mode"] === "light") {
    document.body.classList.add("dark");
    localStorage["mode"] = "dark";
  } else {
    document.body.classList.remove("dark");
    localStorage["mode"] = "light";
  }
};

// Populate surah dropdown
const populateSurahDropdown = () => {
  data.surahs.forEach((surah, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = surah.name;
    suraSelect.appendChild(option);
  });
};

// Populate ayah lists based on selected surah
const populateAyahDropdown = () => {
  const selectedSurahIndex = parseInt(suraSelect.value);
  const ayahCount = data.surahs[selectedSurahIndex].ayahs.length;
  ayahSelect.innerHTML = "";
  // Clear previous options
  for (let i = 1; i <= ayahCount; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `آية ${i}`;
    ayahSelect.appendChild(option);
  }
};

// Event listeners
leftBtn.addEventListener("click", leftMove);
rightBtn.addEventListener("click", rightMove);
darkModeBtn.addEventListener("click", toggleDarkMode);
suraSelect.addEventListener("change", () => {
  surahsIndex = parseInt(suraSelect.value);
  ayahsIndex = 0;
  // Reset ayahsIndex
  populateAyahDropdown();
  // Populate ayah lists based on selected surah
  displayAyah();
  // Display first ayah of selected surah
});
ayahSelect.addEventListener("change", () => {
  ayahsIndex = parseInt(ayahSelect.value) - 1;

  displayAyah();
});
audioBtn.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});
audio.onended = rightMove;

// Play audio
const playAudio = () => {
  audio.play();
  audioBtn.classList.remove("fa-play");
  audioBtn.classList.add("fa-pause");
};

// Pause audio
const pauseAudio = () => {
  audio.pause();
  audioBtn.classList.remove("fa-pause");
  audioBtn.classList.add("fa-play");
};

window.addEventListener("load", async () => {
  if (localStorage["mode"] === "dark") {
    document.body.classList.add("dark");
  }
  await fetchAllAyahs();
  populateSurahDropdown();
  populateAyahDropdown();
  displayAyah();
});
