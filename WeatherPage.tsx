import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  CloudRain, 
  AlertCircle, 
  Loader2, 
  Calendar,
  Compass,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { WeatherData } from '../types';
import { fetchWeather } from '../lib/api';

export const WeatherPage: React.FC = () => {
  const [destinationInput, setDestinationInput] = useState('Jaipur');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickCities = ['Jaipur', 'Varanasi', 'Shimla', 'Munnar', 'Goa', 'Srinagar', 'Rishikesh'];

  const handleSearch = async (cityToSearch?: string) => {
    const query = (cityToSearch || destinationInput).trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeather(query);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather error:', err);
      setWeatherData(null);
      setErrorMessage(err.message || `Unable to fetch weather data for "${query}".`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Jaipur');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary">
          <CloudSun className="w-3.5 h-3.5" />
          <span>Real-Time Meteorological Radar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
          Destination Weather & Forecast
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Accurate temperatures, rain probabilities, and 5-day outlooks powered by high-resolution global weather models. Never simulated or invented.
        </p>
      </div>

      {/* Search Bar & Quick City Pills */}
      <div className="max-w-2xl mx-auto space-y-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="relative flex items-center"
        >
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            placeholder="Enter any destination worldwide (e.g. Manali, Ooty, Kyoto)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all shadow-subtle bg-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs shadow-sm disabled:opacity-60 transition-all flex items-center space-x-1"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-brand-muted font-medium flex-shrink-0">Quick Picks:</span>
          {quickCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setDestinationInput(city);
                handleSearch(city);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-brand-border hover:border-brand-primary text-slate-700 hover:text-brand-primary font-medium transition-colors flex-shrink-0 shadow-subtle"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Weather Data Unavailable</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Weather Results */}
      {weatherData && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-brand-navy via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              
              {/* Location & Current Condition */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-200">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-semibold tracking-wide">
                    {weatherData.location.name}, {weatherData.location.region} {weatherData.location.country}
                  </span>
                </div>

                <div className="flex items-baseline space-x-4">
                  <span className="text-6xl sm:text-7xl font-black tracking-tighter">
                    {weatherData.current.temperature}°C
                  </span>
                  <div>
                    <span className="text-lg font-bold block text-blue-100">
                      {weatherData.current.condition}
                    </span>
                    <span className="text-xs text-slate-300">
                      Feels like {weatherData.current.feelsLike}°C
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real Meteorological Source: {weatherData.provider}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-300">Humidity</p>
                    <p className="text-base font-bold">{weatherData.current.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-300">Wind Speed</p>
                    <p className="text-base font-bold">{weatherData.current.windSpeed} km/h</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-300">Precipitation</p>
                    <p className="text-base font-bold">{weatherData.current.precipitation} mm</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-300">Coordinates</p>
                    <p className="text-xs font-semibold text-slate-200">
                      {weatherData.location.latitude.toFixed(2)}°, {weatherData.location.longitude.toFixed(2)}°
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5-Day Outlook */}
          <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 space-y-5">
            <h3 className="text-lg font-black text-brand-navy flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              <span>5-Day Weather Outlook</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {weatherData.forecast?.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center space-y-2 hover:border-brand-primary/40 transition-colors"
                >
                  <p className="text-xs font-bold text-brand-navy">
                    {new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-brand-primary font-bold">
                    {day.condition}
                  </p>
                  <div className="text-sm font-black text-slate-800">
                    {day.tempMax}° / <span className="text-xs text-slate-400 font-semibold">{day.tempMin}°</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-medium flex items-center justify-center space-x-1">
                    <CloudRain className="w-3 h-3 inline" />
                    <span>{day.rainProbability}% rain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
