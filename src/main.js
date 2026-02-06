import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// 1. Inizializzazione FFmpeg
const ffmpeg = new FFmpeg();

// Elementi del DOM
const audioInput = document.getElementById('audio-upload');
const dropzone = document.getElementById('dropzone');
const playBtn = document.getElementById('btn-play');
const cutBtn = document.getElementById('btn-cut');
const status = document.getElementById('status');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

// 2. Inizializza WaveSurfer
const ws = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4F4A85',
    progressColor: '#3498db',
    cursorColor: '#ffffff',
    responsive: true,
    height: 128,
    barWidth: 2,
    barGap: 3
});

// 3. Inizializza il plugin delle Regioni (con maniglie per mobile)
const wsRegions = ws.registerPlugin(RegionsPlugin.create());

// Helper per formattare il tempo (00:00)
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 4. Gestione caricamento file (Logica condivisa tra Input e Dropzone)
const handleFile = (file) => {
    if (file && file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        ws.load(url);
        status.innerText = "File caricato! Trascina i cursori bianchi per tagliare.";
        cutBtn.disabled = false;
        console.log("File caricato correttamente:", file.name);
    } else {
        alert("Per favore, carica un file audio valido.");
    }
};

// Eventi Input e Dropzone
audioInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

dropzone.addEventListener('click', () => audioInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = "#3498db"; });
dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = "#444"; });
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#444";
    handleFile(e.dataTransfer.files[0]);
});

// 5. Setup Regioni al caricamento dell'audio
ws.on('decode', () => {
    const duration = ws.getDuration();
    totalDurationEl.innerText = formatTime(duration);

    wsRegions.clearRegions();
    wsRegions.addRegion({
        start: 0,
        end: duration > 30 ? 30 : duration / 2,
        color: 'rgba(52, 152, 219, 0.3)',
        drag: true,
        resize: true,
    });
});

// Aggiorna tempo corrente durante il play
ws.on('audioprocess', () => {
    currentTimeEl.innerText = formatTime(ws.getCurrentTime());
});

playBtn.addEventListener('click', () => ws.playPause());

// 6. LOGICA DI TAGLIO (FFmpeg)
cutBtn.addEventListener('click', async () => {
    const region = wsRegions.getRegions()[0];
    const file = audioInput.files[0] || (await getFileFromDropzone()); // Fallback se trascinato

    if (!region || !file) return alert("Assicurati di aver caricato un file e selezionato una zona!");

    await processAudio(file, region.start, region.end);
});

async function processAudio(file, start, end) {
    try {
        if (!ffmpeg.loaded) {
            console.log("STEP 1: Caricamento FFmpeg Core...");
            status.innerText = "Caricamento motore audio... (potrebbe richiedere un istante)";

            // Fix per contesti PWA/Vite: usiamo CDN stabile
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            await ffmpeg.load({
                coreURL: `${baseURL}/ffmpeg-core.js`,
                wasmURL: `${baseURL}/ffmpeg-core.wasm`,
            });
            console.log("STEP 1.1: FFmpeg caricato.");
        }

        status.innerText = "Chirurgia audio in corso...";

        // Scrittura file
        const audioData = await fetchFile(file);
        await ffmpeg.writeFile('input.mp3', audioData);

        // Esecuzione comando
        console.log(`STEP 3: Taglio da ${start} a ${end}`);
        await ffmpeg.exec([
            '-i', 'input.mp3',
            '-ss', start.toFixed(3).toString(),
            '-to', end.toFixed(3).toString(),
            '-c', 'copy', // Copia diretta senza ricodifica (istantaneo)
            'output.mp3'
        ]);

        // Lettura e Download
        const data = await ffmpeg.readFile('output.mp3');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));

        const a = document.createElement('a');
        a.href = url;
        a.download = `soundBlade_cut_${Math.floor(Date.now() / 1000)}.mp3`;
        a.click();

        status.innerText = "Fatto! Il tuo file è pronto.";
        console.log("FINE: Download avviato.");

    } catch (error) {
        console.error("ERRORE:", error);
        status.innerText = "Errore durante il taglio. Ricarica la pagina.";
    }
}

// Helper per recuperare il file se caricato via dropzone
async function getFileFromDropzone() {
    // Se l'input file è vuoto (caso drag & drop), recuperiamo l'ultimo file gestito
    return audioInput.files[0];
}