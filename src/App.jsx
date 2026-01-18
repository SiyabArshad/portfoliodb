import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValueEvent } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import Train from './components/Train';
import TrainPakistani from './components/TrainPakistani';
import Track from './components/Track';
import Station from './components/Station';
import StationModal from './components/StationModal';
import Background from './components/Background';
import Ticket from './components/Ticket';
import IntroOverlay from './components/IntroOverlay';
import HUD from './components/HUD';
import TechStack from './components/TechStack';
import LinkedInReviews from './components/LinkedInReviews';
import FiverrReviews from './components/FiverrReviews';
import { careerData, skillsData, linkedInReviews, fiverrReviews } from './data';
import { audioManager } from './utils/audio';
import TutorialHand from './components/TutorialHand';
import ControlsPopup from './components/ControlsPopup';

const STATION_SPACING = 2500;
const TRACK_LENGTH = (careerData.length + 1) * STATION_SPACING + 3000;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'de'
  const [isMuted, setIsMuted] = useState(false);
  const [showControlsPopup, setShowControlsPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [region, setRegion] = useState('pk');
  const [announcement, setAnnouncement] = useState("");
  const [lastAnnouncedStation, setLastAnnouncedStation] = useState(-1);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isAtStation, setIsAtStation] = useState(false);
  const [stopDuration, setStopDuration] = useState(5);
  const [stopTimer, setStopTimer] = useState(0);
  const [isLocked, setIsLocked] = useState(false); // New lock state for momentum killing
  const isLockedRef = useRef(false); // Ref for logic (avoids re-renders/unsubs)
  const isSnapping = useRef(false);
  const containerRef = useRef(null);
  const lastProgressRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const utteranceRef = useRef(null);

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Physics for Constant Speed Feel (responsive, less inertia)
  const manualProgress = useSpring(0, { mass: 0.1, stiffness: 200, damping: 40, restDelta: 0.001 });

  // Last station explicitly frozen at
  const lastStoppedStationRef = useRef(-1);

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoPaused, setDemoPaused] = useState(false);

  // Sync Ref with State
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  // Preload voices for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices on mount
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      };

      // Voices might load asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }, []);

  // Automated Guided Journey Logic
  useEffect(() => {
    let interval;
    if (gameStarted && isDemoMode && !isLocked && !selectedStation) {
      interval = setInterval(() => {
        // Smooth auto-scroll (Auto Pilot)
        window.scrollBy({ top: 3, behavior: "auto" });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isDemoMode, isLocked, selectedStation]);

  // Update manual progress based on scroll
  useEffect(() => {
    // IMPORTANT: Check refs inside the callback to respect the lock immediately without re-binding
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Logic Lock
      if (gameStarted && !isLockedRef.current && !isSnapping.current) {
        manualProgress.set(latest);
      }
    });

    if (!gameStarted) {
      manualProgress.set(0);
    }

    return () => unsubscribe();
  }, [gameStarted, scrollYProgress, manualProgress]); // Removed isLocked from deps

  const smoothProgress = manualProgress;
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Monitor progress
  useMotionValueEvent(manualProgress, "change", (latest) => {
    // Safety Force: If NaN, reset to last known good or 0
    if (!Number.isFinite(latest)) {
      console.warn("NaN detected in progress");
      return;
    }

    setProgress(latest);
    const isMovingForward = latest > lastProgressRef.current;

    if (latest > 0.7 && region !== 'de') {
      setRegion('de');
    } else if (latest <= 0.7 && region !== 'pk') {
      setRegion('pk');
    }

    // Declare these once for use throughout this scope
    const trainScreenX = (0.2 * window.innerWidth) + 300;
    const scrollableWidth = TRACK_LENGTH - window.innerWidth;

    // Clear announcement if we move away
    if (announcement && lastStoppedStationRef.current !== -1) {
      const stoppedProgress = (careerData[lastStoppedStationRef.current] ? ((lastStoppedStationRef.current + 1) * STATION_SPACING + 1500 - trainScreenX) / scrollableWidth : -1);
      if (Math.abs(latest - stoppedProgress) > 0.002) {
        setAnnouncement("");
      }
    }

    // Check if train is between Cottbus (index 6) and Berlin (index 7)
    // Show delay announcement due to track work in Lübbenau
    if (scrollableWidth > 0) {
      const cottbusX = (6 + 1) * STATION_SPACING + 1500;
      const berlinX = (7 + 1) * STATION_SPACING + 1500;
      const cottbusProgress = (cottbusX - trainScreenX) / scrollableWidth;
      const berlinProgress = (berlinX - trainScreenX) / scrollableWidth;

      // If we're between these two stations and not stopped at a station
      if (latest > cottbusProgress && latest < berlinProgress && !isAtStation) {
        const delayMsg = language === 'de'
          ? "⚠️ Verzögerung wegen Gleisarbeiten in Lübbenau"
          : "⚠️ Delay due to track work in Lübbenau";
        if (announcement !== delayMsg) {
          setAnnouncement(delayMsg);
        }
      } else if (latest <= cottbusProgress || latest >= berlinProgress) {
        // Clear the delay announcement when we're outside this range
        if (announcement.includes("Lübbenau") || announcement.includes("Delay")) {
          setAnnouncement("");
        }
      }
    }

    // BULLETPROOF Aggressive Station Stop Logic: Scans all stations for center crossings
    // The exact screen X where we want the station to align (Train center is at 20vw + 300px)


    for (let i = 0; i < careerData.length; i++) {
      // Skip if we just stopped here or are currently stopped
      if (i === lastStoppedStationRef.current || isAtStation) continue;

      // Calculate the exact progress where station i is centered exactly under the train's midpoint
      const stationX = (i + 1) * STATION_SPACING + 1500;

      if (scrollableWidth <= 0) continue; // Safety check

      const preciseCenter = (stationX - trainScreenX) / scrollableWidth;

      if (!Number.isFinite(preciseCenter)) continue;

      // Trigger if we CROSS this station's precise center marker while moving forward
      if (isMovingForward &&
        preciseCenter > 0 && preciseCenter < 1 && // Ensure valid range
        latest >= preciseCenter &&
        lastProgressRef.current < preciseCenter) {

        // 1. IMPROVED GUARD: Immediately lock state to prevent double-firing
        setIsAtStation(true);
        setIsLocked(true); // HARD STOP: Kills scroll momentum via overflow-hidden
        isSnapping.current = true; // SYNC LOCK: Prevents scroll listener race condition
        setLastAnnouncedStation(i);
        lastStoppedStationRef.current = i; // Immediate Ref update

        // 2. Clear any rogue intervals
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        const station = careerData[i];

        // FORCEFUL SNAP: Calculate and jump to exact center immediately use DOM source of truth
        const targetScroll = Math.max(0, preciseCenter * (document.documentElement.scrollHeight - window.innerHeight));

        // Use requestAnimationFrame to ensure the scroll happens cleanly after this frame
        requestAnimationFrame(() => {
          window.scrollTo({
            top: targetScroll,
            behavior: 'instant'
          });

          // Release the technical snap lock shortly after
          setTimeout(() => {
            isSnapping.current = false;
          }, 100);
        });

        // Synchronize manualProgress to exact center to freeze train there
        manualProgress.set(preciseCenter);

        // Audio Engine Idle
        if (audioManager.engineGain) {
          audioManager.engineGain.gain.setTargetAtTime(0, audioManager.ctx.currentTime, 0.05);
        }

        // Arrival Announcement
        // Visual: None for arrival (per user request)

        audioManager.playHorn(); // Auto horn on arrival

        // Audio: Dynamic Language Announcement (Deutsche Bahn Style)
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();

          // Authentic Deutsche Bahn announcement style
          let spokenText;
          if (language === 'de') {
            const stationNameSpoken = station.title_de || station.title;
            // Real DB style: "Nächster Halt: [Station]. Ausstieg links/rechts."
            spokenText = `Nächster Halt: ${stationNameSpoken}. Ausstieg links.`;
          } else {
            spokenText = `Next Station: ${station.title}`;
          }

          const utterance = new SpeechSynthesisUtterance(spokenText);
          utteranceRef.current = utterance;

          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const preferredVoice = language === 'de'
              ? (voices.find(v => v.lang === 'de-DE') || voices.find(v => v.lang.includes('de')))
              : (voices.find(v => v.lang.includes('en')));

            if (preferredVoice) {
              utterance.voice = preferredVoice;
              utterance.lang = preferredVoice.lang;
            }
          }

          // Slower, more deliberate pace like real DB announcements
          utterance.rate = language === 'de' ? 0.85 : 0.9;
          utterance.pitch = language === 'de' ? 1.0 : 1.0;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        }

        // Logic for Resuming / Mode Handling
        if (isDemoMode) {
          // AUTOMATED GUIDED MODE
          // 1. Wait 2 seconds
          // 2. Open Modal
          setTimeout(() => {
            setSelectedStation(station);
          }, 2000);
        } else {
          // NORMAL MODE
          // Unlock after 1s
          setTimeout(() => {
            setIsLocked(false);
            setIsAtStation(false);
          }, 1000);
        }

        // Visual sequences
        setTimeout(() => setAnnouncement("🛑 STOPPED"), 2500);

        break; // Stop scanning once triggered
      }
    }

    lastProgressRef.current = latest;
  });

  // Resume Demo when Modal Closes
  useEffect(() => {
    // When SelectedStation becomes Null AND we are in Demo Mode AND we are stopped (AtStation)
    // It means the modal just closed (auto or manual). We must resume.
    if (isDemoMode && !selectedStation && isAtStation) {
      // Wait a brief moment then unlock
      setTimeout(() => {
        setIsLocked(false);
        setIsAtStation(false); // This re-enables the loop via !isLocked
        // Engine rev up
        if (audioManager.engineGain) {
          audioManager.engineGain.gain.setTargetAtTime(0.1, audioManager.ctx.currentTime, 0.2);
        }
      }, 1000);
    }
  }, [selectedStation, isDemoMode, isAtStation]);

  // Audio modulation
  useEffect(() => {
    return scrollVelocity.on("change", (latest) => {
      if (gameStarted && !isMuted) {
        const speed = Math.abs(latest) / 1000;
        audioManager.setSpeed(speed);
      }
    });
  }, [scrollVelocity, gameStarted, isMuted]);

  // Force scroll to top when game starts
  useEffect(() => {
    if (gameStarted) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [gameStarted]);

  // Keyboard Controls - disabled when modal is open or at station
  useEffect(() => {
    if (!gameStarted || selectedStation || isLocked) return;

    const handleKeyDown = (e) => {
      const step = 300;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        window.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        window.scrollBy({ top: -step, behavior: 'smooth' });
      } else if (e.key === ' ') {
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'h') {
        audioManager.playHorn();
      } else if (e.key.toLowerCase() === 'r') {
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, selectedStation]);

  const handleStart = async (duration, isDemo = false) => {
    // 1. Initialize and resume audio context (User Gesture required)
    audioManager.init();
    if (audioManager.ctx) {
      await audioManager.ctx.resume();
    }

    // 2. Clear any pending speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Test chime or silent utterance to "unlocked" speech
      const silent = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(silent);
    }

    // 3. Force the page to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 4. Set all states
    setProgress(0);
    setRegion('pk');
    setLastAnnouncedStation(-1);
    setIsAtStation(false);
    setAnnouncement("");
    setStopDuration(duration);
    setIsDemoMode(isDemo); // Set demo mode based on argument

    // 5. Start game
    setTimeout(() => {
      setGameStarted(true);
      audioManager.startEngine();
      audioManager.playHorn(); // Welcome horn

      // Show controls popup after a brief delay (only in normal mode, not demo)
      if (!isDemo) {
        setTimeout(() => {
          setShowControlsPopup(true);
        }, 1000);
      }
    }, 150);
  };

  const handleDemoStart = () => {
    setIsDemoMode(true);
    handleStart(5, true); // Pass true for isDemo
  };

  const handleRestart = () => {
    // 1. Force the page to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 2. Clear all intervals/timers
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // 3. Reset all states
    setGameStarted(false);
    setIsDemoMode(false); // Reset Demo
    setDemoPaused(false);
    setProgress(0);
    setRegion('pk');
    setLastAnnouncedStation(-1);
    setIsAtStation(false);
    setAnnouncement("");
    setStopTimer(0);
    manualProgress.set(0);

    // 4. Audio stop
    if (audioManager.noiseNode) {
      audioManager.noiseNode.stop();
      audioManager.isPlaying = false;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioManager.ctx?.state === 'suspended') audioManager.ctx.resume();
      audioManager.masterGain.gain.setValueAtTime(0.1, audioManager.ctx.currentTime);
    } else {
      setIsMuted(true);
      audioManager.masterGain.gain.setValueAtTime(0, audioManager.ctx.currentTime);
    }
  };

  // Station snapping removed as it's now handled by the arrival trigger logic


  // Station snapping removed as it's now handled by the arrival trigger logic

  // FIX: Reverse transform - at progress 0, show start (x=0), at progress 1, show end (x=-TRACK_LENGTH)
  const x = useTransform(smoothProgress, [0, 1], [0, -TRACK_LENGTH + window.innerWidth]);

  const nextStationIndex = Math.min(Math.floor(progress * careerData.length), careerData.length - 1);
  const nextStationInDB = careerData[nextStationIndex];
  const terminalName = language === 'en' ? "Railway Terminal" : "Hauptbahnhof";
  const berlinFinal = language === 'en' ? "Berlin - Ready to Join" : "Berlin - Bereit für den Einstieg";
  const nextStationName = language === 'de' ? (nextStationInDB?.title_de || nextStationInDB?.title) : nextStationInDB?.title;
  const nextStation = progress < 0.02 ? terminalName : (nextStationName || berlinFinal);

  return (
    <>
      <div ref={containerRef} className={`${gameStarted ? 'h-[1000vh]' : 'h-screen overflow-hidden'} relative bg-db-deep-blue`}>

        {/* Intro Overlay - Shows on top initially */}
        {!gameStarted && (
          <IntroOverlay
            onStart={handleStart}
            onDemoStart={handleDemoStart}
            language={language}
            setLanguage={setLanguage}
          />
        )}

        {/* HUD - Only when game started */}
        {gameStarted && (
          <>
            <HUD
              progress={progress}
              variant={region}
              stationName={nextStation}
              speed={smoothVelocity}
              stopped={isLocked || isAtStation}
              language={language}
            />

            {/* Announcement Banner - Shows delay messages and other announcements */}
            {announcement && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-db-red/95 backdrop-blur-md border-2 border-white/20 px-8 py-4 rounded-xl shadow-2xl"
              >
                <p className="text-white font-bold text-lg font-mono tracking-wider uppercase text-center">
                  {announcement}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Game Content - Always rendered */}
        <div className="fixed inset-0 overflow-hidden">

          <Background scrollX={x} length={TRACK_LENGTH} />

          <motion.div style={{ x }} className="absolute top-0 left-0 h-full flex items-end z-10">

            <Track length={TRACK_LENGTH} />

            <div className="absolute bottom-0 left-0 h-full w-full pointer-events-none z-40">
              {/* Start - Boarding Pass Style Card */}
              <div className="absolute bottom-[450px] left-[calc(20vw+400px)] -translate-x-1/2 z-[100] pointer-events-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-db-dark-grey border-l-4 border-emerald-500 shadow-2xl rounded-r-xl w-[450px] relative text-white font-sans overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{language === 'en' ? 'Boarding Pass' : 'Bordkarte'}</h2>
                      <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{language === 'en' ? 'Authorized Personnel Only' : 'Nur für autorisiertes Personal'}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-emerald-500 font-mono font-bold text-lg">PK-EXP</span>
                      <span className="block text-[9px] text-gray-500 uppercase">{language === 'en' ? 'Interactive Portfolio' : 'Interaktives Portfolio'}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h1 className="text-4xl font-black text-white tracking-tighter mb-2">SIYAB ARSHAD</h1>
                      <p className="text-sm font-mono text-emerald-400 tracking-widest uppercase">{language === 'en' ? 'Software Engineer' : 'Softwareentwickler'}</p>
                    </div>

                    <div className="space-y-3 font-mono text-xs text-gray-400 border-t border-dashed border-gray-700 pt-6">
                      <div className="flex justify-between">
                        <span>{language === 'en' ? 'ORIGIN' : 'HERKUNFT'}</span>
                        <span className="text-white">PAKISTAN</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'en' ? 'DESTINATION' : 'ZIELORT'}</span>
                        <span className="text-white">GERMANY</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'en' ? 'FLEET' : 'FLOTTE'}</span>
                        <span className="text-white">ICE 110</span>
                      </div>
                    </div>

                    <div className="mt-8 bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center">{language === 'en' ? 'Control Instructions' : 'Steuerungshinweise'}</p>
                      <div className="flex justify-center space-x-6 text-white font-bold text-sm">
                        <span className="flex items-center"><span className="bg-white/10 px-2 py-1 rounded mr-2 text-[10px] uppercase">{language === 'en' ? 'Scroll' : 'Scrollen'}</span> {language === 'en' ? 'to Move' : 'zum Bewegen'}</span>
                        <span className="flex items-center"><span className="bg-white/10 px-2 py-1 rounded mr-2 text-[10px] uppercase">{language === 'en' ? 'Space' : 'Leertaste'}</span> {language === 'en' ? 'to Brake' : 'zum Bremsen'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-black rounded-full"></div>
                  <div className="absolute top-1/2 -left-4 w-8 h-8 bg-black rounded-full"></div>
                </motion.div>
              </div>

              {/* Station Markers */}
              {careerData.map((station, index) => {
                if (!station) return null; // Safety
                const isCurrentStop = isAtStation && lastAnnouncedStation === index;
                const xPos = (index + 1) * STATION_SPACING + 1500;

                const isTutorialTarget = isDemoMode && isAtStation && lastAnnouncedStation === index;

                return (
                  <Station
                    key={station.id}
                    station={station}
                    isCurrentStop={isCurrentStop}
                    stopTimer={stopTimer}
                    announcement={announcement}
                    xPos={xPos}
                    onStationClick={(s) => setSelectedStation(s)}
                    isTutorialTarget={isTutorialTarget}
                    language={language}
                  >
                    {station.id === 'freelance' && <FiverrReviews reviews={fiverrReviews} language={language} />}
                    {station.id === 'nova' && <LinkedInReviews reviews={linkedInReviews} language={language} />}
                    {station.id === 'berlin' && <TechStack skills={skillsData} language={language} />}
                  </Station>
                )
              })}

            </div>

          </motion.div>

          {/* Train - Positioned at 20% */}
          <div className="absolute bottom-[184px] left-[20%] z-30 pointer-events-none transition-all duration-1000">
            {region === 'pk' ? <TrainPakistani stopped={isAtStation} /> : <Train stopped={isAtStation} />}
          </div>

        </div>

        {/* Controls - Relocated to Center-Left to avoid HUD overlap */}
        {gameStarted && (
          <div className="fixed top-1/2 -translate-y-1/2 left-6 flex flex-col space-y-4 z-[100]">
            <button
              onClick={toggleMute}
              className="bg-gray-900/90 backdrop-blur p-4 rounded-full hover:bg-db-red transition-all text-white shadow-2xl border-2 border-white/20 group relative"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">MUTE</span>
            </button>

            <button
              onClick={() => audioManager.playHorn()}
              className="bg-gray-900/90 backdrop-blur p-4 rounded-full hover:bg-yellow-600 transition-all text-white shadow-2xl border-2 border-white/20 group relative"
            >
              <motion.span
                whileTap={{ scale: 0.8 }}
                className="block text-xl"
              >📯</motion.span>
              <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">HORN [H]</span>
            </button>

            <button
              onClick={handleRestart}
              className="bg-gray-900/90 backdrop-blur p-4 rounded-full hover:bg-blue-600 transition-all text-white shadow-2xl border-2 border-white/20 group relative"
            >
              <motion.span
                whileTap={{ rotate: -180 }}
                className="block text-xl"
              >🔄</motion.span>
              <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">RESTART [R]</span>
            </button>
          </div>
        )}

        <Ticket isVisible={progress >= 0.99} />
      </div>

      {/* Station Modal - Moved outside to guarantee top-level stacking */}
      {/* Controls Popup */}
      {showControlsPopup && (
        <ControlsPopup
          language={language}
          onDismiss={() => setShowControlsPopup(false)}
        />
      )}

      {selectedStation && (
        <StationModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          isTutorialMode={isDemoMode}
          language={language}
        >
          {selectedStation.id === 'softoo' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-db-red uppercase tracking-widest border-b border-db-red/20 pb-2">
                {language === 'en' ? 'Technical Deep Dive: AI Compliance' : 'Technischer Ausblick: KI-Compliance'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-400 mb-1 font-mono">{language === 'en' ? 'CORE IMPACT' : 'KERNAUSWIRKUNG'}</p>
                  <p className="text-white font-medium">
                    {language === 'en' ? 'Reduced analysis time from hours to minutes using RAG architecture.' : 'Analysezeit von Stunden auf Minuten reduziert durch RAG-Architektur.'}
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-400 mb-1 font-mono">{language === 'en' ? 'ARCHITECTURE' : 'ARCHITEKTUR'}</p>
                  <p className="text-white font-medium">
                    {language === 'en' ? 'Event-driven microservices using NestJS and AWS EventBridge.' : 'Event-gesteuerte Microservices mit NestJS und AWS EventBridge.'}
                  </p>
                </div>
              </div>
              <TechStack skills={{ AI: ["RAG", "LangChain", "OpenAI", "Vector DB"], Cloud: ["Lambda", "S3", "Step Functions"] }} language={language} />
            </div>
          )}

          {selectedStation.id === 'cottbus' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-db-red uppercase tracking-widest border-b border-db-red/20 pb-2">
                {language === 'en' ? 'Current Research & Studies' : 'Aktuelle Forschung & Studium'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-400 mb-1 font-mono">{language === 'en' ? 'MASTER\'S FOCUS' : 'MASTER-FOKUS'}</p>
                  <p className="text-white font-medium">
                    {language === 'en' ? 'Optimization of Transformers for small-form-factor devices and efficient fine-tuning of Large Language Models.' : 'Optimierung von Transformern für Geräte mit kleinem Formfaktor und effiziente Feinabstimmung von LLMs.'}
                  </p>
                </div>
              </div>
              <TechStack skills={{ Research: ["Transformers", "CNNs", "RNNs", "Pytorch", "TensorFlow"], Tools: ["Jupyter", "HuggingFace"] }} language={language} />
            </div>
          )}

          {selectedStation.id === 'nova' && (
            <div className="space-y-6">
              <LinkedInReviews reviews={linkedInReviews} />
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-xl font-bold text-db-red uppercase tracking-widest mb-4">Device Engineering</h4>
                <p className="text-gray-300">Engineered complex BLE handshake protocols for clinical audiometry devices, ensuring 99.9% data packet delivery in noisy clinic environments.</p>
              </div>
            </div>
          )}

          {selectedStation.id === 'education_taxila' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-db-red uppercase tracking-widest border-b border-db-red/20 pb-2">Capstone Project: AI Vision</h4>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-white font-medium">Built a real-time traffic violation detection system using YOLO. Achieved 94% accuracy in identifying helmet-less motorcyclists.</p>
              </div>
              <TechStack skills={{ Stack: ["Python", "OpenCV", "YOLOv5", "Flutter"] }} />
            </div>
          )}

          {selectedStation.id === 'logicator' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-db-red uppercase tracking-widest border-b border-db-red/20 pb-2">Technical Contribution</h4>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-white font-medium">Developed a highly scalable coupon engine supporting 50k+ daily transactions. Implemented granular inventory tracking to prevent stock discrepancies.</p>
              </div>
              <TechStack skills={{ Backend: ["Node.js", "Express", "PostgreSQL"], Logic: ["Coupon Engine", "Inventory Sync"] }} />
            </div>
          )}

          {selectedStation.id === 'germany_move' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-db-red uppercase tracking-widest border-b border-db-red/20 pb-2">Preparation for AI Focus</h4>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-white font-medium">Completed intensive self-study in Linear Algebra, Vector Calculas, and Deep Learning Fundamentals prior to relocating to ensure success in the Master's program.</p>
              </div>
            </div>
          )}

          {selectedStation.id === 'freelance' && <FiverrReviews reviews={fiverrReviews} />}
          {selectedStation.id === 'berlin' && <TechStack skills={skillsData} />}
        </StationModal>
      )}
    </>
  )
}

export default App
