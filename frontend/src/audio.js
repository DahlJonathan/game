const audio = {
    sounds: {},
    
    // Load a sound file
    loadSound: function(name, url) {
        const audio = new Audio(url);
        audio.addEventListener('error', (e) => {
            console.error(`Error loading sound ${name} from ${url}:`, e);
        });
        this.sounds[name] = audio;
    },

    // Play a sound
    playSound: function(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0; // Reset sound to start
            this.sounds[name].play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        }
    },

    // Pause a sound
    pauseSound: function(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
        }
    },

    // Stop a sound
    stopSound: function(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0; // Reset sound to start
        }
    }
};

// Example usage
//audio.loadSound('background', 'src/audio/Artur Aravidi - Royale Battle.mp3');
audio.loadSound('jump', 'src/audio/jump.wav');
audio.loadSound('gempoint', 'src/audio/collected.wav');
audio.loadSound('diapoint', 'src/audio/collectedBig.wav');

export default audio;