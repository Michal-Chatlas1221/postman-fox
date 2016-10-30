let timer = 0;

function setTimer(event) {
  timer = event.timeFrame - event.time;
  console.log("socket: " + timer);
}

function getTimer() {
  return timer;
}

module.exports = {
  getTimer,
  setTimer
};