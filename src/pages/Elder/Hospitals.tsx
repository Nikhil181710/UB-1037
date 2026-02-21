import React, { useState } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Loader2, Search } from 'lucide-react';

export default function Hospitals() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const findNearby = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoading(false);
        // Open Google Maps in a new tab with search for hospitals near the user
        window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`, '_blank');
      }, (err) => {
        console.error(err);
        setLoading(false);
        alert("Could not get your location. Please enable location permissions.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="text-blue-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Find Nearby Hospitals</h2>
        <p className="text-slate-500 text-lg mb-8">
          In case of emergency or for regular checkups, find the nearest healthcare facilities based on your current live location.
        </p>
        
        <button 
          onClick={findNearby}
          disabled={loading}
          className="w-full md:w-auto px-12 py-5 bg-blue-500 text-white rounded-3xl font-bold text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Detecting Location...
            </>
          ) : (
            <>
              <Search size={24} />
              Search Nearby Hospitals
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {[
          { name: 'City General Hospital', distance: '1.2 km', phone: '+1 234 567 890', type: 'Emergency' },
          { name: 'St. Mary Medical Center', distance: '2.5 km', phone: '+1 234 567 891', type: 'Multi-specialty' },
          { name: 'Sunrise Health Clinic', distance: '3.8 km', phone: '+1 234 567 892', type: 'Primary Care' }
        ].map((h, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Navigation className="text-blue-500" size={24} />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{h.type}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{h.name}</h3>
            <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
              <MapPin size={14} />
              {h.distance} away
            </p>
            <div className="flex gap-2">
              <a 
                href={`tel:${h.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                <Phone size={18} />
                Call
              </a>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.name)}`, '_blank')}
                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
