let timer = 0;

function setTimer(event) {
  timer = event.timeFrame - event.time;
}

function getTimer() {
  return timer;
}

module.exports = {
  getTimer,
  setTimer
};