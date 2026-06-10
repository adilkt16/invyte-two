import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Share2, Heart, Award, Plus, Minus, RotateCcw } from 'lucide-react';
import { getInvitees, getSettings, updateRSVP } from '../utils/storage';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Decorative components
const SectionDivider = () => (
  <div className="flex items-center justify-center my-10 w-full max-w-sm mx-auto">
    <div className="h-[0.5px] bg-[#c9a84c] flex-grow opacity-50"></div>
    <div className="mx-4 flex items-center space-x-2">
      <svg className="w-3 h-3 text-[#c9a84c] transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" />
      </svg>
      <svg className="w-4 h-4 text-[#d4af37] transform rotate-45 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" />
      </svg>
      <svg className="w-3 h-3 text-[#c9a84c] transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" />
      </svg>
    </div>
    <div className="h-[0.5px] bg-[#c9a84c] flex-grow opacity-50"></div>
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
  <svg className="w-8 h-24 absolute top-0 right-2 text-[#c9a84c] drop-shadow-md z-50" viewBox="0 0 40 120" fill="currentColor">
    <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="8" fill="currentColor" />
    <path d="M12 55 L28 55 L34 115 L6 115 Z" fill="currentColor" opacity="0.9" />
    <line x1="8" y1="115" x2="32" y2="115" stroke="#d4af37" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="4" fill="#d4af37" />
  </svg>
);

const TasselRight = () => (
  <svg className="w-8 h-24 absolute top-0 left-2 text-[#c9a84c] drop-shadow-md z-50" viewBox="0 0 40 120" fill="currentColor">
    <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="8" fill="currentColor" />
    <path d="M12 55 L28 55 L34 115 L6 115 Z" fill="currentColor" opacity="0.9" />
    <line x1="8" y1="115" x2="32" y2="115" stroke="#d4af37" strokeWidth="2.5" />
    <circle cx="20" cy="45" r="4" fill="#d4af37" />
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
      <svg className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl" viewBox="0 0 100 100">
        {/* Outer irregular wax shape */}
        <path
          d="M50 6 C62 4, 76 10, 88 22 C96 34, 94 54, 88 72 C80 86, 62 94, 50 94 C34 94, 16 84, 8 68 C2 50, 4 32, 12 18 C22 6, 38 8, 50 6 Z"
          fill="#d4af37"
          stroke="#aa7c11"
          strokeWidth="1"
        />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6" />
        {/* 8-pointed geometric Islamic star */}
        <g stroke="#c9a84c" strokeWidth="1.5" fill="none" opacity="0.9">
          <rect x="32" y="32" width="36" height="36" transform="rotate(0 50 50)" />
          <rect x="32" y="32" width="36" height="36" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="7" fill="#1e180f" stroke="#c9a84c" strokeWidth="1" />
        </g>
      </svg>
    </motion.div>
  </div>
);

const FloatingDiamonds = () => {
  const diamonds = [
    { id: 1, left: "12%", delay: 0, duration: 16, size: "w-3 h-3" },
    { id: 2, left: "28%", delay: 4, duration: 24, size: "w-5 h-5" },
    { id: 3, left: "72%", delay: 1, duration: 20, size: "w-4 h-4" },
    { id: 4, left: "45%", delay: 6, duration: 22, size: "w-3 h-3" },
    { id: 5, left: "85%", delay: 3, duration: 18, size: "w-5 h-5" },
    { id: 6, left: "60%", delay: 8, duration: 25, size: "w-4 h-4" }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {diamonds.map((d) => (
        <motion.div
          key={d.id}
          className={`absolute bg-[#c9a84c]/20 rotate-45 ${d.size}`}
          style={{
            left: d.left,
            bottom: "-20px",
          }}
          animate={{
            y: ["0vh", "-110vh"],
            rotate: [45, 405],
          }}
          transition={{
            y: {
              duration: d.duration,
              repeat: Infinity,
              ease: "linear",
              delay: d.delay,
            },
            rotate: {
              duration: d.duration,
              repeat: Infinity,
              ease: "linear",
              delay: d.delay,
            },
          }}
        />
      ))}
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
        // Try geocoding full venue name + address first
        let query = encodeURIComponent(`${venue || ''} ${address || ''}`.trim());
        let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
          headers: { 'User-Agent': 'WeddingInvitationApp/1.0' }
        });
        let data = await res.json();
        
        // Fallback to just address if venue geocoding returned nothing
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
            // Fallback to central Kerala coords
            setCoords([11.1333, 75.8731]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        if (isMounted) {
          // Fallback on error
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

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 15,
      zoomControl: false, // Use custom zoom controls
      attributionControl: false // Hide leaflet logo to keep it super clean
    });

    mapInstanceRef.current = map;

    // CartoDB Positron - elegant light tiles perfect for matching manuscript look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Custom pulsing marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#d4af37]/30 animate-ping"></div>
          <div class="relative w-6 h-6 rounded-full bg-[#d4af37] border border-[#c9a84c] flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5 text-[#1e180f]">
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
    
    // Bind popup
    marker.bindPopup(`
      <div class="text-center font-raleway p-1">
        <h4 class="font-bold text-xs text-[#d4af37] uppercase tracking-wider">${venue}</h4>
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
      {/* Visual map container styling */}
      <div className="w-full relative rounded-lg border border-[#c9a84c]/40 overflow-hidden bg-[#1e180f] shadow-sm hover:shadow-md hover:border-[#c9a84c]/70 transition-all map-container group duration-300">
        {/* Decorative corner brackets matching the manuscript card style */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#d4af37]/40 z-10 pointer-events-none"></div>
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#d4af37]/40 z-10 pointer-events-none"></div>
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#d4af37]/40 z-10 pointer-events-none"></div>
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#d4af37]/40 z-10 pointer-events-none"></div>

        {/* Frame padding */}
        <div className="p-1.5 w-full">
          <div className="relative w-full h-44 md:h-52 rounded overflow-hidden bg-[#1e180f] border border-[#d4af37]/10">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-[#1c160e]/80">
                <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37]/70 font-semibold animate-pulse">Loading map...</span>
              </div>
            ) : (
              <>
                <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />
                
                {/* Custom Overlay Map Controls */}
                <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
                  <button 
                    onClick={handleZoomIn}
                    className="p-1.5 bg-[#1e180f]/90 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#1e180f] border border-[#d4af37]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className="p-1.5 bg-[#1e180f]/90 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#1e180f] border border-[#d4af37]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleResetView}
                    className="p-1.5 bg-[#1e180f]/90 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#1e180f] border border-[#d4af37]/30 hover:border-transparent rounded shadow-md transition-all active:scale-95 cursor-pointer"
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
          className="mt-3.5 inline-flex items-center space-x-2 text-[10px] md:text-xs uppercase font-raleway tracking-widest text-[#d4af37] hover:text-[#1e180f] border border-[#d4af37]/40 hover:border-[#d4af37] bg-[#1e180f]/65 hover:bg-[#d4af37] px-5 py-2.5 rounded transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm font-semibold"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
        </a>
      )}
    </div>
  );
};

export default function Invitation() {
  const { slug } = useParams();
  const [settings, setSettings] = useState(getSettings());
  const [guest, setGuest] = useState({ name: 'Honored Guest', slug: 'guest', rsvp: 'pending', guest_count: 0 });
  const [stage, setStage] = useState('envelope'); // 'envelope', 'opening', 'curtains-closing', 'curtains-opening', 'revealed'
  
  // RSVP Form States
  const [rsvpStep, setRsvpStep] = useState(1); // 1: Yes/No, 2: Details, 3: Success
  const [rsvpSelection, setRsvpSelection] = useState(null); // 'attending' or 'declined'
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
      // Synchronize RSVP step with guest's existing response
      if (found.rsvp !== 'pending') {
        setRsvpSelection(found.rsvp);
        setGuestCount(found.guest_count || 1);
        setRsvpStep(3); // Already submitted
      }
    }
  }, [slug]);

  // Handle countdown calculation
  useEffect(() => {
    const targetDate = new Date(settings.countdownTarget);

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
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

        // Curtains part open over 1.4s -> fully revealed
        setTimeout(() => {
          setStage('revealed');
        }, 1400);
      }, 600);
    }, 1200);
  };

  // Submit RSVP
  const handleConfirmRSVP = () => {
    setSubmittingRSVP(true);
    const finalCount = rsvpSelection === 'attending' ? guestCount : 0;
    
    // Simulate slight network lag for tactile feel
    setTimeout(() => {
      const updated = updateRSVP(guest.slug, rsvpSelection, finalCount);
      if (updated) {
        setGuest(updated);
      } else {
        // Fallback for general guest testing
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
    <div className="min-h-screen text-[#fcf8f2] font-amiri select-none relative bg-[#1a0f00]">
      
      {/* Background audio loop placeholder or custom elements if needed */}
      <AnimatePresence>
        {/* Curtains overlay - framing remains visible after envelope is opened */}
        {stage !== 'envelope' && stage !== 'opening' && (
          <div className="fixed inset-0 z-50 pointer-events-none flex overflow-hidden">
            {/* Left Curtain panel */}
            <motion.div
              className="w-1/2 h-full relative z-50 overflow-visible"
              initial={{ x: "-100%" }}
              animate={stage === 'curtains-closing' ? { x: "0%" } : { x: "var(--curtain-open-x-left)" }}
              transition={{
                duration: stage === 'curtains-closing' ? 0.6 : 1.4,
                ease: stage === 'curtains-closing' ? "easeOut" : "easeInOut"
              }}
            >
              <div className="w-full h-full curtain-damask border-r border-[#c9a84c]/20 shadow-2xl flex flex-col justify-start items-end animate-curtain-sway-left relative overflow-visible">
                {/* Curly/Wavy Edge SVG */}
                <svg className="absolute top-0 bottom-0 right-[-15px] w-[16px] h-full pointer-events-none drop-shadow-md z-30" viewBox="0 0 16 1000" preserveAspectRatio="none">
                  <path d="M0 0 Q 12 25, 0 50 Q 12 75, 0 100 Q 12 125, 0 150 Q 12 175, 0 200 Q 12 225, 0 250 Q 12 275, 0 300 Q 12 325, 0 350 Q 12 375, 0 400 Q 12 425, 0 450 Q 12 475, 0 500 Q 12 525, 0 550 Q 12 575, 0 600 Q 12 625, 0 650 Q 12 675, 0 700 Q 12 725, 0 750 Q 12 775, 0 800 Q 12 825, 0 850 Q 12 875, 0 900 Q 12 925, 0 950 Q 12 975, 0 1000 L0 1000 Z" fill="#3d0c0c" />
                  <path d="M0 0 Q 12 25, 0 50 Q 12 75, 0 100 Q 12 125, 0 150 Q 12 175, 0 200 Q 12 225, 0 250 Q 12 275, 0 300 Q 12 325, 0 350 Q 12 375, 0 400 Q 12 425, 0 450 Q 12 475, 0 500 Q 12 525, 0 550 Q 12 575, 0 600 Q 12 625, 0 650 Q 12 675, 0 700 Q 12 725, 0 750 Q 12 775, 0 800 Q 12 825, 0 850 Q 12 875, 0 900 Q 12 925, 0 950 Q 12 975, 0 1000" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
                </svg>
                <TasselLeft />
              </div>
            </motion.div>

            {/* Right Curtain panel */}
            <motion.div
              className="w-1/2 h-full relative z-50 overflow-visible"
              initial={{ x: "100%" }}
              animate={stage === 'curtains-closing' ? { x: "0%" } : { x: "var(--curtain-open-x-right)" }}
              transition={{
                duration: stage === 'curtains-closing' ? 0.6 : 1.4,
                ease: stage === 'curtains-closing' ? "easeOut" : "easeInOut"
              }}
            >
              <div className="w-full h-full curtain-damask border-l border-[#c9a84c]/20 shadow-2xl flex flex-col justify-start items-start animate-curtain-sway-right relative overflow-visible">
                {/* Curly/Wavy Edge SVG (Mirrored) */}
                <svg className="absolute top-0 bottom-0 left-[-15px] w-[16px] h-full pointer-events-none drop-shadow-md z-30 scale-x-[-1]" viewBox="0 0 16 1000" preserveAspectRatio="none">
                  <path d="M0 0 Q 12 25, 0 50 Q 12 75, 0 100 Q 12 125, 0 150 Q 12 175, 0 200 Q 12 225, 0 250 Q 12 275, 0 300 Q 12 325, 0 350 Q 12 375, 0 400 Q 12 425, 0 450 Q 12 475, 0 500 Q 12 525, 0 550 Q 12 575, 0 600 Q 12 625, 0 650 Q 12 675, 0 700 Q 12 725, 0 750 Q 12 775, 0 800 Q 12 825, 0 850 Q 12 875, 0 900 Q 12 925, 0 950 Q 12 975, 0 1000 L0 1000 Z" fill="#3d0c0c" />
                  <path d="M0 0 Q 12 25, 0 50 Q 12 75, 0 100 Q 12 125, 0 150 Q 12 175, 0 200 Q 12 225, 0 250 Q 12 275, 0 300 Q 12 325, 0 350 Q 12 375, 0 400 Q 12 425, 0 450 Q 12 475, 0 500 Q 12 525, 0 550 Q 12 575, 0 600 Q 12 625, 0 650 Q 12 675, 0 700 Q 12 725, 0 750 Q 12 775, 0 800 Q 12 825, 0 850 Q 12 875, 0 900 Q 12 925, 0 950 Q 12 975, 0 1000" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
                </svg>
                <TasselRight />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stage 1 & 2: Envelope screen */}
      {stage !== 'revealed' && stage !== 'curtains-opening' && (
        <div className="fixed inset-0 z-40 bg-dark-brown-vignette flex flex-col items-center justify-center p-4">
          
          {/* Subtle instructions */}
          <motion.p
            className="text-[#c9a84c]/60 font-raleway tracking-widest text-[11px] uppercase mb-6"
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
              className={`w-full h-full relative rounded-lg bg-[#241c12] noise-bg border border-[#d4af37]/15 envelope-shadow-curl transition-all duration-300 ${stage === 'envelope' ? 'hover:scale-[1.01]' : ''}`}
            >
              {/* Back Card Inside (Rising Up) */}
              <motion.div
                className="absolute inset-x-[4%] bottom-[4%] bg-[#18130a] noise-bg parchment-vignette border border-[#c9a84c]/30 rounded shadow-inner p-4 flex flex-col justify-between"
                style={{ top: '8%', originY: 1, position: 'absolute' }}
                animate={stage !== 'envelope' ? { y: -130, scale: 1.02, opacity: 1 } : { y: 0, scale: 0.96, opacity: 0 }}
                transition={{ duration: 1.2, ease: "anticipate" }}
              >
                <div className="border border-[#d4af37]/10 h-full w-full rounded p-3 flex flex-col justify-between items-center text-center">
                  <span className="text-[10px] uppercase font-raleway text-[#c9a84c] tracking-widest">Personal Invitation</span>
                  <div className="my-auto">
                    <p className="text-[11px] font-raleway text-[#d4af37] uppercase tracking-wider">Dear</p>
                    <p className="text-xl md:text-2xl text-[#fcf8f2] font-semibold italic mt-1 px-2 border-b border-[#c9a84c]/30 pb-1">
                      {guest.name}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-raleway text-[#d4af37] tracking-widest font-bold">Open</span>
                </div>
              </motion.div>

              {/* Envelope pocket front cover (z-index 20) */}
              <div 
                className="absolute inset-0 bg-[#1c160e] noise-bg border border-[#d4af37]/10 rounded-lg z-20 flex flex-col justify-end p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden"
                style={{ position: 'absolute' }}
              >
                {/* Visual folds on pocket */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 L50 40 L100 100 Z" fill="#0c0905" />
                  <path d="M0 0 L50 40 L0 100 Z" fill="#0c0905" />
                  <path d="M100 0 L50 40 L100 100 Z" fill="#0c0905" />
                </svg>
              </div>

              {/* Envelope Top Flap (Triangular flap) (z-index 30) */}
              <motion.div
                className="absolute top-0 left-0 w-full aspect-[1.55] origin-top z-30 overflow-visible"
                style={{ transformStyle: 'preserve-3d' }}
                animate={stage !== 'envelope' ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.2, ease: "anticipate" }}
              >
                {/* Triangular SVG Shape */}
                <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ backfaceVisibility: 'hidden' }}>
                  <path d="M0 0 L50 38 L100 0 Z" fill="#1e180f" stroke="#d4af37" strokeWidth="0.15" />
                  <path d="M0 0 L50 38 L100 0 Z" fill="url(#flapNoise)" opacity="0.04" />
                  
                  <defs>
                    <filter id="flapNoise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
                    </filter>
                  </defs>
                </svg>

                {/* Calligraphy and instructions inside the flap area */}
                <div className="absolute inset-x-0 top-[22%] text-center px-4 select-none flex flex-col items-center justify-start pointer-events-none" style={{ backfaceVisibility: 'hidden' }}>
                  <p className="arabic-calligraphy text-lg md:text-xl text-[#c9a84c] font-semibold tracking-wide leading-relaxed gold-glow">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                  </p>
                  <p className="text-[10px] md:text-[11px] font-raleway text-[#c9a84c] uppercase tracking-wider mt-4">
                    Tap to open your invitation
                  </p>
                </div>

                {/* Wax Seal */}
                <WaxSeal onClick={handleOpenEnvelope} isOpened={stage !== 'envelope'} />
              </motion.div>
            </div>
          </div>

          {/* Quick link to dashboard for convenience */}
          <Link to="/dashboard" className="mt-12 text-[#c9a84c]/50 font-raleway text-[11px] uppercase tracking-wider hover:text-[#c9a84c] transition-colors border border-[#c9a84c]/20 px-4 py-1.5 rounded hover:bg-[#c9a84c]/5">
            Host Dashboard
          </Link>
        </div>
      )}

      {/* Main invitation page (shown after curtains part) */}
      {(stage === 'revealed' || stage === 'curtains-opening') && (
        <div className="w-full bg-[#18130a] noise-bg parchment-vignette min-h-screen py-10 px-8 md:px-16 lg:px-24 relative overflow-hidden arabesque-pattern select-text">
          
          {/* Floating Diamonds backdrop */}
          <FloatingDiamonds />

          {/* Wrapper container for centered content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Header: Bismillah Calligraphy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10 w-full max-w-lg"
            >
              <h2 className="arabic-calligraphy text-2xl md:text-3xl text-[#c9a84c] font-bold tracking-wide mb-2 gold-glow">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </h2>
              <p className="text-sm font-raleway text-[#c9a84c] italic tracking-wider font-light">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </motion.div>

            {/* Invitation Details Container */}
            <ScrollRevealSection>
              <div className="text-center">
                <span className="text-xs uppercase font-raleway text-[#d4af37] tracking-widest block mb-4">
                  Wedding Invitation
                </span>
                
                {/* Host names */}
                <p className="text-md text-[#c9a84c] font-light max-w-lg mx-auto leading-relaxed mb-6">
                  {settings.groomParents && settings.brideParents ? (
                    <>
                      Together with their families, <strong className="text-[#fcf8f2] font-semibold">{settings.groomParents}</strong> & <strong className="text-[#fcf8f2] font-semibold">{settings.brideParents}</strong>
                    </>
                  ) : settings.groomParents ? (
                    <>
                      Together with their families, <strong className="text-[#fcf8f2] font-semibold">{settings.groomParents}</strong>
                    </>
                  ) : (
                    "Together with their families, we"
                  )}
                  {" "}joyfully invite you to celebrate the wedding ceremony of
                </p>

                {/* Honorees (Groom & Bride) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 my-8">
                  {/* Groom */}
                  <div className="text-center md:text-right flex-1 w-full">
                    <h2 className="text-3xl md:text-4xl text-[#d4af37] font-bold leading-tight">
                      {settings.groomName}
                    </h2>
                    {settings.groomParents && (
                      <p className="text-[11px] md:text-xs font-raleway text-[#c9a84c] uppercase tracking-wider mt-1">
                        Son of {settings.groomParents}
                      </p>
                    )}
                  </div>

                  {/* Connector */}
                  <div className="my-2 md:my-0 flex items-center justify-center">
                    <span className="text-[#c9a84c] text-3xl font-light font-amiri italic">&amp;</span>
                  </div>

                  {/* Bride */}
                  <div className="text-center md:text-left flex-1 w-full">
                    <h2 className="text-3xl md:text-4xl text-[#d4af37] font-bold leading-tight">
                      {settings.brideName}
                    </h2>
                    {settings.brideParents && (
                      <p className="text-[11px] md:text-xs font-raleway text-[#c9a84c] uppercase tracking-wider mt-1">
                        Daughter of {settings.brideParents}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <span className="text-[#c9a84c] text-xl block tracking-wide italic font-bold">إِنْ شَاءَ اللَّهُ</span>
                  <span className="text-[10px] font-raleway uppercase text-[#c9a84c] tracking-widest block mt-0.5">Insha Allah</span>
                </div>
              </div>
            </ScrollRevealSection>

            {/* Personalized Guest Welcome */}
            <ScrollRevealSection className="bg-[#1e180f]/45">
              <div className="text-center py-2">
                <span className="text-[10px] uppercase font-raleway text-[#d4af37] tracking-widest block mb-1">
                  Especial Guest
                </span>
                <p className="text-2xl md:text-3xl text-[#c9a84c] font-semibold italic inline-block border-b border-[#c9a84c]/50 pb-2 px-6">
                  {guest.name}
                </p>
                <p className="text-xs text-[#c9a84c] font-raleway tracking-wider mt-4 uppercase max-w-sm mx-auto leading-relaxed">
                  We request the honor of your presence and blessings on this auspicious occasion.
                </p>
              </div>
            </ScrollRevealSection>

            {/* Events Detail (Nikah and Walimah) */}
            <div className={`grid gap-8 w-full max-w-4xl my-4 ${settings.walimahDate ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
              
              {/* Event 1: Nikah / Main Ceremony */}
              <ScrollRevealSection>
                <div className="flex flex-col h-full justify-between items-center text-center">
                  <div className="mb-4">
                    <span className="text-xs font-raleway uppercase text-[#c9a84c] tracking-widest">
                      {settings.walimahDate ? "Ceremony" : "Wedding Ceremony"}
                    </span>
                    <h3 className="text-2xl text-[#d4af37] font-bold my-1">
                      {settings.walimahDate ? "Nikah Ceremony" : "Reception"}
                    </h3>
                    <span className="text-[#c9a84c] text-lg block italic">
                      {settings.walimahDate ? "نِكَاح" : "وَلِيمَة"}
                    </span>
                  </div>

                  <SectionDivider />

                  <div className="space-y-4 my-2 text-sm text-[#fcf8f2]">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-4 h-4 text-[#c9a84c] mb-1" />
                      <p className="font-semibold">{settings.nikahDate}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-[#c9a84c] mb-1" />
                      <p>{settings.nikahTime}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <MapPin className="w-4 h-4 text-[#c9a84c] mb-1" />
                      <p className="font-semibold">{settings.nikahVenue}</p>
                      <p className="text-xs text-[#c9a84c] mt-0.5">{settings.nikahAddress}</p>
                    </div>
                  </div>

                  <LocationMap venue={settings.nikahVenue} address={settings.nikahAddress} mapsUrl={settings.nikahMapsUrl} />
                </div>
              </ScrollRevealSection>

              {/* Event 2: Walimah (Only render if date is specified) */}
              {settings.walimahDate && (
                <ScrollRevealSection>
                  <div className="flex flex-col h-full justify-between items-center text-center">
                    <div className="mb-4">
                      <span className="text-xs font-raleway uppercase text-[#c9a84c] tracking-widest">Reception</span>
                      <h3 className="text-2xl text-[#d4af37] font-bold my-1">Walimah Reception</h3>
                      <span className="text-[#c9a84c] text-lg block italic">وَلِيمَة</span>
                    </div>

                    <SectionDivider />

                    <div className="space-y-4 my-2 text-sm text-[#fcf8f2]">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-4 h-4 text-[#c9a84c] mb-1" />
                        <p className="font-semibold">{settings.walimahDate}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <Clock className="w-4 h-4 text-[#c9a84c] mb-1" />
                        <p>{settings.walimahTime}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <MapPin className="w-4 h-4 text-[#c9a84c] mb-1" />
                        <p className="font-semibold">{settings.walimahVenue}</p>
                        <p className="text-xs text-[#c9a84c] mt-0.5">{settings.walimahAddress}</p>
                      </div>
                    </div>

                    <LocationMap venue={settings.walimahVenue} address={settings.walimahAddress} mapsUrl={settings.walimahMapsUrl} />
                  </div>
                </ScrollRevealSection>
              )}
            </div>

            {/* Family section (Compliments) */}
            <ScrollRevealSection className="w-full max-w-xl my-4">
              <div className="bg-[#1e180f]/30 border border-[#d4af37]/15 rounded-lg p-6 text-center select-text">
                <h4 className="text-sm uppercase font-raleway text-[#d4af37] tracking-widest mb-3 font-semibold">
                  With Best Compliments From
                </h4>
                <p className="text-[#fcf8f2] text-md leading-relaxed font-semibold">
                  Musthafa (Father)
                </p>
                <div className="w-8 h-[1px] bg-[#c9a84c]/50 mx-auto my-3"></div>
                <p className="text-[#c9a84c] text-sm tracking-wide leading-relaxed font-raleway">
                  Navaf, Fahad, Jameela, Ramna, Sheheera
                </p>
              </div>
            </ScrollRevealSection>

            {/* Countdown timer */}
            <ScrollRevealSection className="bg-[#1e180f]/20 border-[#c9a84c]/20">
              <div className="text-center">
                <span className="text-xs uppercase font-raleway text-[#c9a84c] tracking-widest block mb-4">
                  Counting Down To The Union
                </span>

                <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto my-2">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds }
                  ].map(unit => (
                    <div key={unit.label} className="flex flex-col items-center p-2 rounded bg-[#1e180f]/45 border border-[#d4af37]/5">
                      <span className="font-amiri font-light text-2xl md:text-4xl text-[#d4af37] tabular-nums tracking-tighter" style={{ textShadow: '0 0 10px rgba(212, 175, 55, 0.25)' }}>
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span className="font-raleway text-[9px] uppercase tracking-widest text-[#c9a84c] mt-1">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollRevealSection>

            {/* RSVP Section */}
            <ScrollRevealSection className="border-[#d4af37]/30">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs uppercase font-raleway text-[#d4af37] tracking-widest block mb-2 font-bold">
                  R S V P
                </span>
                <h3 className="text-2xl text-[#fcf8f2] font-semibold mb-6">Response Form</h3>

                <AnimatePresence mode="wait">
                  {/* Step 1: Attendance Choice */}
                  {rsvpStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-[#c9a84c] mb-6">
                        Kindly let us know if you will be attending our celebration by selecting an option below.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setRsvpSelection('attending');
                            setRsvpStep(2);
                          }}
                          className="flex flex-col items-center justify-center p-4 border border-[#c9a84c]/40 rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all group active:scale-95"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform mb-1">😊</span>
                          <span className="font-raleway text-xs uppercase tracking-widest font-semibold text-[#d4af37]">Yes, I Will Attend</span>
                        </button>
                        <button
                          onClick={() => {
                            setRsvpSelection('declined');
                            setRsvpStep(2);
                          }}
                          className="flex flex-col items-center justify-center p-4 border border-[#c9a84c]/40 rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all group active:scale-95"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform mb-1">😔</span>
                          <span className="font-raleway text-xs uppercase tracking-widest font-semibold text-[#c9a84c]">No, I Cannot</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Details / Confirmation */}
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
                          <p className="text-sm text-[#c9a84c]">
                            Wonderful! How many guests (including yourself) should we prepare for?
                          </p>
                          <div className="flex items-center justify-center space-x-6 py-2">
                            <button
                              onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                              className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-lg font-bold text-[#d4af37] hover:bg-[#d4af37]/5 active:scale-90"
                            >
                              -
                            </button>
                            <span className="font-raleway text-2xl font-semibold w-12 text-[#fcf8f2]">{guestCount}</span>
                            <button
                              onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
                              className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-lg font-bold text-[#d4af37] hover:bg-[#d4af37]/5 active:scale-90"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-[#c9a84c]">
                            We are sorry to hear that. Confirm your response and we will convey your prayers to the couple.
                          </p>
                          <p className="text-xs italic text-[#d4af37] font-raleway uppercase tracking-wider py-2">
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
                          className="flex-1 font-raleway text-xs uppercase tracking-widest border border-[#c9a84c]/30 py-2.5 rounded text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors active:scale-95"
                          disabled={submittingRSVP}
                        >
                          Back
                        </button>
                        <button
                          onClick={handleConfirmRSVP}
                          className="flex-grow font-raleway text-xs uppercase tracking-widest bg-[#d4af37] text-[#1e180f] py-2.5 rounded hover:bg-[#aa7c11] transition-colors active:scale-95 font-semibold flex items-center justify-center space-x-2"
                          disabled={submittingRSVP}
                        >
                          {submittingRSVP ? (
                            <span className="border-2 border-[#1e180f] border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
                          ) : (
                            <span>Confirm RSVP</span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Thank you Success */}
                  {rsvpStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4 py-2"
                    >
                      {guest.rsvp === 'attending' ? (
                        <div className="space-y-2 text-[#fcf8f2]">
                          <span className="text-3xl block">🎉</span>
                          <h4 className="text-lg font-semibold text-[#d4af37]">Response Confirmed!</h4>
                          <p className="text-sm text-[#c9a84c] max-w-xs mx-auto leading-relaxed">
                            Thank you! We look forward to celebrating with you. We have registered <strong className="text-[#d4af37]">{guest.guest_count}</strong> guests under your invitation.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 text-[#fcf8f2]">
                          <span className="text-3xl block">🕊️</span>
                          <h4 className="text-lg font-semibold text-[#c9a84c]">Response Confirmed</h4>
                          <p className="text-sm text-[#c9a84c] max-w-xs mx-auto leading-relaxed">
                            We will miss you! Thank you for letting us know. Your warm prayers and blessings are highly appreciated.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setRsvpStep(1);
                        }}
                        className="mt-4 font-raleway text-[10px] uppercase tracking-widest text-[#d4af37]/60 hover:text-[#d4af37] transition-colors border border-[#d4af37]/10 px-4 py-1.5 rounded hover:bg-[#d4af37]/5"
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
              <h2 className="arabic-calligraphy text-2xl text-[#c9a84c] font-bold tracking-wide leading-relaxed mb-4 gold-glow">
                بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
              </h2>
              <p className="text-sm font-raleway text-[#c9a84c] tracking-wider leading-relaxed italic max-w-md mx-auto">
                Barakallahu Lakuma — May Allah bless you both and unite you in goodness
              </p>
              
              <p className="arabic-calligraphy text-3xl text-[#c9a84c] font-bold mt-4 gold-glow">آمِيْن</p>
              <p className="text-[10px] font-raleway text-[#c9a84c] uppercase tracking-widest mt-1">Ameen</p>

              <SectionDivider />

              <p className="text-xs font-raleway uppercase tracking-widest text-[#d4af37] font-semibold my-4">
                Your duas and presence are our greatest gift
              </p>

              {/* Guest share button */}
              <div className="w-full max-w-md mx-auto mt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#25d366] to-[#128c7e] hover:from-[#128c7e] hover:to-[#075e54] text-[#1e180f] font-raleway text-xs uppercase tracking-widest py-3 rounded-lg shadow-md transition-all active:scale-[0.98] font-bold"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>

              {/* Quick link to dashboard for convenience */}
              <div className="mt-12 opacity-40 hover:opacity-100 transition-opacity">
                <Link to="/dashboard" className="text-[#c9a84c] font-raleway text-[10px] uppercase tracking-widest underline decoration-[#c9a84c]">
                  Access Host Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
