if (!global.__music_io) {
  global.__music_io = null;
}

const setIO = (io) => {
  global.__music_io = io;
};

const getIO = () => global.__music_io;

module.exports = {
  setIO,
  getIO
};
