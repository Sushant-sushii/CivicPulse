import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Clock, Shield, Navigation, BarChart3, Bell, FileText, Layers, Menu, X, Megaphone, CheckCheck, Calendar } from 'lucide-react';

export default function TopBar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  // Navigation Items
  const citizenItems = [
    { id: 'report', label: 'Report Issue', icon: Plus },
    { id: 'track', label: 'Track', icon: Clock },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'safety-map', label: 'Safety Map', icon: Shield },
    { id: 'safe-routes', label: 'Safe Routes', icon: Navigation },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const officialItems = [
    { id: 'complaints', label: 'Complaints', icon: FileText },
    { id: 'total-complaints', label: 'Total Complaints', icon: Layers },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = user?.role === 'official' ? officialItems : citizenItems;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/announcements`);
      const result = await response.json();
      if (response.ok && result.success) {
        const list = result.announcements || [];
        setAnnouncements(list);

        const lastRead = localStorage.getItem('lastReadAnnouncementTimestamp') || '0';
        const unread = list.filter(a => new Date(a.createdAt).getTime() > parseInt(lastRead, 10));
        setUnreadCount(unread.length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAllAsRead = () => {
    const now = Date.now().toString();
    localStorage.setItem('lastReadAnnouncementTimestamp', now);
    setUnreadCount(0);
  };

  const handleNotificationClick = (announcement) => {
    markAllAsRead();
    setShowNotifications(false);
    if (setActiveTab) {
      setActiveTab('announcements');
    }
  };

  return (
    <header className="w-full bg-[#060A14]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <Menu size={16} />
        </button>

        <div className="w-7 h-7 rounded-md border border-amber-500/40 flex items-center justify-center text-amber-500 bg-amber-500/5">
          <Shield size={14} className="text-amber-500" />
        </div>
        <div>
          <h1 className="font-display text-sm font-bold tracking-widest leading-none text-white uppercase">
            CIVICPULSE
          </h1>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mt-0.5">
            Civic Grievance & Safety Agent
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Layer */}
      <nav className="hidden md:flex items-center gap-6 h-full self-stretch pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className="flex items-center gap-2 px-1 pb-2 font-mono text-xs font-medium tracking-wide transition-all cursor-pointer relative border-b-2 bg-transparent"
              style={{
                borderColor: isActive ? '#f59e0b' : 'transparent',
                color: isActive ? '#f59e0b' : '#94a3b8',
              }}
            >
              <Icon size={14} className={isActive ? 'text-amber-500' : 'text-slate-400'} />
              {item.label}
              {item.id === 'announcements' && unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI Active
        </div>

        {/* Active Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white relative border border-slate-800 cursor-pointer transition-colors"
            title="System Notifications"
          >
            <Bell size={14} className={unreadCount > 0 ? 'text-amber-400' : ''} />
            {unreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center border border-slate-950 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700" />
            )}
          </button>

          {/* Notifications Dropdown Tray */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-left animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Megaphone size={14} className="text-amber-500" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                    Announcements Feed
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-mono text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={12} /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/40 my-2 custom-scrollbar">
                {announcements.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-500">
                    No announcements available
                  </div>
                ) : (
                  announcements.slice(0, 5).map((a) => (
                    <div 
                      key={a._id}
                      onClick={() => handleNotificationClick(a)}
                      className="py-3 px-2 hover:bg-[#060A14]/50 rounded-xl transition-colors cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-amber-400 font-bold uppercase truncate max-w-[200px]">
                          {a.officialName || a.department || 'Official Broadcast'}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {a.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-body">
                        {a.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800 pt-2.5 text-center">
                <button 
                  onClick={() => {
                    markAllAsRead();
                    setShowNotifications(false);
                    if (setActiveTab) setActiveTab('announcements');
                  }}
                  className="font-mono text-[10px] uppercase font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  View All Announcements &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="font-mono text-[10px] uppercase text-red-400 border border-red-500/20 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer ml-2 hidden sm:block"
        >
          Exit
        </button>
      </div>

      {/* Sliding Mobile Navigation Tray */}
      {isOpen && (
        <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 transition-opacity"
            style={{ 
              backgroundColor: 'rgba(2, 4, 8, 0.75)', 
              backdropFilter: 'blur(6px)',
              zIndex: 99998
            }}
          />

          {/* Sliding Menu Tray */}
          <div 
            className="animate-slideInLeft text-left"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              height: '100vh',
              width: '260px',
              backgroundColor: '#000000', 
              color: '#ffffff',
              borderRight: '1px solid #334155',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              zIndex: 99999 
            }}
          >
            <div className="space-y-6">
              {/* Brand Identity / Close */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-white" />
                  <span className="font-display text-xs font-black tracking-wider text-white uppercase">CIVICPULSE</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg cursor-pointer"
                  style={{ color: '#ffffff' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Vertical Navigation Items */}
              <nav className="flex flex-col gap-2.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab && setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wide transition-all cursor-pointer w-full text-left bg-transparent"
                      style={{
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                      }}
                    >
                      <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Exit Signature */}
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI System Active
              </div>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-mono text-xs uppercase font-bold rounded-xl cursor-pointer"
                style={{
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)'
                }}
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}