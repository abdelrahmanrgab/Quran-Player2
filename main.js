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
let data;

// Fetch all ayahs
const fetchAllAyahs = async () => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/quran/ar.alafasy`
    );
    const jsonData = await response.json();
    data = jsonData.data;
    localStorage.setItem("quranData", JSON.stringify(data));
    localStorage.setItem("surahsIndex", surahsIndex);
    localStorage.setItem("ayahsIndex", ayahsIndex);
    document.getElementById("loader").style.display = "none"; // Hide loader
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

//_______________________________________
// Event listener for window load event
window.addEventListener("load", async () => {
  // Check if dark mode is enabled
  if (localStorage["mode"] === "dark") document.body.classList.add("dark");
  const storedData = localStorage.getItem("quranData");
  const storedSurahsIndex = localStorage.getItem("surahsIndex");
  const storedAyahsIndex = localStorage.getItem("ayahsIndex");
  if (storedData && storedSurahsIndex && storedAyahsIndex) {
    // Use stored data and indices if available
    data = JSON.parse(storedData);
    surahsIndex = parseInt(storedSurahsIndex);
    ayahsIndex = parseInt(storedAyahsIndex);
    populateSurahDropdown();
    populateAyahDropdown(surahsIndex);
    displayAyah();
    suraSelect.value = surahsIndex; // Set surah dropdown value
    ayahSelect.value = ayahsIndex + 1; // Set ayah dropdown value
    document.getElementById("loader").style.display = "none"; // Hide loader
  } else {
    // Fetch data if not in local storage
    await fetchAllAyahs();
    populateSurahDropdown();
    populateAyahDropdown(surahsIndex);
    displayAyah();
  }
});
//_______________________________________
// Display current ayah
const displayAyah = () => {
  content.textContent = data.surahs[surahsIndex].ayahs[ayahsIndex].text;
  audio.src = data.surahs[surahsIndex].ayahs[ayahsIndex].audio;

  playAudio();
  audioBtn.classList.remove("fa-pause");
  audioBtn.classList.add("fa-play");
};

//_______________________________________
// Move to previous ayah or previous surah if the current surah is finished
const leftMove = () => {
  if (ayahsIndex > 0) ayahsIndex--;
  else if (surahsIndex > 0) {
    surahsIndex--;
    ayahsIndex = data.surahs[surahsIndex].ayahs.length - 1;
  } else return;
  updateDropdownValues();
  displayAyah();
};

// Move to next ayah or next surah if the current surah is finished
const rightMove = () => {
  if (ayahsIndex < data.surahs[surahsIndex].ayahs.length - 1) ayahsIndex++;
  else if (surahsIndex < data.surahs.length - 1) {
    surahsIndex++;
    ayahsIndex = 0;
  } else return;
  updateDropdownValues();
  displayAyah();
};

//_______________________________________
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

//_______________________________________
// Update dropdown values
const updateDropdownValues = () => {
  suraSelect.value = surahsIndex;
  ayahSelect.value = ayahsIndex + 1;
  localStorage.setItem("surahsIndex", surahsIndex);
  localStorage.setItem("ayahsIndex", ayahsIndex);
  
};

//_______________________________________
// Populate surah dropdown
const populateSurahDropdown = () => {
  data.surahs.forEach((surah, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = surah.name;
    suraSelect.appendChild(option);
  });
};

//_______________________________________
// Populate ayah lists based on selected surah
const populateAyahDropdown = (SurahIndex) => {
  const ayahCount = data.surahs[SurahIndex].ayahs.length;
  ayahSelect.innerHTML = "";
  for (let i = 1; i <= ayahCount; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `آية ${i}`;
    ayahSelect.appendChild(option);
  }
};

//_______________________________________
// Event listeners
leftBtn.addEventListener("click", leftMove);
rightBtn.addEventListener("click", rightMove);
darkModeBtn.addEventListener("click", toggleDarkMode);

suraSelect.addEventListener("change", () => {
  surahsIndex = parseInt(suraSelect.value);
  ayahsIndex = 0;
  populateAyahDropdown(surahsIndex);
  updateDropdownValues();
  displayAyah();
});

ayahSelect.addEventListener("change", () => {
  ayahsIndex = parseInt(ayahSelect.value) - 1;
  updateDropdownValues();
  displayAyah();
});

// Event listener for audio button
audioBtn.addEventListener("click", () => {
  if (audio.paused) playAudio();
  else pauseAudio();
});

// Event listener for audio ended event
audio.onended = rightMove;

//_______________________________________
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
