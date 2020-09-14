# G-Tone Polyphonic-As-You-Want-It Mod Synth for MIDI Keyboards

This is a pure algorithmically generated synthesis—no samples, and no webAudio components. The sound is 100% produced by hot javascript. The app works in the Chrome/Chromium browsers, internet connection not required.  Audio is 64bit HiFi Mono.

G-Tone is designed for modulating overtones, based on Gaussian distributions, where the fundamental frequency is represented as the *mean*, and the overtones are discreet values along the deviation. The ratio of the overtones to the fundamental frequency is a mod parameter defined in half-tones on the equal tempered scale. The distance of the overtones along the deviation is also mod parameter (eg. the default is whole number deviations).  

## Features

The following parameters can be modulated on the interface:
* Wave Type (sine, saw, triangle, square)
* Overtone Ratio
* Overtone Deviation 
* Overtone Mean Oscillation
* The Overtone Mean LFO (see below)
* The Number of overtones per note (aka polyphonics per voice)
* Amplitude "warble"
* The Amplitude warble LFO (see below)
* Wavelength dependent feedback value
* Window Filter Function (see below)
* Attack, Decay, and Release (shapes and durations)
* Gain

Sustain is "built-in".  Notes will sustain as long as the key is pressed.

The LFOs are a dependent on the fundamental frequency for each note.  More precisely, the LFO at zero is log10(fq), and can be modulated higher.

The Window Filter Functions are a "continous-time" hack of Window Functions (Hann, Hamming, etc).  See [window funcions](https://en.wikipedia.org/wiki/Window_function).


