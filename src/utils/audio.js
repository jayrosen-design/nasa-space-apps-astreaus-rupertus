const playClickSound = () => {
  const audio = new Audio('https://drive.google.com/uc?export=download&id=1lnJNcFWf2-HW5gm2WeHQK8GQ6s2DVHhF');
  audio.play().catch(error => console.error('Error playing audio:', error));
};

export { playClickSound };