// // Create an AudioContext instance once, for the page's lifetime
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// // Pool: one persistent Audio + GainNode + connection per unique sound file
// const soundPool = new Map();

// function getSoundChannel(song, volume) {
//   if (soundPool.has(song)) {
//     return soundPool.get(song);
//   }

//   // Build the node graph ONCE per sound — this is the permanent "circuit"
//   const sound = new Audio(song);
//   sound.preload = "auto";

//   const track = audioContext.createMediaElementSource(sound);
//   const gainNode = audioContext.createGain();

//   track.connect(gainNode).connect(audioContext.destination);

//   const channel = { sound, gainNode };
//   soundPool.set(song, channel);
//   return channel;
// }

// // Function to play sound effects
// function addSound(song, volume = 1) {
//   if (JSON.parse(localStorage.getItem("muteSound")) === 1) return;

//   const { sound, gainNode } = getSoundChannel(song, volume);

//   // Update gain on the EXISTING node, don't create a new one
//   gainNode.gain.value = volume;

//   // Resume AudioContext if suspended (e.g. after browser autoplay policy)
//   if (audioContext.state === "suspended") {
//     audioContext.resume();
//   }

//   // Rewind and retrigger the SAME element — no new allocation
//   sound.currentTime = 0;
//   sound.play().catch((err) => {
//     // Swallow expected interruption errors, log anything else
//     if (err.name !== "AbortError") {
//       console.error("Sound playback failed:", err);
//     }
//   });
// }
