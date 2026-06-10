import { generateSlug } from './slug';

const SETTINGS_KEY = 'invitation_settings';
const INVITEES_KEY = 'invitation_invitees';

const DEFAULT_SETTINGS = {
  groomName: "MUFEED",
  brideName: "FAHIZA",
  groomParents: "Musthafa",
  brideParents: "",
  nikahDate: "Monday, 10th August 2026",
  nikahTime: "4:00 PM",
  nikahVenue: "Orlando City Convention Center",
  nikahAddress: "Komarappady, Kerala, India",
  nikahMapsUrl: "https://share.google/LTTzfqQvZbkdqCUeQ",
  walimahDate: "",
  walimahTime: "",
  walimahVenue: "",
  walimahAddress: "",
  walimahMapsUrl: "",
  countdownTarget: "2026-08-10T16:00:00",
  whatsappTemplate: "Assalamu Alaikum %%GUEST_NAME%%! We joyfully invite you to the wedding reception of %%GROOM_NAME%% & %%BRIDE_NAME%%. View your personal invitation here: %%GUEST_LINK%%"
};

const DEFAULT_INVITEES = [
  {
    id: "1",
    name: "Sarah Ahmed",
    slug: "sarah-ahmed",
    phone: "+919876543210",
    rsvp: "attending",
    guest_count: 3,
    responded_at: "2026-06-08T15:30:00.000Z",
    created_at: "2026-06-08T12:00:00.000Z"
  },
  {
    id: "2",
    name: "Zayd Farooq",
    slug: "zayd-farooq",
    phone: "+919876543211",
    rsvp: "pending",
    guest_count: 0,
    responded_at: null,
    created_at: "2026-06-08T12:05:00.000Z"
  },
  {
    id: "3",
    name: "Yasmin Khan",
    slug: "yasmin-khan",
    phone: "+919876543212",
    rsvp: "declined",
    guest_count: 0,
    responded_at: "2026-06-08T14:15:00.000Z",
    created_at: "2026-06-08T12:10:00.000Z"
  },
  {
    id: "4",
    name: "Omar & Family",
    slug: "omar-family",
    phone: "+919876543213",
    rsvp: "attending",
    guest_count: 5,
    responded_at: "2026-06-08T16:00:00.000Z",
    created_at: "2026-06-08T12:15:00.000Z"
  }
];

export function getSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  const parsed = JSON.parse(data);
  if (parsed.groomName === "Ameer Uddin") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return parsed;
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getInvitees() {
  const data = localStorage.getItem(INVITEES_KEY);
  if (!data) {
    localStorage.setItem(INVITEES_KEY, JSON.stringify(DEFAULT_INVITEES));
    return DEFAULT_INVITEES;
  }
  return JSON.parse(data);
}

export function saveInvitees(invitees) {
  localStorage.setItem(INVITEES_KEY, JSON.stringify(invitees));
}

export function addInvitee(name, phone) {
  const invitees = getInvitees();
  const slug = generateSlug(name, invitees);
  const newInvitee = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    slug,
    phone: phone ? phone.trim() : "",
    rsvp: "pending",
    guest_count: 0,
    responded_at: null,
    created_at: new Date().toISOString()
  };
  invitees.push(newInvitee);
  saveInvitees(invitees);
  return newInvitee;
}

export function updateRSVP(slug, rsvpStatus, guestCount) {
  const invitees = getInvitees();
  const index = invitees.findIndex(inv => inv.slug === slug);
  if (index !== -1) {
    invitees[index] = {
      ...invitees[index],
      rsvp: rsvpStatus,
      guest_count: rsvpStatus === 'attending' ? guestCount : 0,
      responded_at: new Date().toISOString()
    };
    saveInvitees(invitees);
    return invitees[index];
  }
  return null;
}

export function deleteInvitee(id) {
  const invitees = getInvitees();
  const filtered = invitees.filter(inv => inv.id !== id);
  saveInvitees(filtered);
}
