# G-Tone Polyphonic-As-You-Want-It Mod Synth for MIDI Keyboards

[Demo](https://folkstack.github.io/g-tone/public/)

![screenshot](./gtone.png =420x)

This is a pure algorithmically generated synthesis—no samples, and no webAudio components. The sound is 100% produced by hot javascript. The app works in the Chrome/Chromium browsers, internet connection not required.  Audio is 64bit HiFi Mono.

G-Tone is designed for modulating overtones, based on Gaussian distributions, where the fundamental frequency is represented as the *mean*, and the overtones are discreet values along the deviation. The ratio of the overtones to the fundamental frequency is a mod parameter defined in half-tones on the equal tempered scale. 

## Features

The following parameters can be modulated on the interface:
* Wave Type (sine, saw, triangle, square)—Default Sine, 0 index of array
* Overtone Ratio—Default 12 semitones or 1 octave
* Overtone Deviation—Default 2 (arbitrary)
* Overtone Mean Oscillation—Default 0 (try 1.61)
* The Overtone Mean LFO—Default 0 = Log10(root frequency), see below
* The Number of overtones per note (polyphonics per voice)—Default 3
* Amplitude "warble"—Default 0 = no amplitude modulation
* The Amplitude warble LFO—Default 0 = Log10(root frequency), see below
* Wavelength dependent feedback—Default .25
* Window Filter Function—Default None, 0 index of array (see below)
* Attack, Decay, and Release (shapes and durations)
* Gain—Default .27

Sustain is "built-in".  Notes will sustain as long as the key is pressed.

The LFOs are a dependent on the fundamental frequency for each note.  More precisely, the LFO at zero is log10(fq), and can be modulated higher.

The Window Filter Functions are a "continous-time" hack of Window Functions (Hann, Hamming, etc).  See [window funcions](https://en.wikipedia.org/wiki/Window_function).


