// this should probably be a maybe
const getAudioCtx = () => {
  // define audio context
  let audioCtx = false;
  try {
    audioCtx = new (window.AudioContext ||
      window.webkitAudioContext ||
      window.audioContext)();
  } catch (e) {
    console.error("AudioContext fail!");
  }
  return audioCtx;
}; 

const getOscillator = ctx => ctx.createOscillator();
const getGainNode = ctx => ctx.createGain();

const beepMaker = (config, ctx, oscillator, gainNode) => {
  if (!ctx) {
    return;
  }

  const {duration, frequency, volume, type, callback} = config;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (volume) {
    gainNode.gain.value = volume;
  }

  if (frequency) {
    oscillator.frequency.value = frequency;
  }

  if (type) {
    oscillator.type = type;
  }

  if (callback) {
    oscillator.onended = callback;
  }


  // suspend audioContext till started
  // ctx.suspend();

  // start oscillator
  // oscillator.start(ctx.currentTime);

  return {
    stop: () => {
      // oscillator.stop(ctx.currentTime + (duration || 500) / 1000);
      // ctx.suspend();

      oscillator.disconnect(gainNode);
    },
    start: () => {

      // fallback duration
      setTimeout(() => {
        oscillator.disconnect(gainNode);
      }, (duration || 500) / 1000)
    }
  }
};

window.onload = () => {
  "use strict";

  if ("serviceworker" in navigator) {
    navigator.serviceworker.register("./sw.js");
  }

  const beepbutton = document.getElementById("thebutton");

  const beepConfig = {
    duration: 500,
    frequency: 250,
    volume: .3,
    type: 'sine'
  };

  const audioCtx = getAudioCtx();
  const osc = getOscillator(audioCtx);
  const gain = getGainNode(audioCtx);
  const beep = beepMaker(beepConfig, audioCtx, osc, gain);

  const clickListener = (e) => {
    (function() { 
      var ctx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)(); 
      var osc = ctx.createOscillator(); 
      var gain = ctx.createGain(); 
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = .45;
      osc.frequency.value = 250;
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1500 / 1000);
    })();
  };

  beepbutton.addEventListener("click", clickListener);
};
