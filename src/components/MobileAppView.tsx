import React, { useState } from 'react';
import {
  CityModelOutput,
  SupportedCrop,
} from '../types.ts';
import {
  CloudSun,
  ShieldAlert,
  Sprout,
  Search,
  ChevronDown,
  MapPin,
  Wind,
  Droplets,
  Eye,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface MobileAppViewProps {
  cities: CityModelOutput[];
  currentCity: CityModelOutput;
  onSelectCity: (city: CityModelOutput) => void;
  onSelectCrop: (crop: SupportedCrop) => void;
  onOpenAIAnalyst: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  cities,
  currentCity,
  onSelectCity,
  onSelectCrop,
  onOpenAIAnalyst,
}) => {
  // Mobile app tabs: Home (1h Weather), Disaster (3h Hazard), Farm (Agro Intel)
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'disaster' | 'farm'>('home');
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<SupportedCrop>(currentCity.agro.crop);

  const filteredCities = cities.filter((c) => {
    const q = citySearchQuery.toLowerCase();
    return (
      c.city.name.toLowerCase().includes(q) ||
      c.city.state.toLowerCase().includes(q) ||
      c.city.id.toString() === q
    );
  });

  const cropsList: { id: SupportedCrop; label: string; icon: string }[] = [
    { id: 'rice', label: 'Paddy / Rice', icon: '🌾' },
    { id: 'wheat', label: 'Wheat (Rabi)', icon: '🌾' },
    { id: 'cotton', label: 'Bt Cotton', icon: '🌱' },
    { id: 'maize', label: 'Maize', icon: '🌽' },
    { id: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
    { id: 'mustard', label: 'Mustard', icon: '🌻' },
    { id: 'pulses', label: 'Pulses', icon: '🫘' },
    { id: 'soybean', label: 'Soybean', icon: '🌱' },
    { id: 'millets', label: 'Millets', icon: '🌾' },
  ];

  const handleCropChange = (crop: SupportedCrop) => {
    setSelectedCrop(crop);
    onSelectCrop(crop);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 bg-[#050811] overflow-y-auto">
      {/* Mobile Device Container Frame */}
      <div className="w-full max-w-sm rounded-[36px] bg-[#0b101d] border-4 border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[740px] max-h-[92vh] relative select-none">
        {/* Device Top Speaker / Camera Notch */}
        <div className="pt-2 px-6 flex items-center justify-between bg-slate-950 text-[10px] font-mono text-slate-400">
          <span>9:41</span>
          <div className="w-20 h-3.5 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-750" />
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5">
              <div className="w-2 h-full bg-slate-300" />
            </div>
          </div>
        </div>

        {/* Top Header with City Selector Modal Trigger */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            id="mobile-city-selector-btn"
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-2 text-left p-1 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-white group-hover:text-cyan-300">
                <span>#{currentCity.city.id} {currentCity.city.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[150px]">
                {currentCity.city.state} • {currentCity.city.zone}
              </span>
            </div>
          </button>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            Port 8082
          </span>
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs text-slate-200">
          {/* TAB 1: HOME (1-Hour Weather Nowcast) */}
          {activeMobileTab === 'home' && (
            <div className="space-y-3">
              {/* Primary Weather Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-cyan-400 font-semibold tracking-wider block">
                      1-HOUR NOWCAST MODEL
                    </span>
                    <div className="text-4xl font-extrabold text-white mt-1">
                      {currentCity.weather.tempC}°<span className="text-xl text-slate-400">C</span>
                    </div>
                    <div className="text-xs text-slate-300 font-sans mt-0.5 font-medium">
                      Feels like {currentCity.weather.feelsLikeC}°C • {currentCity.weather.condition}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-inner">
                    <CloudSun className="w-7 h-7" />
                  </div>
                </div>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="p-1.5 rounded-lg bg-slate-950/50 text-center">
                    <span className="text-[9px] text-slate-500 block">HUMIDITY</span>
                    <span className="font-bold text-slate-200">{currentCity.weather.humidity}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/50 text-center">
                    <span className="text-[9px] text-slate-500 block">WIND</span>
                    <span className="font-bold text-slate-200">{currentCity.weather.windSpeedKmh} km/h</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/50 text-center">
                    <span className="text-[9px] text-slate-500 block">PRECIP</span>
                    <span className="font-bold text-cyan-400">{currentCity.weather.precipitationMm} mm</span>
                  </div>
                </div>
              </div>

              {/* 1-Hour Forecast statement */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">⏱️ Radar Trend (Next 60m):</span>
                <p className="text-slate-300 font-sans">{currentCity.weather.forecastNext1h}</p>
              </div>

              {/* Hourly Forecast Bar */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Hourly Temperature & Rain Probability
                </span>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  {currentCity.weather.hourly.map((h, i) => (
                    <div key={i} className="text-center min-w-[42px] p-1.5 rounded bg-slate-950/60 border border-slate-850">
                      <span className="text-[10px] text-slate-400 block">{h.time}</span>
                      <span className="font-bold text-xs text-white block my-0.5">{Math.round(h.tempC)}°</span>
                      <span className="text-[9px] text-cyan-400 block">{h.rainProb}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AQI Badge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">AIR QUALITY INDEX (AQI)</span>
                  <span className="text-sm font-bold text-white">{currentCity.weather.aqi} AQI</span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold border ${
                    currentCity.weather.aqiStatus === 'Good'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                      : currentCity.weather.aqiStatus === 'Moderate'
                      ? 'bg-yellow-950/80 text-yellow-400 border-yellow-800/60'
                      : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                  }`}
                >
                  {currentCity.weather.aqiStatus}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: DISASTER (3-Hour Disaster Risk Early Warning) */}
          {activeMobileTab === 'disaster' && (
            <div className="space-y-3">
              {/* Main Risk Alert Banner */}
              <div
                className={`p-4 rounded-2xl border ${
                  currentCity.disaster.riskLevel === 'SEVERE'
                    ? 'bg-rose-950/40 border-rose-700/60'
                    : currentCity.disaster.riskLevel === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-700/60'
                    : currentCity.disaster.riskLevel === 'ADVISORY'
                    ? 'bg-yellow-950/40 border-yellow-700/60'
                    : 'bg-emerald-950/40 border-emerald-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                    3-HOUR EARLY WARNING
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      currentCity.disaster.riskLevel === 'SEVERE'
                        ? 'bg-rose-500 text-slate-950 border-rose-400'
                        : currentCity.disaster.riskLevel === 'WARNING'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : currentCity.disaster.riskLevel === 'ADVISORY'
                        ? 'bg-yellow-500 text-slate-950 border-yellow-400'
                        : 'bg-emerald-500 text-slate-950 border-emerald-400'
                    }`}
                  >
                    {currentCity.disaster.riskLevel}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xl font-bold text-white leading-snug">
                    {currentCity.disaster.primaryHazard}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Lead Time: <strong className="text-white">{currentCity.disaster.leadTime}</strong></span>
                  </div>
                </div>

                {/* Score and Probability */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block">RISK SCORE</span>
                    <span className="text-lg font-bold text-white">{currentCity.disaster.riskScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">PROBABILITY</span>
                    <span className="text-lg font-bold text-cyan-300">{currentCity.disaster.probability}%</span>
                  </div>
                </div>
              </div>

              {/* Active NDMA Protocol */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  OFFICIAL PROTOCOL
                </span>
                <p className="text-slate-200 font-medium">{currentCity.disaster.activeNDMAProtocol}</p>
              </div>

              {/* Actionable Safety Checklist */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Actionable Safety Directives:
                </span>
                {currentCity.disaster.safetyChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Emergency Hotline Button */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>NDMA National Control:</span>
                </div>
                <span className="font-bold text-cyan-400">1078 / 112</span>
              </div>
            </div>
          )}

          {/* TAB 3: FARM (Agro-Meteorological Crop Intelligence) */}
          {activeMobileTab === 'farm' && (
            <div className="space-y-3">
              {/* Crop Selector Chips */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Select Target Crop:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {cropsList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCropChange(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                        selectedCrop === c.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Suitability & Soil Moisture Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-800/40 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider block">
                      AGRO CROP INTELLIGENCE MODEL
                    </span>
                    <div className="text-xl font-bold text-white mt-1">
                      {currentCity.agro.cropName}
                    </div>
                    <div className="text-xs text-slate-300 font-sans mt-0.5">
                      Suitability Index: <strong className="text-emerald-400">{currentCity.agro.suitabilityScore}%</strong>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                    <Sprout className="w-5 h-5" />
                  </div>
                </div>

                {/* Soil Moisture Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Soil Moisture:</span>
                    <span className="font-bold text-white">{currentCity.agro.soilMoisturePct}% ({currentCity.agro.soilStatus})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                      style={{ width: `${currentCity.agro.soilMoisturePct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Irrigation Advisory */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <span className="text-emerald-400 font-bold block mb-1">💧 Irrigation Advisory:</span>
                <p className="text-slate-200 font-sans leading-relaxed">{currentCity.agro.irrigationAdvisory}</p>
              </div>

              {/* Pest & Pathogen Alert */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-400 font-bold">🐛 Pest & Disease Risk:</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold text-[10px]">
                    {currentCity.agro.pestRisk}
                  </span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">{currentCity.agro.pestDetails}</p>
              </div>

              {/* Operations & Fertilizer */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                <span className="text-slate-400 block text-[10px] mb-1 font-semibold">FERTILIZER & SOIL RECOMMENDATION</span>
                <p className="text-slate-300 font-sans">{currentCity.agro.fertilizerTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar: Home, Disaster, Farm */}
        <div className="p-2 border-t border-slate-800 bg-slate-950 flex items-center justify-around font-mono text-xs">
          <button
            id="mobile-tab-home"
            onClick={() => setActiveMobileTab('home')}
            className={`flex flex-col items-center gap-1 p-1 px-3 rounded-lg transition-colors ${
              activeMobileTab === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            id="mobile-tab-disaster"
            onClick={() => setActiveMobileTab('disaster')}
            className={`flex flex-col items-center gap-1 p-1 px-3 rounded-lg transition-colors ${
              activeMobileTab === 'disaster' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px]">Disaster</span>
          </button>
          <button
            id="mobile-tab-farm"
            onClick={() => setActiveMobileTab('farm')}
            className={`flex flex-col items-center gap-1 p-1 px-3 rounded-lg transition-colors ${
              activeMobileTab === 'farm' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span className="text-[10px]">Farm</span>
          </button>
        </div>
      </div>

      {/* City Selector Modal Popup */}
      {isCityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsCityModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="font-bold text-white text-sm">Select Monitored City</span>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-2 border-b border-slate-800">
              <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Search among 130 hubs..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-1 space-y-1">
              {filteredCities.map((c) => (
                <button
                  key={c.city.id}
                  onClick={() => {
                    onSelectCity(c);
                    setIsCityModalOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                    currentCity.city.id === c.city.id
                      ? 'bg-cyan-950/70 border border-cyan-800/60 text-cyan-300'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold block">#{c.city.id} {c.city.name}</span>
                    <span className="text-[10px] text-slate-500">{c.city.state} • {c.city.zone}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{Math.round(c.weather.tempC)}°C</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
