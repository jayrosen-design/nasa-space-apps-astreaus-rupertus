const playClickSound = () => {
  const audio = new Audio('https://drive.google.com/uc?export=download&id=1lnJNcFWf2-HW5gm2WeHQK8GQ6s2DVHhF');
  audio.play().catch(error => console.error('Error playing audio:', error));
};

let backgroundAudio = null;

const playBackgroundMusic = () => {
  if (!backgroundAudio) {
    backgroundAudio = new Audio('https://whyp.it/tracks/213814/subtle-rumble');
    backgroundAudio.loop = true;
  }
  backgroundAudio.play().catch(error => console.error('Error playing background music:', error));
};

const stopBackgroundMusic = () => {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
};

export { playClickSound, playBackgroundMusic, stopBackgroundMusic };