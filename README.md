# 🔪 soundBlade

**soundBlade** è un editor audio minimale e ultra-veloce che gira interamente nel tuo browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WebAssembly](https://img.shields.io/badge/powered%20by-WebAssembly-654FF0.svg)
![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-009688.svg?logo=pwa&logoColor=white)
[![Donate](https://img.shields.io/badge/Donate-PayPal-004595.svg?logo=paypal&logoColor=white)](https://paypal.me/mailboxporter)


## 🌐 Live Demo & PWA
Puoi testare soundBlade e installarlo come App direttamente qui:
👉 **[https://soundblade.dfix.it](https://soundblade.dfix.it)**

---

## ✨ Caratteristiche
- 🚀 **Zero Upload**: Il taglio avviene sul tuo PC/Smartphone grazie a WebAssembly.
- 📱 **PWA Ready**: Installalo sul tuo dispositivo e usalo come un'app nativa.
- 🎯 **Precisione**: Selezione millimetrica tramite waveform interattiva.
- 🔒 **Privacy Focused**: I tuoi file audio non lasciano mai il tuo dispositivo.

## 🛠️ Tech Stack
- **Vite** - Per un ambiente di sviluppo rapido.
- **FFmpeg.wasm** - Il motore di elaborazione audio.
- **WaveSurfer.js** - Per la visualizzazione della forma d'onda.
- **Docker** - Per una portabilità totale.

## 🚀 Avvio Rapido con Docker

Se hai Docker installato, puoi avviare soundBlade con un solo comando:

```bash
docker-compose up --build
```
Poi visita: http://localhost:8080

📦 Installazione Manuale
Clona il repo:

Bash
git clone [https://github.com/tuo-username/soundBlade.git](https://github.com/tuo-username/soundBlade.git)
Installa le dipendenze:

Bash
npm install
Avvia in modalità sviluppo:

Bash
npm run dev
☕ Supporta il progetto
Se trovi questo strumento utile, offrimi un caffè!

Rilasciato sotto licenza MIT.