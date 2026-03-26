# Focus OS – Smart Study Workspace

## Live Demo

https://vibe-craft-hackathon.vercel.app/

---

## Overview

Focus OS is a unified productivity workspace designed to help students stay focused while studying.

It integrates a music player, Pomodoro timer, and task management system into a single seamless interface where all modules run simultaneously without interruption.

---

## Core Features

### Music Player

* YouTube-powered lofi streaming
* Play / Pause functionality
* Switch between multiple streams
* Volume control
* Visual playback state

---

### Pomodoro Timer

* 25-minute focus timer
* Start / Pause / Reset
* Session counter
* Visual timer state
* Animated SVG progress ring

---

### Task Manager

* Add, edit, and delete tasks
* Mark tasks complete/incomplete
* Persistent storage using localStorage
* Live progress tracking (completed vs total)

---

## Bounty Features Implemented

* Motivational Quotes (+25)

  * Fetched from a public API
  * Auto-refresh every few minutes
  * Graceful fallback on failure

* Keyboard Shortcut System (+10)

  * Space → Play/Pause music
  * S → Start/Pause timer
  * N → Focus task input
  * C → Clear completed tasks

* Animated SVG Timer Ring (+15)

  * Smooth real-time countdown visualization

---

## Keyboard Shortcuts

| Key   | Action                |
| ----- | --------------------- |
| Space | Play/Pause Music      |
| S     | Start/Pause Timer     |
| N     | Focus Task Input      |
| C     | Clear Completed Tasks |

---

## Tech Stack

* HTML
* CSS
* JavaScript
* YouTube IFrame API
* Quotable API (Motivational Quotes)

---

## Deployment

Deployed using Vercel

---

## Run Locally

1. Clone the repository
2. Open `index.html` in any browser

---

## Key Highlight

The application is designed as a real-time interactive system where all components work together seamlessly to enhance user focus and productivity.

---

## Final Note

The goal was to create a usable, responsive, and engaging study environment rather than just implementing isolated features.
