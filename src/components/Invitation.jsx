import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Share2, Plus, Minus, RotateCcw } from 'lucide-react';
import { getInvitees, getSettings, updateRSVP } from '../utils/storage';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Chandelier from './Chandelier';
import DrapedCurtains from './DrapedCurtains';
import AudioPlayer from './AudioPlayer';
import FloatingPetals from './FloatingPetals';
import SubtleAnimatedBackground from './SubtleAnimatedBackground';
import ArabianMonument from './ArabianMonument';

// Decorative components
const SectionDivider = () => (
  <div className="flex items-center justify-center my-10 w-full max-w-sm mx-auto">
    <div className="h-[0.5px] bg-[#aa7c11] flex-grow opacity-30"></div>
    <div className="mx-4 flex items-center space-x-2">
      <svg className="w-3 h-3 text-[#aa7c11] transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" />
      </svg>
      <svg className="w-4 h-4 text-[#aa7c11] transform rotate-45 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" />
      </svg>
      <svg className="w-3 h-3 text-[#aa7c11] transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" />
      </svg>
    </div>
    <div className="h-[0.5px] bg-[#aa7c11] flex-grow opacity-30"></div>
  </div>
);

const CornerBrackets = ({ isInView = true }) => (
  <>
    {/* Top Left */}
    <div className={`bracket-tl transition-transform duration-700 ${isInView ? 'translate-x-0 translate-y-0' : 'translate-x-2 translate-y-2'}`} />
    {/* Top Right */}
    <div className={`bracket-tr transition-transform duration-700 ${isInView ? 'translate-x-0 translate-y-0' : '-translate-x-2 translate-y-2'}`} />
    {/* Bottom Left */}
    <div className={`bracket-bl transition-transform duration-700 ${isInView ? 'translate-x-0 translate-y-0' : 'translate-x-2 -translate-y-2'}`} />
    {/* Bottom Right */}
    <div className={`bracket-br transition-transform duration-700 ${isInView ? 'translate-x-0 translate-y-0' : '-translate-x-2 -translate-y-2'}`} />
  </>
);

const TasselLeft = () => (
  <svg className="w-8 h-24 absolute top-0 right-2 text-[#aa7c11] drop-shadow-md z-50 animate-slow-sway" viewBox="0 0 40 120" fill="currentColor">
    <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="8" fill="currentColor" />
    <path d="M12 55 L28 55 L34 115 L6 115 Z" fill="currentColor" opacity="0.9" />
    <line x1="8" y1="115" x2="32" y2="115" stroke="#e5c185" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="4" fill="#e5c185" />
  </svg>
);

const TasselRight = () => (
  <svg className="w-8 h-24 absolute top-0 left-2 text-[#aa7c11] drop-shadow-md z-50 animate-slow-sway" viewBox="0 0 40 120" fill="currentColor">
    <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="8" fill="currentColor" />
    <path d="M12 55 L28 55 L34 115 L6 115 Z" fill="currentColor" opacity="0.9" />
    <line x1="8" y1="115" x2="32" y2="115" stroke="#e5c185" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="4" fill="#e5c185" />
  </svg>
);

const WaxSeal = ({ onClick, isOpened }) => (
  <div
    className="absolute z-40"
    style={{
      top: '63.33%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  >
    <motion.div
      onClick={onClick}
      className="cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isOpened ? { y: 20, opacity: 0, pointerEvents: 'none' } : { y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl animate-pulse-subtle" viewBox="0 0 100 100">
        {/* Outer irregular wax shape */}
        <path
          fill="#aa7c11"
          stroke="#592911"
          strokeWidth="1.5"
          d="M50 6 C62 4, 76 10, 88 22 C96 34, 94 54, 88 72 C80 86, 62 94, 50 94 C34 94, 16 84, 8 68 C2 50, 4 32, 12 18 C22 6, 38 8, 50 6 Z"
        />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#e5c185" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6" />
        {/* 8-pointed geometric Islamic star */}
        <g stroke="#e5c185" strokeWidth="1.5" fill="none" opacity="0.9">
          <rect x="32" y="32" width="36" height="36" transform="rotate(0 50 50)" />
          <rect x="32" y="32" width="36" height="36" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="7" fill="#3d2212" stroke="#e5c185" strokeWidth="1" />
        </g>
      </svg>
    </motion.div>
  </div>
);

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 35 particles with random positions, delays, durations, and horizontal drift range
    const items = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      size: Math.random() * 4 + 2, // 2px to 6px
      delay: Math.random() * 10, // delay up to 10s
      duration: Math.random() * 15 + 15, // duration 15s to 30s
      drift: Math.random() * 40 - 20, // drift horizontal range -20px to 20px
    }));
    setParticles(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#aa7c11]/30 backdrop-blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            bottom: -20,
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, p.drift, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Custom theme-integrated Leaflet Map component with dynamic geocoding
const LocationMap = ({ venue, address, mapsUrl }) => {
  if (!venue && !address) return null;

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const [coords, setCoords] = useState(null); // [lat, lon]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const geocode = async () => {
      try {
        let query = encodeURIComponent(`${venue || ''} ${address || ''}`.trim());
        let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
          headers: { 'User-Agent': 'WeddingInvitationApp/1.0' }
        });
        let data = await res.json();

        if ((!data || data.length === 0) && address) {
          query = encodeURIComponent(address.trim());
          res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
            headers: { 'User-Agent': 'WeddingInvitationApp/1.0' }
          });
          data = await res.json();
        }

        if (isMounted) {
          if (data && data.length > 0) {
            setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else {
            // Fallback coords
            setCoords([11.1333, 75.8731]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        if (isMounted) {
          setCoords([11.1333, 75.8731]);
          setLoading(false);
        }
      }
    };

    geocode();
    return () => {
      isMounted = false;
    };
  }, [venue, address]);

  useEffect(() => {
    if (!coords || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#aa7c11]/30 animate-ping"></div>
          <div class="relative w-6 h-6 rounded-full bg-[#aa7c11] border border-[#e5c185] flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5 text-[#fdfbf9]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(coords, { icon: customIcon }).addTo(map);

    marker.bindPopup(`
      <div class="text-center font-raleway p-1">
        <h4 class="font-bold text-xs text-[#aa7c11] uppercase tracking-wider">${venue}</h4>
        <p class="text-[10px] text-gray-600 mt-1 leading-snug">${address}</p>
      </div>
    `);

    markerInstanceRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current && coords) {
      mapInstanceRef.current.setView(coords, 15);
      if (markerInstanceRef.current) {
        markerInstanceRef.current.openPopup();
      }
    }
  };

  return (
    <div className="mt-5 w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full relative rounded-lg border border-[#aa7c11]/40 overflow-hidden bg-[#fdfbf9] shadow-sm hover:shadow-md hover:border-[#aa7c11]/70 transition-all map-container group duration-300">
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#aa7c11]/40 z-10 pointer-events-none"></div>
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#aa7c11]/40 z-10 pointer-events-none"></div>
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#aa7c11]/40 z-10 pointer-events-none"></div>
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#aa7c11]/40 z-10 pointer-events-none"></div>

        <div className="p-1.5 w-full">
          <div className="relative w-full h-44 md:h-52 rounded overflow-hidden bg-[#fdfbf9] border border-[#aa7c11]/10">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-[#fdfbf9]/80">
                <div className="w-6 h-6 border-2 border-[#aa7c11] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-wider text-[#aa7c11]/70 font-semibold animate-pulse">Loading map...</span>
              </div>
            ) : (
              <>
                <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

                <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 bg-[#fdfbf9]/90 hover:bg-[#aa7c11] text-[#aa7c11] hover:text-[#fdfbf9] border border-[#aa7c11]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 bg-[#fdfbf9]/90 hover:bg-[#aa7c11] text-[#aa7c11] hover:text-[#fdfbf9] border border-[#aa7c11]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="p-1.5 bg-[#fdfbf9]/90 hover:bg-[#aa7c11] text-[#aa7c11] hover:text-[#fdfbf9] border border-[#aa7c11]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Reset View"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center space-x-2 text-[10px] md:text-xs uppercase font-raleway tracking-widest text-[#aa7c11] hover:text-[#fdfbf9] border border-[#aa7c11]/40 hover:border-[#aa7c11] bg-[#fdfbf9]/65 hover:bg-[#aa7c11] px-5 py-2.5 rounded transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm font-semibold cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
        </a>
      )}
    </div>
  );
};

// Animated section scroll reveal
const ScrollRevealSection = ({ children, className = "" }) => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "-60px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ y: 28, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative manuscript-card p-6 md:p-10 mb-10 w-full max-w-2xl mx-auto shadow-md ${className}`}
    >
      <div className="manuscript-card-inner" />
      <CornerBrackets isInView={inView} />
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
};

export default function Invitation() {
  const { slug } = useParams();
  const [settings, setSettings] = useState(getSettings());
  const [guest, setGuest] = useState({ name: 'Honored Guest', slug: 'guest', rsvp: 'pending', guest_count: 0 });
  const [stage, setStage] = useState('envelope'); // 'envelope', 'opening', 'curtains-closing', 'curtains-opening', 'revealed'

  // RSVP Form States
  const [rsvpStep, setRsvpStep] = useState(1);
  const [rsvpSelection, setRsvpSelection] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [submittingRSVP, setSubmittingRSVP] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load guest details
  useEffect(() => {
    const invitees = getInvitees();
    const found = invitees.find(inv => inv.slug === slug);
    if (found) {
      setGuest(found);
      if (found.rsvp !== 'pending') {
        setRsvpSelection(found.rsvp);
        setGuestCount(found.guest_count || 1);
        setRsvpStep(3);
      }
    }
  }, [slug]);

  // Live Countdown timer calculations
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(settings.countdownTarget) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settings.countdownTarget]);

  // Lock scroll when envelope screen is active
  useEffect(() => {
    if (stage !== 'revealed') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [stage]);

  // Stage sequences
  const handleOpenEnvelope = () => {
    if (stage !== 'envelope') return;
    setStage('opening');

    // Stage 2 ends after 1.2s -> Start Stage 3 (Curtains Close)
    setTimeout(() => {
      setStage('curtains-closing');

      // Curtains fully closed after 0.6s -> swap to curtains opening / render page
      setTimeout(() => {
        setStage('curtains-opening');

        // Curtains part open over 1.8s -> fully revealed
        setTimeout(() => {
          setStage('revealed');
        }, 1800);
      }, 600);
    }, 1200);
  };

  // Submit RSVP
  const handleConfirmRSVP = () => {
    setSubmittingRSVP(true);
    const finalCount = rsvpSelection === 'attending' ? guestCount : 0;

    setTimeout(() => {
      const updated = updateRSVP(guest.slug, rsvpSelection, finalCount);
      if (updated) {
        setGuest(updated);
      } else {
        setGuest(prev => ({
          ...prev,
          rsvp: rsvpSelection,
          guest_count: finalCount
        }));
      }
      setRsvpStep(3);
      setSubmittingRSVP(false);
    }, 600);
  };

  // WhatsApp template replacements
  const getWhatsAppLink = () => {
    const template = settings.whatsappTemplate;
    const guestLink = `${window.location.origin}/invite/${guest.slug}`;

    let msg = template
      .replace(/%%GUEST_NAME%%/g, guest.name)
      .replace(/GUEST_NAME/g, guest.name)
      .replace(/%%GUEST_LINK%%/g, guestLink)
      .replace(/GUEST_LINK/g, guestLink)
      .replace(/%%GROOM_NAME%%/g, settings.groomName)
      .replace(/%%BRIDE_NAME%%/g, settings.brideName)
      .replace(/%%NIKAH_DATE%%/g, settings.nikahDate)
      .replace(/%%NIKAH_VENUE%%/g, settings.nikahVenue);

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen text-[#5c3f2b] font-amiri select-none relative bg-[#fdfaf5]">

      {/* 1. CURTAINS LAYER OVERLAY */}
      <AnimatePresence>
        {stage !== 'envelope' && stage !== 'opening' && (
          <DrapedCurtains stage={stage === 'curtains-opening' ? 'curtains-parting' : stage} className="fixed inset-0 z-50 pointer-events-none" />
        )}
      </AnimatePresence>

      {/* 2. ENVELOPE ENTRY STAGE */}
      {stage !== 'revealed' && stage !== 'curtains-opening' && stage !== 'curtains-closing' && (
        <div className="fixed inset-0 z-40 bg-dark-brown-vignette flex flex-col items-center justify-center p-4">

          <motion.p
            className="text-[#aa7c11]/80 font-raleway tracking-widest text-[11px] uppercase mb-6 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {settings.walimahDate ? "N I K A H   &   W A L I M A H" : "W E D D I N G   &   R E C E P T I O N"}
          </motion.p>

          {/* Envelope Card */}
          <div className="relative w-full max-w-[460px] aspect-[1.55] select-none perspective-[1000px]">
            <div
              onClick={handleOpenEnvelope}
              className={`w-full h-full relative rounded-lg bg-[#241c12] noise-bg border border-[#aa7c11]/20 envelope-shadow-curl transition-all duration-300 ${stage === 'envelope' ? 'hover:scale-[1.01] cursor-pointer' : ''}`}
            >
              {/* Back Card Inside (Rising Up) */}
              <motion.div
                className="absolute inset-x-[4%] bottom-[4%] bg-[#fdfbf9] noise-bg parchment-vignette border border-[#aa7c11]/30 rounded shadow-inner p-4 flex flex-col justify-between"
                style={{ top: '8%', originY: 1, position: 'absolute' }}
                animate={stage !== 'envelope' ? { y: -130, scale: 1.02, opacity: 1 } : { y: 0, scale: 0.96, opacity: 0 }}
                transition={{ duration: 1.2, ease: "anticipate" }}
              >
                <div className="border border-[#aa7c11]/15 h-full w-full rounded p-3 flex flex-col justify-between items-center text-center">
                  <span className="text-[10px] uppercase font-raleway text-[#aa7c11] tracking-widest font-bold">Personal Invitation</span>
                  <div className="my-auto">
                    <p className="text-[11px] font-raleway text-[#aa7c11] uppercase tracking-wider">Dear</p>
                    <p className="text-xl md:text-2xl text-[#5c3f2b] font-semibold italic mt-1 px-2 border-b border-[#aa7c11]/30 pb-1">
                      {guest.name}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-raleway text-[#aa7c11] tracking-widest font-bold">Open</span>
                </div>
              </motion.div>

              {/* Envelope pocket front cover */}
              <div
                className="absolute inset-0 bg-[#1c160e] noise-bg border border-[#aa7c11]/10 rounded-lg z-20 flex flex-col justify-end p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden"
                style={{ position: 'absolute' }}
              >
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 L50 40 L100 100 Z" fill="#0c0905" />
                  <path d="M0 0 L50 40 L0 100 Z" fill="#0c0905" />
                  <path d="M100 0 L50 40 L100 100 Z" fill="#0c0905" />
                </svg>
              </div>

              {/* Envelope Top Flap */}
              <motion.div
                className="absolute top-0 left-0 w-full aspect-[1.55] origin-top z-30 overflow-visible"
                style={{ transformStyle: 'preserve-3d' }}
                animate={stage !== 'envelope' ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.2, ease: "anticipate" }}
              >
                <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ backfaceVisibility: 'hidden' }}>
                  <path d="M0 0 L50 38 L100 0 Z" fill="#1e180f" stroke="#aa7c11" strokeWidth="0.15" />
                  <path d="M0 0 L50 38 L100 0 Z" fill="url(#flapNoise)" opacity="0.04" />
                  <defs>
                    <filter id="flapNoise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
                    </filter>
                  </defs>
                </svg>

                <div className="absolute inset-x-0 top-[22%] text-center px-4 select-none flex flex-col items-center justify-start pointer-events-none" style={{ backfaceVisibility: 'hidden' }}>
                  <p className="arabic-calligraphy text-lg md:text-xl text-[#aa7c11] font-semibold tracking-wide leading-relaxed gold-glow">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                  </p>
                  <p className="text-[10px] md:text-[11px] font-raleway text-[#aa7c11] uppercase tracking-wider mt-4 font-bold">
                    Tap to open your invitation
                  </p>
                </div>

                <WaxSeal onClick={handleOpenEnvelope} isOpened={stage !== 'envelope'} />
              </motion.div>
            </div>
          </div>

          <Link to="/dashboard" className="mt-12 text-[#aa7c11]/70 font-raleway text-[11px] uppercase tracking-wider hover:text-[#aa7c11] transition-colors border border-[#aa7c11]/20 px-4 py-1.5 rounded hover:bg-[#aa7c11]/5">
            Host Dashboard
          </Link>
        </div>
      )}

      {/* 3. REVEALED INVITATION PAGE */}
      {(stage === 'revealed' || stage === 'curtains-opening' || stage === 'curtains-closing') && (
        <div className="w-full bg-[#fdfaf5] noise-bg parchment-vignette min-h-screen relative overflow-hidden select-text">

          {/* Subtle Animated Background */}
          <SubtleAnimatedBackground />

          {/* Ambient Particles & Rose Petals backdrop */}
          <FloatingParticles />
          {stage === 'revealed' && <FloatingPetals />}

          {/* 3A. HERO SECTION */}
          <section className="relative w-full h-screen flex flex-col justify-between items-center bg-transparent overflow-hidden px-12 py-16 text-center select-none border-b border-[#aa7c11]/20">

            {/* Hanging crystal chandelier centerpiece */}
            <div className="absolute top-0 left-[50%] translate-x-[-50%] z-10">
              <Chandelier />
            </div>

            {/* Central typography block */}
            <div className="flex-grow flex flex-col justify-center items-center mt-32 sm:mt-24 z-10 max-w-lg">
              {guest && (
                <div className="animate-fade-in mb-5">
                  <span className="font-raleway text-xs sm:text-sm tracking-widest text-[#aa7c11] font-bold uppercase bg-[#fdfbf9]/95 px-5 py-2 rounded-full border border-[#aa7c11]/40 shadow-lg">
                    Especially Invited: {guest.name}
                  </span>
                </div>
              )}

              <span className="font-amiri text-2xl text-[#aa7c11] mb-2 font-semibold">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </span>

              <h2 className="font-cormorant text-xs tracking-wider text-[#8d6648] uppercase mb-4 font-bold">
                Request the honor of your presence for the wedding of
              </h2>

              {/* Couple Names */}
              <h1 className="font-pinyon text-6xl sm:text-7xl md:text-8xl font-normal text-[#aa7c11] drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.12)] leading-none select-text py-2">
                {settings.groomName}
                <span className="block font-cormorant text-3xl my-3 text-[#aa7c11] italic">&</span>
                {settings.brideName}
              </h1>

              <div className="w-16 h-[0.75px] bg-[#aa7c11] my-6"></div>

              {/* Event date summary */}
              <p className="font-cormorant text-lg sm:text-xl font-medium tracking-wide text-[#5c3f2b] uppercase select-text">
                {settings.nikahDate}
              </p>
              <p className="font-cormorant text-xs sm:text-sm text-[#8d6648] mt-1 select-text">
                {settings.nikahVenue}
              </p>
            </div>

            {/* Small Arabian Monument in Hero Background (pinned to bottom border, far left) */}
            <div className="absolute bottom-0 left-8 sm:left-20 md:left-28 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[380px] z-0 opacity-[0.8] flex justify-start items-end">
              <ArabianMonument />
            </div>

            {/* Pulse Indicator */}
            <div className="absolute bottom-4 left-[50%] translate-x-[-50%] z-20 flex flex-col items-center">
              <span className="font-raleway text-[9px] uppercase tracking-widest text-[#8d6648] mb-1">
                Scroll down
              </span>
              <div className="w-4 h-6 border border-[#aa7c11]/40 rounded-full flex justify-center p-1">
                <motion.div
                  className="w-1.5 h-1.5 bg-[#aa7c11] rounded-full"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
            </div>
          </section>

          {/* 3B. SCROLLABLE DETAILS CONTENT */}
          {stage === 'revealed' && (
            <div className="w-full max-w-4xl mx-auto px-6 py-20 space-y-24 flex flex-col items-center z-10 relative">

              {/* Opening Blessings Block */}
              <ScrollRevealSection>
                <div className="text-center space-y-4 max-w-xl mx-auto">
                  <span className="font-amiri text-3xl sm:text-4xl text-[#aa7c11] block drop-shadow-[0_1px_2px_rgba(201,160,96,0.2)]">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </span>
                  <p className="font-cormorant text-sm text-[#8d6648] italic select-text">
                    "In the name of Allah, the Most Gracious, the Most Merciful"
                  </p>

                  <SectionDivider />

                  <p className="font-cormorant text-lg text-[#5c3f2b] select-text px-4 sm:px-0">
                    {settings.groomParents && settings.brideParents ? (
                      <>
                        Together with their families, <strong className="text-[#5c3f2b] font-semibold">{settings.groomParents}</strong> & <strong className="text-[#5c3f2b] font-semibold">{settings.brideParents}</strong>
                      </>
                    ) : settings.groomParents ? (
                      <>
                        Together with their families, <strong className="text-[#5c3f2b] font-semibold">{settings.groomParents}</strong>
                      </>
                    ) : (
                      "Together with their families, we"
                    )}
                    {" "}joyfully invite you to celebrate the wedding ceremony of
                  </p>
                </div>
              </ScrollRevealSection>

              {/* Family Profiles / Parents Block */}
              <ScrollRevealSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto text-center mt-2">
                  {/* Groom's Family */}
                  <div className="space-y-3 p-6 bg-[#fdfbf9]/60 rounded-lg border border-[#aa7c11]/15">
                    <span className="font-raleway text-[10px] uppercase tracking-widest text-[#aa7c11] font-bold">
                      The Groom
                    </span>
                    <h3 className="font-cormorant text-2xl font-semibold text-[#5c3f2b] select-text">
                      {settings.groomName}
                    </h3>
                    <div className="w-8 h-[0.5px] bg-[#aa7c11] mx-auto"></div>
                    {settings.groomParents && (
                      <p className="font-cormorant text-sm text-[#8d6648] select-text">
                        Son of {settings.groomParents}
                      </p>
                    )}
                  </div>

                  {/* Bride's Family */}
                  <div className="space-y-3 p-6 bg-[#fdfbf9]/60 rounded-lg border border-[#aa7c11]/15">
                    <span className="font-raleway text-[10px] uppercase tracking-widest text-[#aa7c11] font-bold">
                      The Bride
                    </span>
                    <h3 className="font-cormorant text-2xl font-semibold text-[#5c3f2b] select-text">
                      {settings.brideName}
                    </h3>
                    <div className="w-8 h-[0.5px] bg-[#aa7c11] mx-auto"></div>
                    {settings.brideParents && (
                      <p className="font-cormorant text-sm text-[#8d6648] select-text">
                        Daughter of {settings.brideParents}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollRevealSection>

              {/* Live Countdown Timer */}
              <ScrollRevealSection className="bg-[#fdfbf9]/30 border-[#aa7c11]/20">
                <div className="text-center">
                  <span className="text-xs uppercase font-raleway text-[#aa7c11] tracking-widest block mb-4">
                    Counting Down To The Union
                  </span>

                  <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto my-2">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Mins', value: timeLeft.minutes },
                      { label: 'Secs', value: timeLeft.seconds }
                    ].map(unit => (
                      <div key={unit.label} className="flex flex-col items-center p-2 rounded bg-[#fdfbf9]/80 border border-[#aa7c11]/10">
                        <span className="font-amiri font-light text-2xl md:text-4xl text-[#aa7c11] tabular-nums tracking-tighter" style={{ textShadow: '0 0 10px rgba(170, 124, 17, 0.15)' }}>
                          {String(unit.value).padStart(2, '0')}
                        </span>
                        <span className="font-raleway text-[9px] uppercase tracking-widest text-[#8d6648] mt-1">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollRevealSection>

              {/* Event Cards Section */}
              <div className={`grid gap-8 w-full max-w-4xl my-4 ${settings.walimahDate ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>

                {/* Event 1 Card (Nikah) */}
                <ScrollRevealSection>
                  <div className="flex flex-col h-full justify-between items-center text-center">
                    <div className="mb-4">
                      <span className="text-xs font-raleway uppercase text-[#8d6648] tracking-widest">
                        {settings.walimahDate ? "Ceremony" : "Wedding Ceremony"}
                      </span>
                      <h3 className="text-2xl text-[#aa7c11] font-bold my-1">
                        {settings.walimahDate ? "Nikah Ceremony" : "Reception"}
                      </h3>
                      <span className="text-[#aa7c11] text-lg block italic">نِكَاح</span>
                    </div>

                    <SectionDivider />

                    <div className="space-y-4 my-2 text-sm text-[#5c3f2b]">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-4 h-4 text-[#aa7c11] mb-1" />
                        <p className="font-semibold">{settings.nikahDate}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <Clock className="w-4 h-4 text-[#aa7c11] mb-1" />
                        <p>{settings.nikahTime}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <MapPin className="w-4 h-4 text-[#aa7c11] mb-1" />
                        <p className="font-semibold">{settings.nikahVenue}</p>
                        <p className="text-xs text-[#8d6648] mt-0.5">{settings.nikahAddress}</p>
                      </div>
                    </div>

                    <LocationMap venue={settings.nikahVenue} address={settings.nikahAddress} mapsUrl={settings.nikahMapsUrl} />
                  </div>
                </ScrollRevealSection>

                {/* Event 2 Card (Walimah) */}
                {settings.walimahDate && (
                  <ScrollRevealSection>
                    <div className="flex flex-col h-full justify-between items-center text-center">
                      <div className="mb-4">
                        <span className="text-xs font-raleway uppercase text-[#8d6648] tracking-widest">Reception</span>
                        <h3 className="text-2xl text-[#aa7c11] font-bold my-1">Walimah Reception</h3>
                        <span className="text-[#aa7c11] text-lg block italic">وَلِيمَة</span>
                      </div>

                      <SectionDivider />

                      <div className="space-y-4 my-2 text-sm text-[#5c3f2b]">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-4 h-4 text-[#aa7c11] mb-1" />
                          <p className="font-semibold">{settings.walimahDate}</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <Clock className="w-4 h-4 text-[#aa7c11] mb-1" />
                          <p>{settings.walimahTime}</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <MapPin className="w-4 h-4 text-[#aa7c11] mb-1" />
                          <p className="font-semibold">{settings.walimahVenue}</p>
                          <p className="text-xs text-[#8d6648] mt-0.5">{settings.walimahAddress}</p>
                        </div>
                      </div>

                      <LocationMap venue={settings.walimahVenue} address={settings.walimahAddress} mapsUrl={settings.walimahMapsUrl} />
                    </div>
                  </ScrollRevealSection>
                )}
              </div>

              {/* Family section (Compliments) */}
              <ScrollRevealSection className="w-full max-w-xl my-4">
                <div className="bg-[#fdfbf9]/50 border border-[#aa7c11]/15 rounded-lg p-6 text-center select-text">
                  <h4 className="text-sm uppercase font-raleway text-[#aa7c11] tracking-widest mb-3 font-semibold">
                    With Best Compliments From
                  </h4>
                  <p className="text-[#5c3f2b] text-md leading-relaxed font-semibold">
                    Musthafa (Father)
                  </p>
                  <div className="w-8 h-[1px] bg-[#aa7c11]/50 mx-auto my-3"></div>
                  <p className="text-[#8d6648] text-sm tracking-wide leading-relaxed font-raleway">
                    Navaf, Fahad, Jameela, Ramna, Sheheera
                  </p>
                </div>
              </ScrollRevealSection>

              {/* RSVP Form Section */}
              <ScrollRevealSection className="border-[#aa7c11]/30">
                <div className="text-center max-w-md mx-auto">
                  <span className="text-xs uppercase font-raleway text-[#aa7c11] tracking-widest block mb-2 font-bold">
                    R S V P
                  </span>
                  <h3 className="text-2xl text-[#5c3f2b] font-semibold mb-6">Response Form</h3>

                  <AnimatePresence mode="wait">
                    {rsvpStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-[#8d6648] mb-6">
                          Kindly let us know if you will be attending our celebration by selecting an option below.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              setRsvpSelection('attending');
                              setRsvpStep(2);
                            }}
                            className="flex flex-col items-center justify-center p-4 border border-[#aa7c11]/45 rounded-lg hover:border-[#aa7c11] hover:bg-[#aa7c11]/5 transition-all group active:scale-95 cursor-pointer"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform mb-1">😊</span>
                            <span className="font-raleway text-[11px] uppercase tracking-wider font-bold text-[#aa7c11]">Yes, I Will Attend</span>
                          </button>
                          <button
                            onClick={() => {
                              setRsvpSelection('declined');
                              setRsvpStep(2);
                            }}
                            className="flex flex-col items-center justify-center p-4 border border-[#aa7c11]/45 rounded-lg hover:border-[#aa7c11] hover:bg-[#aa7c11]/5 transition-all group active:scale-95 cursor-pointer"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform mb-1">😔</span>
                            <span className="font-raleway text-[11px] uppercase tracking-wider font-bold text-[#8d6648]">No, I Cannot</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {rsvpStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                      >
                        {rsvpSelection === 'attending' ? (
                          <div className="space-y-4">
                            <p className="text-sm text-[#8d6648]">
                              Wonderful! How many guests (including yourself) should we prepare for?
                            </p>
                            <div className="flex items-center justify-center space-x-6 py-2">
                              <button
                                onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                                className="w-10 h-10 rounded-full border border-[#aa7c11]/30 flex items-center justify-center text-lg font-bold text-[#aa7c11] hover:bg-[#aa7c11]/5 active:scale-90 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-raleway text-2xl font-semibold w-12 text-[#5c3f2b]">{guestCount}</span>
                              <button
                                onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
                                className="w-10 h-10 rounded-full border border-[#aa7c11]/30 flex items-center justify-center text-lg font-bold text-[#aa7c11] hover:bg-[#aa7c11]/5 active:scale-90 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-[#8d6648]">
                              We are sorry to hear that. Confirm your response and we will convey your prayers to the couple.
                            </p>
                            <p className="text-xs italic text-[#aa7c11] font-raleway uppercase tracking-wider py-2">
                              "Are you sure you cannot make it?"
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              setRsvpStep(1);
                              setRsvpSelection(null);
                            }}
                            className="flex-1 font-raleway text-xs uppercase tracking-widest border border-[#aa7c11]/30 py-2.5 rounded text-[#8d6648] hover:bg-[#aa7c11]/5 transition-colors active:scale-95 cursor-pointer"
                            disabled={submittingRSVP}
                          >
                            Back
                          </button>
                          <button
                            onClick={handleConfirmRSVP}
                            className="flex-grow font-raleway text-xs uppercase tracking-widest bg-[#aa7c11] text-[#fdfbf9] py-2.5 rounded hover:bg-[#8d6648] transition-colors active:scale-95 font-semibold flex items-center justify-center space-x-2 cursor-pointer"
                            disabled={submittingRSVP}
                          >
                            {submittingRSVP ? (
                              <span className="border-2 border-[#fdfbf9] border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
                            ) : (
                              <span>Confirm RSVP</span>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {rsvpStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 py-2"
                      >
                        {guest.rsvp === 'attending' ? (
                          <div className="space-y-2 text-[#5c3f2b]">
                            <span className="text-3xl block">🎉</span>
                            <h4 className="text-lg font-semibold text-[#aa7c11]">Response Confirmed!</h4>
                            <p className="text-sm text-[#8d6648] max-w-xs mx-auto leading-relaxed">
                              Thank you! We look forward to celebrating with you. We have registered <strong className="text-[#aa7c11]">{guest.guest_count}</strong> guests under your invitation.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[#5c3f2b]">
                            <span className="text-3xl block">🕊️</span>
                            <h4 className="text-lg font-semibold text-[#8d6648]">Response Confirmed</h4>
                            <p className="text-sm text-[#8d6648] max-w-xs mx-auto leading-relaxed">
                              We will miss you! Thank you for letting us know. Your warm prayers and blessings are highly appreciated.
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setRsvpStep(1);
                          }}
                          className="mt-4 font-raleway text-[10px] uppercase tracking-widest text-[#aa7c11]/60 hover:text-[#aa7c11] transition-colors border border-[#aa7c11]/10 px-4 py-1.5 rounded hover:bg-[#aa7c11]/5 cursor-pointer"
                        >
                          Change Response
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollRevealSection>

              {/* Footer Blessing & Ameen */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-center my-12 w-full max-w-lg px-4"
              >
                <h2 className="arabic-calligraphy text-2xl text-[#aa7c11] font-bold tracking-wide leading-relaxed mb-4 gold-glow">
                  بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </h2>
                <p className="text-sm font-raleway text-[#8d6648] tracking-wider leading-relaxed italic max-w-md mx-auto">
                  Barakallahu Lakuma — May Allah bless you both and unite you in goodness
                </p>

                <p className="arabic-calligraphy text-3xl text-[#aa7c11] font-bold mt-4 gold-glow">آمِيْن</p>
                <p className="text-[10px] font-raleway text-[#8d6648] uppercase tracking-widest mt-1">Ameen</p>

                <SectionDivider />

                <p className="text-xs font-raleway uppercase tracking-widest text-[#aa7c11] font-semibold my-4">
                  Your duas and presence are our greatest gift
                </p>

                <div className="w-full max-w-md mx-auto mt-6">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#25d366] to-[#128c7e] hover:from-[#128c7e] hover:to-[#075e54] text-white font-raleway text-xs uppercase tracking-widest py-3 rounded-lg shadow-md transition-all active:scale-[0.98] font-bold cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>

                <div className="mt-12 opacity-40 hover:opacity-100 transition-opacity">
                  <Link to="/dashboard" className="text-[#aa7c11] font-raleway text-[10px] uppercase tracking-widest underline decoration-[#aa7c11]">
                    Access Host Dashboard
                  </Link>
                </div>
              </motion.div>
            </div>
          )}

          {/* Background Audio Controller */}
          <AudioPlayer startPlaying={stage === 'revealed' || stage === 'curtains-opening'} />

        </div>
      )}
    </div>
  );
}
