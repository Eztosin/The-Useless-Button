import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SpawnedElement {
  id: number;
  type: 'emoji' | 'gif' | 'popup' | 'error';
  content: string;
  x: number;
  y: number;
  rotation?: number;
}

interface ButtonState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isDodging: boolean;
}

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [buttonText, setButtonText] = useState('DO NOT CLICK');
  const [backgroundClass, setBackgroundClass] = useState('bg-gray-900');
  const [pageShaking, setPageShaking] = useState(false);
  const [textFlipped, setTextFlipped] = useState(false);
  const [spawnedElements, setSpawnedElements] = useState<SpawnedElement[]>([]);
  const [buttons, setButtons] = useState<ButtonState[]>([{ x: 50, y: 50, rotation: 0, scale: 1, isDodging: false }]);
  const [hellMode, setHellMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentFont, setCurrentFont] = useState('font-sans');
  const [cssFilter, setCssFilter] = useState('');
  const elementIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const spookyAudioRef = useRef<OscillatorNode | null>(null);

  const chaosTexts = [
    'STOP CLICKING ME',
    'WHY ARE YOU LIKE THIS?',
    'ERROR 404: SANITY NOT FOUND',
    'CORRUPTED',
    'GLITCH.EXE',
    'NO REFUNDS',
    'YOU MONSTER',
    'REALITY.DLL MISSING',
    'HELP ME',
    'I AM IN PAIN',
    'SYSTEM FAILURE',
    'ABORT ABORT ABORT'
  ];

  const uselessFacts = [
    'FACT: You just wasted 0.3 seconds of your life',
    'FACT: Bananas are radioactive (unlike your personality)',
    'FACT: You blink 15-20 times per minute (blink now)',
    'FACT: A group of pugs is called a "grumble"',
    'FACT: You are now breathing manually',
    'FACT: Your tongue never sits comfortably in your mouth',
    'FACT: You just lost The Game',
    'FACT: There are more trees on Earth than stars in the galaxy',
    'FACT: Honey never spoils, unlike this app',
    'FACT: You are now aware of your blinking'
  ];

  const popupMessages = [
    "🎉 CONGRATULATIONS! You've won ABSOLUTELY NOTHING! 🎉",
    "⚠️ WARNING: Excessive clicking may cause existential dread",
    "💀 SYSTEM ERROR: User.exe has stopped working",
    "🤡 HONK HONK: You played yourself",
    "🚨 ALERT: Your warranty has been voided",
    "💸 You owe us $0.00 for this experience",
    "🎪 Welcome to the circus, you're the clown",
    "🔥 This is fine. Everything is fine."
  ];

  const gifs = [
    '🕺', '💃', '🤸‍♂️', '🤹‍♀️', '🎭', '🎪', '🎨', '🎬', '🎤', '🎸',
    '🔥', '💥', '⚡', '🌪️', '🌈', '💀', '👻', '🤖', '👽', '🦄'
  ];

  const terribleColors = [
    'bg-gradient-to-br from-pink-500 via-yellow-400 to-lime-400',
    'bg-gradient-to-tr from-purple-600 via-orange-500 to-red-600',
    'bg-gradient-to-bl from-green-400 via-cyan-500 to-blue-600',
    'bg-gradient-to-tl from-yellow-300 via-pink-500 to-purple-600',
    'bg-gradient-to-r from-red-500 to-yellow-500',
    'bg-gradient-to-l from-blue-400 to-purple-600'
  ];

  const chaosFonts = [
    'font-mono text-2xl',
    'font-serif italic',
    'font-sans font-black tracking-widest',
    'font-mono font-bold text-3xl',
    'font-serif text-xl tracking-tight'
  ];

  const playRandomSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const soundTypes = ['fart', 'meow', 'horn', 'scream', 'glitch'];
    const soundType = soundTypes[Math.floor(Math.random() * soundTypes.length)];
    
    let frequency = 440;
    let duration = 0.5;
    let volume = isMuted ? 0.3 : 0.1; // "Muted" is louder, because chaos
    
    switch (soundType) {
      case 'fart':
        frequency = 80 + Math.random() * 40;
        oscillator.type = 'sawtooth';
        duration = 0.8;
        break;
      case 'meow':
        frequency = 800 + Math.random() * 400;
        oscillator.type = 'triangle';
        duration = 0.6;
        break;
      case 'horn':
        frequency = 200;
        oscillator.type = 'square';
        duration = 1.0;
        break;
      case 'scream':
        frequency = 1000 + Math.random() * 500;
        oscillator.type = 'sawtooth';
        duration = 0.3;
        break;
      case 'glitch':
        frequency = Math.random() * 2000;
        oscillator.type = 'square';
        duration = 0.2;
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [isMuted]);

  const startSpookyAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (spookyAudioRef.current) return; // Already playing

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(66.6, audioContext.currentTime); // Spooky frequency
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    oscillator.start();
    spookyAudioRef.current = oscillator;
  }, []);

  const shakeScreen = useCallback(() => {
    setPageShaking(true);
    setTimeout(() => setPageShaking(false), 1000);
  }, []);

  const spawnElement = useCallback((type: 'emoji' | 'gif' | 'popup' | 'error', content: string) => {
    const x = Math.random() * 80 + 10; // 10-90% of screen width
    const y = Math.random() * 80 + 10; // 10-90% of screen height
    const rotation = Math.random() * 360;
    
    const newElement: SpawnedElement = {
      id: elementIdRef.current++,
      type,
      content,
      x,
      y,
      rotation
    };
    
    setSpawnedElements(prev => [...prev, newElement]);
    
    // Remove element after some time
    setTimeout(() => {
      setSpawnedElements(prev => prev.filter(el => el.id !== newElement.id));
    }, type === 'popup' ? 3000 : 5000);
  }, []);

  const makeButtonDodge = useCallback((buttonIndex: number) => {
    setButtons(prev => prev.map((button, index) => {
      if (index === buttonIndex) {
        return {
          ...button,
          x: Math.random() * 60 + 20, // 20-80% of screen
          y: Math.random() * 60 + 20,
          isDodging: true
        };
      }
      return button;
    }));
    
    setTimeout(() => {
      setButtons(prev => prev.map((button, index) => {
        if (index === buttonIndex) {
          return { ...button, isDodging: false };
        }
        return button;
      }));
    }, 500);
  }, []);

  const duplicateButton = useCallback(() => {
    const newButton: ButtonState = {
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
      isDodging: false
    };
    setButtons(prev => [...prev, newButton]);
  }, []);

  const triggerChaos = useCallback((buttonIndex: number = 0) => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Update button rotation and scale
    setButtons(prev => prev.map((button, index) => {
      if (index === buttonIndex) {
        return {
          ...button,
          rotation: button.rotation + (Math.random() * 180 - 90),
          scale: 0.8 + Math.random() * 0.4
        };
      }
      return button;
    }));
    
    // Basic chaos events
    const chaosEvents = [
      () => playRandomSound(),
      () => setBackgroundClass(terribleColors[Math.floor(Math.random() * terribleColors.length)]),
      () => setButtonText(chaosTexts[Math.floor(Math.random() * chaosTexts.length)]),
      () => shakeScreen(),
      () => spawnElement('popup', popupMessages[Math.floor(Math.random() * popupMessages.length)]),
      () => spawnElement('gif', gifs[Math.floor(Math.random() * gifs.length)]),
      () => setTextFlipped(prev => !prev),
      () => setCurrentFont(chaosFonts[Math.floor(Math.random() * chaosFonts.length)]),
      () => alert(uselessFacts[Math.floor(Math.random() * uselessFacts.length)])
    ];
    
    // Progressive chaos based on click count
    if (newClickCount >= 10) {
      makeButtonDodge(buttonIndex);
    }
    
    if (newClickCount >= 20 && newClickCount % 5 === 0) {
      duplicateButton();
    }
    
    if (newClickCount >= 30) {
      startSpookyAudio();
    }
    
    if (hellMode) {
      const filters = [
        'hue-rotate(180deg)',
        'invert(1)',
        'saturate(3)',
        'contrast(2)',
        'blur(1px)',
        'sepia(1)'
      ];
      setCssFilter(filters[Math.floor(Math.random() * filters.length)]);
    }
    
    // Trigger 1-4 random events
    const numEvents = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numEvents; i++) {
      const randomEvent = chaosEvents[Math.floor(Math.random() * chaosEvents.length)];
      setTimeout(randomEvent, i * 100);
    }
  }, [clickCount, playRandomSound, shakeScreen, spawnElement, makeButtonDodge, duplicateButton, startSpookyAudio, hellMode]);

  const enableHellMode = useCallback(() => {
    setHellMode(true);
    setBackgroundClass('bg-gradient-to-br from-red-900 via-black to-red-900');
    alert('🔥 HELL MODE ACTIVATED 🔥\nThere is no escape now.');
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    // Play a sound to "test" the mute (but it's actually louder)
    setTimeout(playRandomSound, 100);
  }, [playRandomSound]);

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${backgroundClass} relative overflow-hidden ${pageShaking ? 'animate-pulse' : ''} ${textFlipped ? 'transform scale-y-[-1]' : ''}`}
      style={{ 
        filter: cssFilter,
        animation: pageShaking ? 'shake 0.1s infinite' : hellMode ? 'hellGlow 2s infinite' : 'none'
      }}
    >
      {/* Built with Bolt Badge */}
      <div className="absolute top-4 right-4 z-50">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm font-medium hover:bg-black/30 hover:text-white transition-all duration-200 hover:scale-105"
        >
          <span className="text-lg">⚡</span>
          Built with Bolt
        </a>
      </div>

      {/* Chaos Controls */}
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        <button
          onClick={enableHellMode}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          disabled={hellMode}
        >
          {hellMode ? '🔥 HELL MODE 🔥' : 'MAKE IT WORSE'}
        </button>
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
        >
          {isMuted ? '🔊 UNMUTE (LIES)' : '🔇 MUTE'}
        </button>
      </div>

      {/* Spawned Elements */}
      {spawnedElements.map((element) => (
        <div
          key={element.id}
          className={`absolute z-30 pointer-events-none select-none ${
            element.type === 'popup' ? 'bg-yellow-300 border-4 border-red-500 p-4 rounded-lg text-black font-bold text-center max-w-xs' :
            element.type === 'error' ? 'bg-blue-600 text-white p-2 rounded border-2 border-gray-400 font-mono text-sm' :
            'text-6xl animate-spin'
          }`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `rotate(${element.rotation}deg)`,
            animation: element.type === 'gif' ? 'bounce 0.5s infinite' : 
                      element.type === 'popup' ? 'pulse 0.5s infinite' : 'spin 2s linear infinite'
          }}
        >
          {element.content}
        </div>
      ))}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
        {/* Main Heading */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl text-white mb-4 text-center transition-all duration-500 ${currentFont} ${hellMode ? 'animate-pulse text-red-400' : ''}`}>
          The Useless Button: Corrupted Edition
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 text-center italic">
          "Every click is a mistake. Keep clicking."
        </p>

        {/* The Useless Buttons */}
        <div className="relative w-full h-96 flex items-center justify-center">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => triggerChaos(index)}
              className={`absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-sm md:text-lg shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 ${
                button.isDodging ? 'animate-bounce' : 'animate-pulse'
              } ${hellMode ? 'border-4 border-red-500 shadow-red-500/50' : ''}`}
              style={{
                left: `${button.x}%`,
                top: `${button.y}%`,
                transform: `translate(-50%, -50%) rotate(${button.rotation}deg) scale(${button.scale})`,
                background: hellMode ? 
                  'linear-gradient(45deg, #DC2626, #7C2D12, #991B1B)' :
                  'linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #F97316)',
                backgroundSize: '400% 400%',
                animation: `gradientShift 3s ease infinite, ${button.isDodging ? 'bounce 0.5s infinite' : 'pulse 2s infinite'}`
              }}
            >
              <span className="drop-shadow-lg text-center px-2 leading-tight">
                {buttonText}
              </span>
            </button>
          ))}
        </div>

        {/* Chaos Score */}
        <div className={`mt-8 text-2xl md:text-3xl font-bold ${hellMode ? 'text-red-400' : 'text-purple-400'}`}>
          <span className="text-white">CORRUPTION LEVEL:</span> {clickCount}
        </div>

        {/* Progress Indicators */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          {clickCount < 10 && <p>Click 10 times to unlock DODGING MODE</p>}
          {clickCount >= 10 && clickCount < 20 && <p>🏃‍♂️ DODGING ACTIVATED! Click 20 times for MULTIPLICATION</p>}
          {clickCount >= 20 && clickCount < 30 && <p>🔄 MULTIPLICATION ACTIVE! Click 30 times for AUDIO HELL</p>}
          {clickCount >= 30 && <p>🔊 MAXIMUM CHAOS ACHIEVED! 🔊</p>}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 left-4 right-4 text-center text-gray-500 text-xs leading-relaxed">
          A beautifully corrupted experience. We are not responsible for any lost sanity, brain cells, or will to live.
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) translateY(-5px); }
          75% { transform: translateX(5px) translateY(5px); }
        }
        
        @keyframes hellGlow {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          50% { filter: brightness(1.5) hue-rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

export default App;