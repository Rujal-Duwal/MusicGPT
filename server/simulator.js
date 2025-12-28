const crypto = require("crypto");
const { getIO } = require("./socket");
const { updateGeneration } = require("./store");

const moods = ["noir", "uplift", "ambient", "storm", "neon"];
const palettes = [
  ["#FBD786", "#f7797d"],
  ["#a1ffce", "#faffd1"],
  ["#84fab0", "#8fd3f4"],
  ["#fbc2eb", "#a6c1ee"],
  ["#f6d365", "#fda085"],
];

const createVersion = (label) => {
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  return {
    id: crypto.randomUUID(),
    title: label,
    duration: `${crypto.randomInt(1, 4)}:${crypto
      .randomInt(0, 59)
      .toString()
      .padStart(2, "0")}`,
    bpm: crypto.randomInt(80, 142),
    key: `${String.fromCharCode(65 + crypto.randomInt(0, 7))}m`,
    mood: moods[Math.floor(Math.random() * moods.length)],
    palette,
  };
};

const createCompletedItem = (prompt, createdAt) => ({
  id: crypto.randomUUID(),
  prompt,
  status: "completed",
  progress: 100,
  createdAt,
  versions: [createVersion("Version A"), createVersion("Version B")],
});

const emit = (event, payload) => {
  const io = getIO();
  if (io) {
    io.emit(event, payload);
  }
};

const startSimulation = (itemId) => {
  let progress = 0;

  const interval = setInterval(() => {
    progress = Math.min(100, progress + crypto.randomInt(8, 16));
    updateGeneration(itemId, { status: "generating", progress });
    emit("generation:progress", { id: itemId, progress });

    if (progress >= 100) {
      clearInterval(interval);
      const failed = Math.random() < 0.18; // 18% chance to fail
      if (failed) {
        const error = "Render failed. A glitch hit the audio graph.";
        updateGeneration(itemId, { status: "failed", error, progress: 100 });
        emit("generation:failed", { id: itemId, error });
      } else {
        const versions = [
          createVersion("Version A"),
          createVersion("Version B"),
        ];
        updateGeneration(itemId, {
          status: "completed",
          progress: 100,
          versions,
        });
        emit("generation:completed", { id: itemId, versions });
      }
    }
  }, 650);
};

module.exports = {
  createVersion,
  createCompletedItem,
  startSimulation,
};
