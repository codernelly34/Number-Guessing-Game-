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

// Function to play sound effects
function addSound(song, volume = 1) {
    if (JSON.parse(localStorage.getItem("muteSound")) === 1) return;

    const sound = new Audio(song);
    sound.volume = volume;

    // Connect sound to AudioContext for better control
    const track = audioContext.createMediaElementSource(sound);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    track.connect(gainNode).connect(audioContext.destination);

    // Resume AudioContext if necessary
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    sound.play();
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
    .addEventListener("click", () => addSound("./sounds/reset.mp3",0.6));
document
    .querySelector(".icon")
    .addEventListener("click", () => addSound("./sounds/btn.mp3"));

// Mute/Unmute toggle for sound effects
muteSoundButton.addEventListener("click", () => {
    addSound("./sounds/btn.mp3");
    const muteSoundStatus = JSON.parse(localStorage.getItem("muteSound"));
    localStorage.setItem(
        "muteSound",
        JSON.stringify(muteSoundStatus === 0 ? 1 : 0)
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
        JSON.stringify(muteMusicStatus === 0 ? 1 : 0)
    );
    muteMusicButton.style.textDecoration =
        muteMusicStatus === 0 ? "line-through" : "none";
    toggleMusic();
});
