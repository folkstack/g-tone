# G-Tone Polyphonic Mod Synth for MIDI Keyboards

### DEMO

Try the online [Demo](https://folkstack.github.io/g-tone/public/)

<img src=gtone.png width="420px" />

### Description

See below for all parameters and their unicode label.

This is pure algorithmically generated synthesis—no samples, and no webAudio components. The sound is 100% produced by hot javascript. The app works in the Chrome/Chromium browsers, internet connection not required.  Audio is 64bit HiFi Mono, until it hits your sound card, where it is probably reduced to 24 bits per sample.

## Features

The following parameters can be modulated on the interface:
#### Wave Type **&#8767;** 
  * [sine, saw, triangle, square] Default Sine, 0 index of array
#### Overtone Ratio **&#981;**
  * Default 12 semitones or 1 octave
#### Overtone Deviation **&#0963;** 
  * Default 2 (arbitrary)
#### Overtone Mean Oscillation **&#181;** 
  * Default 0 = none (try 1.61)
#### Overtone Mean LFO **&#181;fo**
  * Default 0 = Log10(root frequency), see Notes below
#### Number of overtones (polyphonics per voice) **&#926;** 
  * Default 3
#### Amplitude "warble" **&#9775;**
  * Default 0 = no amplitude modulation
#### Amplitude warble LFO **&#9775;hz**
  * Default 0 = Log10(root frequency), see Notes below
#### Wavelength dependent feedback **&#931;**
  * Default .25
#### Filter Function **&#955;**
  * Default None, 0 index of array, see Notes below
#### Attack, Decay, and Release Shapes 
  * Graph Displays
#### Attack, Decay, and Release Durations **A&#916;**, **D&#916;**, **R&#916;**
  * Defaults in seconds: .03, .03, .09 
#### Master Gain **&#937;**  
  * Default .27

### Notes
Sustain is "built-in".  Notes will sustain as long as the key is pressed.

The LFOs are a dependent on the fundamental frequency for each note.  More precisely, the LFO at zero is log10(fq), and can be modulated higher.

The Filter Functions are a "continous-time" hack of Window Functions (Hann, Hamming, etc).  See [window funcions](https://en.wikipedia.org/wiki/Window_function).


