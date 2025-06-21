import React, { useState, useCallback, useRef } from 'react';

interface SpawnedEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

function App() {
  const [chaosScore, setChaosScore] = useState(0);
  const [buttonText, setButtonText] = useState('DO NOT CLICK');
  const [backgroundPattern, setBackgroundPattern] = useState('');
  const [headingFont, setHeadingFont] = useState('font-serif');
  const [spawnedEmojis, setSpawnedEmojis] = useState<SpawnedEmoji[]>([]);
  const emojiIdRef = useRef(0);

  const buttonTexts = [
    'DO NOT CLICK',
    'Are you sure?',
    'Again!',
    'Why?',
    "I'm Warning You",
    'Stop It',
    'Something Happened...',
    "Don't Tell Mom",
    'Seriously?',
    'No Really, Stop',
    'Fine, Keep Going',
    'You Monster',
    'This is Chaos',
    'Why Do You Do This?',
    'I Give Up',
    'Pure Madness',
    'The End is Near',
    'Just... Why?'
  ];

  const backgroundPatterns = [
    'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600',
    'bg-gradient-to-tr from-green-400 via-blue-500 to-purple-600',
    'bg-gradient-to-bl from-yellow-400 via-red-500 to-pink-500',
    'bg-gradient-to-tl from-indigo-500 via-purple-500 to-pink-500',
    'bg-gradient-to-r from-cyan-500 to-blue-500',
    'bg-gradient-to-br from-emerald-400 to-cyan-400',
    'bg-gradient-to-tr from-rose-400 to-orange-300',
    'bg-gradient-to-bl from-violet-600 to-indigo-600'
  ];

  const fonts = [
    'font-serif',
    'font-mono',
    'font-sans',
    'tracking-widest',
    'tracking-tighter font-bold',
    'italic font-light',
    'uppercase font-black tracking-wide'
  ];

  const emojis = ['💩', '🤡', '🦆', '🗿', '👽', '🎪', '🌈', '💀', '🔥', '⚡', '🦄', '🎭', '🎨', '🎪', '🌟'];

  const uselessFacts = [
    'Alert: Bananas are berries, but strawberries aren\'t.',
    'Alert: Octopuses have three hearts and blue blood.',
    'Alert: Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.',
    'Alert: A group of flamingos is called a "flamboyance."',
    'Alert: Wombat poop is cube-shaped.',
    'Alert: There are more possible games of chess than atoms in the observable universe.',
    'Alert: Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
    'Alert: The shortest war in history lasted only 38-45 minutes.',
    'Alert: A single cloud can weigh more than a million pounds.',
    'Alert: You are now manually breathing.'
  ];

  const consoleMessages = [
    'The squirrels are watching.',
    'You have awakened something ancient.',
    'Error 404: Sense not found.',
    'The chaos is spreading...',
    'Why are you reading this?',
    'The button knows what you did.',
    'Reality.exe has stopped working.',
    'You clicked it. Again.',
    'This is fine. Everything is fine.',
    'The void stares back.'
  ];

  const soundUrls = [
    'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
    'https://www.soundjay.com/misc/sounds/magic-chime-02.wav'
  ];

  const playRandomSound = useCallback(() => {
    try {
      // Create a simple beep using Web Audio API since external sounds might not load
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = [200, 300, 400, 500, 600, 800, 1000];
      oscillator.frequency.setValueAtTime(frequencies[Math.floor(Math.random() * frequencies.length)], audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('The chaos engine had a hiccup:', error);
    }
  }, []);

  const spawnRandomEmoji = useCallback(() => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const x = Math.random() * (window.innerWidth - 60);
    const y = Math.random() * (window.innerHeight - 60);
    
    const newEmoji: SpawnedEmoji = {
      id: emojiIdRef.current++,
      emoji,
      x,
      y
    };
    
    setSpawnedEmojis(prev => [...prev, newEmoji]);
  }, []);

  const triggerChaos = useCallback(() => {
    setChaosScore(prev => prev + 1);
    
    const chaosEvents = [
      () => playRandomSound(),
      () => setBackgroundPattern(backgroundPatterns[Math.floor(Math.random() * backgroundPatterns.length)]),
      () => setButtonText(buttonTexts[Math.floor(Math.random() * buttonTexts.length)]),
      () => spawnRandomEmoji(),
      () => setHeadingFont(fonts[Math.floor(Math.random() * fonts.length)]),
      () => alert(uselessFacts[Math.floor(Math.random() * uselessFacts.length)]),
      () => console.log(consoleMessages[Math.floor(Math.random() * consoleMessages.length)])
    ];
    
    // Trigger 1-3 random events
    const numEvents = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numEvents; i++) {
      const randomEvent = chaosEvents[Math.floor(Math.random() * chaosEvents.length)];
      setTimeout(randomEvent, i * 200);
    }
  }, [playRandomSound, spawnRandomEmoji]);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundPattern || 'bg-gray-900'} relative overflow-hidden`}>
      {/* Spawned Emojis */}
      {spawnedEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-bounce pointer-events-none select-none z-10"
          style={{
            left: `${emoji.x}px`,
            top: `${emoji.y}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
        {/* Main Heading */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl text-gray-100 mb-12 text-center transition-all duration-500 ${headingFont}`}>
          Welcome to The Uselass Button
        </h1>

        {/* The Useless Button */}
        <button
          onClick={triggerChaos}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg md:text-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 animate-pulse"
          style={{
            background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #F97316)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite, pulse 2s infinite'
          }}
        >
          <span className="drop-shadow-lg text-center px-4 leading-tight">
            {buttonText}
          </span>
        </button>

        {/* Chaos Score */}
        <div className="mt-8 text-gray-300 text-xl md:text-2xl font-semibold">
          <span className="text-purple-400">CHAOS SCORE:</span> {chaosScore}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 left-4 right-4 text-center text-gray-500 text-xs leading-relaxed">
          A beautifully useless submission for the Reddit Silly Shit Challenge. We are not responsible for any lost time or brain cells.
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default App;