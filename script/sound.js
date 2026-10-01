const muteMusicButton = document.getElementById("muteMusic");
const muteSoundButton = document.getElementById("muteSound");

document.addEventListener("click", toggleMusic, { once: true });

// Persistent background music instance
let backgroundMusic = new Audio("./sounds/music.m4a");
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.5; // Default volume

// Create an AudioContext instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Initialize sound and music settings
function initSound() {
  if (!localStorage.getItem("muteSound"))
    localStorage.setItem("muteSound", JSON.stringify(0));
  if (!localStorage.getItem("muteMusic"))
    localStorage.setItem("muteMusic", JSON.stringify(0));

  // Apply mute styles based on stored settings
  if (JSON.parse(localStorage.getItem("muteSound")) === 1) {
    muteSoundButton.style.textDecoration = "line-through";
  }
  if (JSON.parse(localStorage.getItem("muteMusic")) === 1) {
    muteMusicButton.style.textDecoration = "line-through";
    backgroundMusic.pause(); // Stop the music if muted
  }
}
initSound();

// Pool: one persistent Audio + GainNode + connection per unique sound file
const soundPool = new Map();

function getSoundChannel(song, volume) {
  if (soundPool.has(song)) {
    return soundPool.get(song);
  }

  // Build the node graph ONCE per sound — this is the permanent "circuit"
  const sound = new Audio(song);
  sound.preload = "auto";

  const track = audioContext.createMediaElementSource(sound);
  const gainNode = audioContext.createGain();

  track.connect(gainNode).connect(audioContext.destination);

  const channel = { sound, gainNode };
  soundPool.set(song, channel);
  return channel;
}

// Function to play sound effects
// function addSound(song, volume = 1) {
//   if (JSON.parse(localStorage.getItem("muteSound")) === 1) return;

//   const sound = new Audio(song);
//   sound.volume = volume;

//   // Connect sound to AudioContext for better control
//   const track = audioContext.createMediaElementSource(sound);
//   const gainNode = audioContext.createGain();
//   gainNode.gain.value = volume;

//   track.connect(gainNode).connect(audioContext.destination);

//   // Resume AudioContext if necessary
//   if (audioContext.state === "suspended") {
//     audioContext.resume();
//   }

//   sound.play();
// }

// Function to play sound effects
function addSound(song, volume = 1) {
  if (JSON.parse(localStorage.getItem("muteSound")) === 1) return;

  const { sound, gainNode } = getSoundChannel(song, volume);

  // Update gain on the EXISTING node, don't create a new one
  gainNode.gain.value = volume;

  // Resume AudioContext if suspended (e.g. after browser autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // Rewind and retrigger the SAME element — no new allocation
  sound.currentTime = 0;
  sound.play().catch((err) => {
    // Swallow expected interruption errors, log anything else
    if (err.name !== "AbortError") {
      console.error("Sound playback failed:", err);
    }
  });
}

// Function to manage background music
function toggleMusic() {
  const muteMusicStatus = JSON.parse(localStorage.getItem("muteMusic"));
  if (muteMusicStatus === 1) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }
}

// Event listeners for game actions
document
  .getElementById("playGame")
  .addEventListener("click", () => addSound("./sounds/play.mp3", 0.6));
document
  .querySelector(".resetBtn")
  .addEventListener("click", () => addSound("./sounds/reset.mp3", 0.6));
document
  .querySelector(".icon")
  .addEventListener("click", () => addSound("./sounds/btn.mp3"));

// Mute/Unmute toggle for sound effects
muteSoundButton.addEventListener("click", () => {
  addSound("./sounds/btn.mp3");
  const muteSoundStatus = JSON.parse(localStorage.getItem("muteSound"));
  localStorage.setItem(
    "muteSound",
    JSON.stringify(muteSoundStatus === 0 ? 1 : 0),
  );
  muteSoundButton.style.textDecoration =
    muteSoundStatus === 0 ? "line-through" : "none";
});

// Mute/Unmute toggle for background music
muteMusicButton.addEventListener("click", () => {
  addSound("./sounds/btn.mp3");
  const muteMusicStatus = JSON.parse(localStorage.getItem("muteMusic"));
  localStorage.setItem(
    "muteMusic",
    JSON.stringify(muteMusicStatus === 0 ? 1 : 0),
  );
  muteMusicButton.style.textDecoration =
    muteMusicStatus === 0 ? "line-through" : "none";
  toggleMusic();
});
