import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, UserMinus, Plus, Clipboard, Check, Trash2, 
  Search, FileSpreadsheet, Send, ExternalLink, Settings, Sparkles, HelpCircle 
} from 'lucide-react';
import { 
  getInvitees, saveInvitees, getSettings, saveSettings, addInvitee, deleteInvitee 
} from '../utils/storage';
import { generateSlug } from '../utils/slug';

export default function Dashboard() {
  const [invitees, setInvitees] = useState([]);
  const [settings, setSettings] = useState(getSettings());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'invitees', 'add-import', 'settings'
  
  // Single Add form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [singleSuccessLink, setSingleSuccessLink] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // CSV Import state
  const [csvFile, setCsvFile] = useState(null);
  const [csvPasteText, setCsvPasteText] = useState('');
  const [importProgress, setImportProgress] = useState(null); // { current, total, status }
  const [csvError, setCsvError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRSVP, setFilterRSVP] = useState('all'); // 'all', 'pending', 'attending', 'declined'

  // Settings form states
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Load invitees initially
  useEffect(() => {
    setInvitees(getInvitees());
  }, []);

  // Sync state helper
  const refreshInviteesList = () => {
    setInvitees(getInvitees());
  };

  // Stats calculation
  const totalInvited = invitees.length;
  const attendingCount = invitees.filter(inv => inv.rsvp === 'attending').length;
  const declinedCount = invitees.filter(inv => inv.rsvp === 'declined').length;
  const pendingCount = invitees.filter(inv => inv.rsvp === 'pending').length;
  
  // Sum guest count for those who are attending
  const totalGuestCount = invitees.reduce((acc, curr) => {
    if (curr.rsvp === 'attending') {
      return acc + (curr.guest_count || 1); // fallback to 1 if guest count not saved properly
    }
    return acc;
  }, 0);

  // Response rates
  const attendingPercent = totalInvited > 0 ? Math.round((attendingCount / totalInvited) * 100) : 0;
  const declinedPercent = totalInvited > 0 ? Math.round((declinedCount / totalInvited) * 100) : 0;
  const pendingPercent = totalInvited > 0 ? Math.round((pendingCount / totalInvited) * 100) : 0;

  // Recent responses: sorted by responded_at (descending)
  const recentResponses = [...invitees]
    .filter(inv => inv.responded_at !== null)
    .sort((a, b) => new Date(b.responded_at) - new Date(a.responded_at))
    .slice(0, 8);

  // Handle copy text helper
  const handleCopyLink = (slug, id) => {
    const link = `http://localhost:5173/invite/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add single invitee
  const handleAddSingle = (e) => {
    if (!newName.trim()) return;
    const newGuest = addInvitee(newName, newPhone);
    refreshInviteesList();
    setSingleSuccessLink(`http://localhost:5173/invite/${newGuest.slug}`);
    setNewName('');
    setNewPhone('');
  };

  // Handle CSV parser
  const handleCSVImport = () => {
    let text = csvPasteText.trim();
    if (!text && !csvFile) {
      setCsvError('Please upload a file or paste CSV text.');
      return;
    }

    setCsvError('');
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        processCSVText(e.target.result);
      };
      reader.onerror = () => {
        setCsvError('Error reading file.');
      };
      reader.readAsText(csvFile);
    } else {
      processCSVText(text);
    }
  };

  const processCSVText = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) {
      setCsvError('No rows found in CSV data.');
      return;
    }

    let headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    let dataLines = lines.slice(1);
    
    // Fallback: If no headers found, treat first line as data and use columns name, phone
    let nameIndex = headers.indexOf('name');
    let phoneIndex = headers.indexOf('phone');

    if (nameIndex === -1 && phoneIndex === -1) {
      // No headers matches, assume col 0 is name, col 1 is phone (if exists)
      nameIndex = 0;
      phoneIndex = lines[0].split(',').length > 1 ? 1 : -1;
      dataLines = lines; // Don't skip first row as header
    }

    const currentInvitees = getInvitees();
    const importedRows = [];

    setImportProgress({ current: 0, total: dataLines.length, status: 'Processing...' });

    let index = 0;
    const processBatch = () => {
      const limit = Math.min(index + 20, dataLines.length);
      for (; index < limit; index++) {
        const rowText = dataLines[index];
        // simple CSV row split handling quotes
        const row = rowText.split(',').map(val => val.trim().replace(/^["']|["']$/g, ''));
        if (row.length === 0 || !row[nameIndex]) continue;

        const name = row[nameIndex];
        const phone = phoneIndex !== -1 ? row[phoneIndex] : '';
        const slug = generateSlug(name, [...currentInvitees, ...importedRows]);
        
        importedRows.push({
          id: Math.random().toString(36).substring(2, 9),
          name: name.trim(),
          slug,
          phone: phone ? phone.trim() : "",
          rsvp: "pending",
          guest_count: 0,
          responded_at: null,
          created_at: new Date().toISOString()
        });
      }

      setImportProgress({ current: index, total: dataLines.length, status: 'Importing...' });

      if (index < dataLines.length) {
        setTimeout(processBatch, 50);
      } else {
        const finalInvitees = [...currentInvitees, ...importedRows];
        saveInvitees(finalInvitees);
        setInvitees(finalInvitees);
        setImportProgress({ current: dataLines.length, total: dataLines.length, status: 'Completed!' });
        setCsvFile(null);
        setCsvPasteText('');
        setTimeout(() => setImportProgress(null), 3000);
      }
    };

    processBatch();
  };

  // Delete invitee
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      deleteInvitee(id);
      refreshInviteesList();
    }
  };

  // Save wedding details settings
  const handleSaveSettings = () => {
    saveSettings(settingsForm);
    setSettings(settingsForm);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // Build WhatsApp template for direct WA link sharing
  const getWhatsAppShareURL = (guestItem) => {
    const baseWA = "https://wa.me/";
    const phoneClean = guestItem.phone ? guestItem.phone.replace(/[^\d+]/g, '') : '';
    const guestLink = `http://localhost:5173/invite/${guestItem.slug}`;

    let msg = settings.whatsappTemplate
      .replace(/%%GUEST_NAME%%/g, guestItem.name)
      .replace(/GUEST_NAME/g, guestItem.name)
      .replace(/%%GUEST_LINK%%/g, guestLink)
      .replace(/GUEST_LINK/g, guestLink)
      .replace(/%%GROOM_NAME%%/g, settings.groomName)
      .replace(/%%BRIDE_NAME%%/g, settings.brideName)
      .replace(/%%NIKAH_DATE%%/g, settings.nikahDate)
      .replace(/%%NIKAH_VENUE%%/g, settings.nikahVenue);

    const waLink = phoneClean 
      ? `${baseWA}${phoneClean}?text=${encodeURIComponent(msg)}`
      : `${baseWA}?text=${encodeURIComponent(msg)}`;
      
    return waLink;
  };

  // Filter invitees
  const filteredInvitees = invitees.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRSVP === 'all' || inv.rsvp === filterRSVP;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0c0905] text-[#fcf8f2] font-raleway select-none">
      
      {/* Header bar */}
      <header className="bg-[#1a0f00] text-[#1e180f] py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center border-b border-[#c9a84c]/20 shadow-md">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Sparkles className="w-5 h-5 text-[#c9a84c] animate-pulse" />
            <h1 className="text-lg md:text-xl font-bold font-amiri tracking-wider">
              {settings.groomName} &amp; {settings.brideName}'s Wedding Dashboard
            </h1>
          </div>
          <p className="text-xs text-[#c9a84c] font-raleway tracking-widest uppercase mt-0.5">
            Nikah &amp; Walimah Host Portal
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-center md:text-right border border-[#c9a84c]/30 px-3 py-1 rounded bg-[#0c0905]/50">
          <span className="font-amiri text-[#c9a84c] text-sm font-semibold">{settings.nikahDate}</span>
        </div>
      </header>

      {/* Main Workspace container */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-[#c9a84c]/30 mb-8 gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'invitees', label: 'All Invitees', icon: FileSpreadsheet },
            { id: 'add-import', label: 'Add & Import', icon: Plus },
            { id: 'settings', label: 'Wedding Details', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 transition-colors active:scale-95 ${active ? 'border-[#d4af37] text-[#d4af37] bg-[#1e180f]/20' : 'border-transparent text-[#c9a84c] hover:text-[#d4af37] hover:bg-[#1e180f]/10'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white rounded-lg border border-[#c9a84c]/20 shadow-sm p-4 md:p-8">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Invited', value: totalInvited, icon: Users, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/5' },
                  { label: 'Attending', value: attendingCount, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Declined', value: declinedCount, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Pending', value: pendingCount, icon: UserMinus, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Total Guest Count', value: totalGuestCount, icon: UserCheck, color: 'text-[#d4af37]', bg: 'bg-[#1e180f]/20' }
                ].map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`${stat.bg} p-5 rounded-lg border border-[#c9a84c]/10 flex flex-col justify-between`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">{stat.label}</span>
                        <Icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                      </div>
                      <span className={`text-3xl font-extrabold ${stat.color} font-raleway`}>
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Response Rate Progress Bar */}
              <div className="border border-[#c9a84c]/15 rounded-lg p-5 bg-[#0c0905]/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">RSVP Response Rate</h3>
                  <span className="text-xs text-[#c9a84c] font-medium">
                    {totalInvited > 0 ? `${Math.round(((attendingCount + declinedCount) / totalInvited) * 100)}% responded` : 'No invitees yet'}
                  </span>
                </div>

                <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                  {totalInvited > 0 ? (
                    <>
                      <div 
                        style={{ width: `${attendingPercent}%` }} 
                        className="bg-green-500 h-full transition-all duration-1000 flex items-center justify-center text-[10px] text-white font-bold"
                        title={`Attending: ${attendingPercent}%`}
                      >
                        {attendingPercent > 10 && `${attendingPercent}%`}
                      </div>
                      <div 
                        style={{ width: `${declinedPercent}%` }} 
                        className="bg-red-500 h-full transition-all duration-1000 flex items-center justify-center text-[10px] text-white font-bold"
                        title={`Declined: ${declinedPercent}%`}
                      >
                        {declinedPercent > 10 && `${declinedPercent}%`}
                      </div>
                      <div 
                        style={{ width: `${pendingPercent}%` }} 
                        className="bg-amber-500 h-full transition-all duration-1000 flex items-center justify-center text-[10px] text-white font-bold"
                        title={`Pending: ${pendingPercent}%`}
                      >
                        {pendingPercent > 10 && `${pendingPercent}%`}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic">No responses recorded</div>
                  )}
                </div>

                <div className="flex gap-4 mt-3 text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    <span>Attending ({attendingPercent}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <span>Declined ({declinedPercent}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                    <span>Pending ({pendingPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Recent Responses List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">Recent Responses</h3>
                <div className="border border-[#c9a84c]/20 rounded-lg overflow-hidden bg-white shadow-sm">
                  {recentResponses.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {recentResponses.map(inv => (
                        <div key={inv.id} className="flex justify-between items-center p-4 hover:bg-[#0c0905]/30 transition-colors">
                          <div>
                            <p className="font-semibold text-sm text-[#fcf8f2]">{inv.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Responded on {new Date(inv.responded_at).toLocaleDateString()} at {new Date(inv.responded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            {inv.rsvp === 'attending' && (
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                Attending ({inv.guest_count} guests)
                              </span>
                            )}
                            {inv.rsvp === 'declined' && (
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                Declined
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-400 italic">No responses recorded yet. Share invitation links with guests to get replies.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL INVITEES */}
          {activeTab === 'invitees' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#c9a84c]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or URL slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-[#c9a84c]/30 rounded-lg focus:outline-none focus:border-[#d4af37] bg-[#0c0905]/20 text-sm"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {[
                    { id: 'all', label: `All (${totalInvited})` },
                    { id: 'pending', label: `Pending (${pendingCount})` },
                    { id: 'attending', label: `Attending (${attendingCount})` },
                    { id: 'declined', label: `Declined (${declinedCount})` }
                  ].map(pill => {
                    const active = filterRSVP === pill.id;
                    return (
                      <button
                        key={pill.id}
                        onClick={() => setFilterRSVP(pill.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${active ? 'bg-[#d4af37] text-[#1e180f]' : 'bg-[#1e180f]/30 text-[#c9a84c] hover:bg-[#1e180f]/60'}`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Invitees Table */}
              <div className="border border-[#c9a84c]/20 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0c0905] border-b border-[#c9a84c]/20 text-[#c9a84c] uppercase font-bold tracking-wider">
                        <th className="p-4">Guest Name</th>
                        <th className="p-4">Invitation URL Link</th>
                        <th className="p-4 text-center">RSVP Status</th>
                        <th className="p-4 text-center">Guests</th>
                        <th className="p-4 text-center font-normal capitalize">Response Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInvitees.length > 0 ? (
                        filteredInvitees.map(inv => {
                          const personalLink = `http://localhost:5173/invite/${inv.slug}`;
                          return (
                            <tr key={inv.id} className="hover:bg-[#0c0905]/20 transition-colors">
                              <td className="p-4 font-semibold text-[#fcf8f2] whitespace-nowrap">
                                <div>
                                  <p>{inv.name}</p>
                                  {inv.phone && <p className="text-[10px] text-gray-400 mt-0.5">{inv.phone}</p>}
                                </div>
                              </td>
                              <td className="p-4 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                                <div className="flex items-center space-x-1.5">
                                  <span className="truncate max-w-[200px]">{personalLink}</span>
                                  <button
                                    onClick={() => handleCopyLink(inv.slug, inv.id)}
                                    className="p-1 hover:text-[#d4af37] rounded hover:bg-[#1e180f]/30"
                                    title="Copy Link"
                                  >
                                    {copiedId === inv.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  inv.rsvp === 'attending' ? 'bg-green-100 text-green-800' :
                                  inv.rsvp === 'declined' ? 'bg-red-100 text-red-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {inv.rsvp}
                                </span>
                              </td>
                              <td className="p-4 text-center font-bold text-[#d4af37]">
                                {inv.rsvp === 'attending' ? inv.guest_count : '-'}
                              </td>
                              <td className="p-4 text-center text-gray-400 whitespace-nowrap">
                                {inv.responded_at ? new Date(inv.responded_at).toLocaleDateString() : '-'}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center space-x-2">
                                  {/* Send WhatsApp */}
                                  <a
                                    href={getWhatsAppShareURL(inv)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-[#25d366] text-white rounded hover:bg-[#128c7e] transition-colors"
                                    title="Share on WhatsApp"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </a>
                                  
                                  {/* View Invitation */}
                                  <Link
                                    to={`/invite/${inv.slug}`}
                                    target="_blank"
                                    className="p-1.5 bg-[#1e180f] text-[#d4af37] rounded hover:bg-[#c9a84c] hover:text-[#1e180f] transition-colors"
                                    title="View Invitation Page"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>

                                  {/* Delete guest */}
                                  <button
                                    onClick={() => handleDelete(inv.id, inv.name)}
                                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-200 transition-colors"
                                    title="Remove Guest"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-sm text-gray-400 italic">No guests matching the criteria.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Row count shown below table */}
                <div className="bg-[#0c0905]/40 p-4 border-t border-[#c9a84c]/10 flex justify-between items-center text-xs text-[#c9a84c] font-bold">
                  <span>Showing {filteredInvitees.length} of {invitees.length} guest records</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADD AND IMPORT */}
          {activeTab === 'add-import' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
              
              {/* Left Panel: Single invitee Form */}
              <div className="border border-[#c9a84c]/20 rounded-lg p-6 bg-white space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">Add Single Invitee</h3>
                  <p className="text-xs text-gray-400 mt-1">Create a customized web invitation link for a single guest.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#c9a84c] mb-1">
                      Guest Name (Required)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bilal & Family"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#c9a84c]/30 rounded-lg focus:outline-none focus:border-[#d4af37] bg-[#0c0905]/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#c9a84c] mb-1">
                      WhatsApp Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +919876543210 (Include country code)"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#c9a84c]/30 rounded-lg focus:outline-none focus:border-[#d4af37] bg-[#0c0905]/20 text-sm"
                    />
                  </div>

                  <button
                    onClick={handleAddSingle}
                    disabled={!newName.trim()}
                    className="w-full bg-[#d4af37] hover:bg-[#aa7c11] disabled:bg-gray-200 text-[#1e180f] font-semibold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors active:scale-[0.98]"
                  >
                    Create Invitation Link
                  </button>

                  {/* Show link on success */}
                  {singleSuccessLink && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 mt-4">
                      <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Invitation Link Created!</p>
                      <div className="flex items-center space-x-2 bg-white border border-green-200 p-2 rounded text-xs font-mono overflow-x-auto">
                        <span className="flex-1 truncate select-all">{singleSuccessLink}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(singleSuccessLink);
                            alert('Copied to clipboard!');
                          }}
                          className="text-[#d4af37] hover:underline whitespace-nowrap font-bold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: CSV Upload area */}
              <div className="border border-[#c9a84c]/20 rounded-lg p-6 bg-white space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">CSV Bulk Import</h3>
                  <p className="text-xs text-gray-400 mt-1">Import multiple guests instantly via a CSV spreadsheet.</p>
                </div>

                <div className="space-y-4">
                  
                  {/* File Upload Box */}
                  <div className="border-2 border-dashed border-[#c9a84c]/40 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#0c0905]/30 transition-colors relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCsvFile(e.target.files[0]);
                          setCsvError('');
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileSpreadsheet className="w-10 h-10 text-[#c9a84c] mb-2" />
                    <span className="text-xs font-semibold text-[#d4af37]">
                      {csvFile ? `Selected: ${csvFile.name}` : 'Drag & drop your CSV file here, or click to browse'}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">Supports files ending in .csv</span>
                  </div>

                  {/* Alternately paste CSV text */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#c9a84c] mb-1">
                      Or Paste Raw CSV Text
                    </label>
                    <textarea
                      rows="4"
                      placeholder="name,phone&#10;Bilal Ahmed,+919876543210&#10;Aisha Siddiqua,+919876543211"
                      value={csvPasteText}
                      onChange={(e) => {
                        setCsvPasteText(e.target.value);
                        setCsvError('');
                      }}
                      className="w-full px-3 py-2 border border-[#c9a84c]/30 rounded-lg focus:outline-none focus:border-[#d4af37] bg-[#0c0905]/20 font-mono text-xs"
                    />
                  </div>

                  {csvError && <p className="text-xs text-red-600 font-semibold">{csvError}</p>}

                  <button
                    onClick={handleCSVImport}
                    className="w-full bg-[#d4af37] hover:bg-[#aa7c11] text-[#1e180f] font-semibold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors active:scale-[0.98]"
                  >
                    Start CSV Bulk Import
                  </button>

                  {/* CSV Progress indicator */}
                  {importProgress && (
                    <div className="bg-[#1e180f]/30 border border-[#c9a84c]/30 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#d4af37]">{importProgress.status}</span>
                        <span className="text-[#c9a84c]">{importProgress.current} / {importProgress.total} processed</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                          className="bg-[#d4af37] h-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Sample CSV */}
                  <div className="border border-gray-100 rounded bg-gray-50 p-3">
                    <p className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest mb-1.5 flex items-center">
                      <HelpCircle className="w-3.5 h-3.5 text-gray-400 mr-1" />
                      Sample CSV File Format
                    </p>
                    <pre className="text-[9px] font-mono bg-[#1a0f00] text-green-400 p-2 rounded overflow-x-auto">
{`name,phone
Bilal Ahmed,+919876543210
Aisha Khan,+919876543211
Dr. Salman & Family,`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEDDING DETAILS (SETTINGS) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">Wedding Event Settings</h3>
                <p className="text-xs text-gray-400 mt-1">Configure and modify all placeholders, dates, locations and messaging templates across the invitation.</p>
              </div>

              {settingsSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 font-bold p-4 rounded-lg text-xs tracking-wider uppercase">
                  Settings saved and applied successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Honorees */}
                <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-gray-200 pb-1.5">Honoree Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Groom Name</label>
                      <input
                        type="text"
                        value={settingsForm.groomName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, groomName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Bride Name</label>
                      <input
                        type="text"
                        value={settingsForm.brideName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, brideName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Groom Parents</label>
                    <input
                      type="text"
                      value={settingsForm.groomParents}
                      onChange={(e) => setSettingsForm({ ...settingsForm, groomParents: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Bride Parents</label>
                    <input
                      type="text"
                      value={settingsForm.brideParents}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brideParents: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Countdown target */}
                <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-gray-200 pb-1.5">Countdown Target Event</h4>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Target Date &amp; Time (ISO Format)</label>
                    <input
                      type="datetime-local"
                      value={settingsForm.countdownTarget.substring(0, 16)}
                      onChange={(e) => setSettingsForm({ ...settingsForm, countdownTarget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[9px] text-gray-400 mt-1">This sets the destination timer calculations on the invitation page.</p>
                  </div>
                </div>

                {/* Event 1 details (Nikah) */}
                <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-gray-200 pb-1.5 font-semibold">Event 1: Nikah Ceremony</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Date</label>
                      <input
                        type="text"
                        value={settingsForm.nikahDate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, nikahDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Time</label>
                      <input
                        type="text"
                        value={settingsForm.nikahTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, nikahTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={settingsForm.nikahVenue}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nikahVenue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Address Details</label>
                    <input
                      type="text"
                      value={settingsForm.nikahAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nikahAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Google Maps URL Link</label>
                    <input
                      type="text"
                      value={settingsForm.nikahMapsUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nikahMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Event 2 details (Walimah) */}
                <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-gray-200 pb-1.5 font-semibold">Event 2: Walimah Reception</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Date</label>
                      <input
                        type="text"
                        value={settingsForm.walimahDate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, walimahDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Time</label>
                      <input
                        type="text"
                        value={settingsForm.walimahTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, walimahTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={settingsForm.walimahVenue}
                      onChange={(e) => setSettingsForm({ ...settingsForm, walimahVenue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Address Details</label>
                    <input
                      type="text"
                      value={settingsForm.walimahAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, walimahAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Google Maps URL Link</label>
                    <input
                      type="text"
                      value={settingsForm.walimahMapsUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, walimahMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* WhatsApp Share template */}
                <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 space-y-4 md:col-span-2">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-gray-200 pb-1.5">WhatsApp Sharing Message Template</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] mb-1">Template Text</label>
                    <textarea
                      rows="4"
                      value={settingsForm.whatsappTemplate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappTemplate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:border-[#d4af37] font-mono leading-relaxed"
                    />
                    
                    {/* Template keys info */}
                    <div className="bg-[#1e180f]/20 p-3 rounded border border-[#c9a84c]/20 text-[10px] text-[#c9a84c] mt-2 space-y-1">
                      <p className="font-bold text-[#d4af37]">Supported dynamic replacement keywords:</p>
                      <ul className="list-disc pl-4 space-y-0.5 font-mono">
                        <li><strong>%%GUEST_NAME%%</strong> - Substituted with the guest's name record</li>
                        <li><strong>%%GUEST_LINK%%</strong> - Substituted with their personalized link url</li>
                        <li><strong>%%GROOM_NAME%%</strong> / <strong>%%BRIDE_NAME%%</strong> - Substituted with groom/bride names</li>
                        <li><strong>%%NIKAH_DATE%%</strong> / <strong>%%NIKAH_VENUE%%</strong> - Substituted with Nikah details</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#d4af37] hover:bg-[#aa7c11] text-[#1e180f] font-semibold text-xs uppercase tracking-widest px-8 py-3 rounded-lg transition-colors active:scale-[0.98] flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Save Wedding Details</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
