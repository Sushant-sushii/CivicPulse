import React from 'react';
import { X, MapPin, Calendar, Clock, AlertTriangle, FileText, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ComplaintDetailModal({ isOpen, onClose, complaint }) {
  if (!isOpen || !complaint) return null;

  const citizenName = complaint.citizenId 
    ? `${complaint.citizenId.firstName || ''} ${complaint.citizenId.LastName || ''}`.trim() 
    : 'Anonymous';

  const statusColors = {
    Open: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Escalated: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const severityColors = {
    High: 'text-red-400 bg-red-500/10 border-red-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  // Safe check for coordinates standard [longitude, latitude]
  const coordinates = complaint.location?.coordinates || [];
  const longitude = coordinates[0];
  const latitude = coordinates[1];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fadeIn max-h-[90vh] flex flex-col">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-amber-500 p-2 bg-slate-950/60 hover:bg-slate-950/80 backdrop-blur-md rounded-full transition-all cursor-pointer z-10 border border-slate-800"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Scrollable Content wrapper */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Banner Image */}
          <div className="w-full h-64 bg-slate-950 border-b border-slate-800 relative overflow-hidden flex items-center justify-center">
            <img 
              src={complaint.imageUrl || "https://images.unsplash.com/photo-1594913785162-e6785b49eed9?auto=format&fit=crop&w=600&q=80"} 
              alt="Complaint Evidence" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            
            {/* Floating badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border uppercase backdrop-blur-md ${statusColors[complaint.status || 'Open']}`}>
                {complaint.status || 'Open'}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border uppercase backdrop-blur-md ${severityColors[complaint.severity || 'Medium']}`}>
                {complaint.severity || 'Medium'} Severity
              </span>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8 space-y-6 text-left">
            
            {/* Header / Title block */}
            <div>
              <span className="font-mono text-xs text-slate-500 uppercase tracking-wider block">
                CMP-{complaint._id.toUpperCase()}
              </span>
              <h3 className="text-2xl font-bold font-display text-white tracking-wide mt-1">
                {complaint.category}
              </h3>
            </div>

            {/* Narrative / Description */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wider block flex items-center gap-1.5">
                <FileText size={12} className="text-amber-500" /> Narrative description
              </span>
              <p className="text-slate-300 text-sm leading-relaxed bg-[#060A14]/30 border border-slate-800/40 rounded-xl p-4 font-body">
                {complaint.description || "No narrative description provided for this docket record."}
              </p>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Administrative Bureau / Dept</span>
                <span className="text-sm font-semibold text-slate-200">{complaint.department}</span>
              </div>

              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Citizen Reporter</span>
                <span className="text-sm font-semibold text-slate-200">{citizenName}</span>
              </div>

              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Incident Pincode</span>
                <span className="text-sm font-semibold text-slate-200">{complaint.wardNumber}</span>
              </div>

              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Local Area</span>
                <span className="text-sm font-semibold text-slate-200">{complaint.localArea || "Lucknow Area"}</span>
              </div>

              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Submission Timeline</span>
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-500" />
                  {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="bg-[#060A14]/40 border border-slate-800/50 p-4 rounded-2xl">
                <span className="font-mono text-[9px] uppercase text-slate-500 block mb-1">Incident Geolocation Context</span>
                <span className="text-xs font-mono text-slate-200 block truncate" title={`${latitude || 0}, ${longitude || 0}`}>
                  Latitude: {latitude !== undefined ? latitude.toFixed(5) : "N/A"}<br />
                  Longitude: {longitude !== undefined ? longitude.toFixed(5) : "N/A"}
                </span>
              </div>
            </div>

            {/* Extra Flags & Resolution details */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-[#060A14]/20 border border-slate-800 px-3.5 py-2 rounded-xl">
                  <span className={`w-2 h-2 rounded-full ${complaint.isSafetyHazardAtNight ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    Night Safety Risk: {complaint.isSafetyHazardAtNight ? "High Hazard" : "Nominal"}
                  </span>
                </div>
              </div>

              {complaint.status === 'Resolved' && (
                <div className="flex flex-col gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-3 rounded-xl text-emerald-400 w-full">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Resolved {complaint.resolvedAt ? `On: ${new Date(complaint.resolvedAt).toLocaleDateString()}` : 'by department'}
                    </span>
                  </div>
                  {complaint.resolutionStatement && (
                    <div className="mt-1 border-t border-emerald-500/10 pt-2 text-slate-300 text-xs font-sans leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-0.5 font-mono text-[9px] uppercase">Official Resolution Feedback:</span>
                      {complaint.resolutionStatement}
                    </div>
                  )}
                  {complaint.resolvedByOfficialName && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Resolved by: {complaint.resolvedByOfficialName}
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
