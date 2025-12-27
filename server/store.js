if (!global.__music_generations) {
  global.__music_generations = [];
}

const getGenerations = () => global.__music_generations;

const setGenerations = (items) => {
  global.__music_generations = items;
};

const addGeneration = (item) => {
  global.__music_generations.unshift(item);
};

const updateGeneration = (id, patch) => {
  const index = global.__music_generations.findIndex((item) => item.id === id);
  if (index === -1) return;
  global.__music_generations[index] = { ...global.__music_generations[index], ...patch };
};

const appendGenerations = (items) => {
  global.__music_generations.push(...items);
};

module.exports = {
  getGenerations,
  setGenerations,
  addGeneration,
  updateGeneration,
  appendGenerations
};
