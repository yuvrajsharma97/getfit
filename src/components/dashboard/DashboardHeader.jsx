import React from 'react';
import { HiOutlineMenu, HiOutlineBell } from 'react-icons/hi';

const DashboardHeader = ({ user, onMenuClick, onNotificationClick, onProfileClick }) => {
  return (
    <div className="w-full h-72 lg:h-56 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 px-4 pt-6 pb-20 lg:px-12 lg:pt-8 lg:pb-20 relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6 lg:mb-8">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            aria-label="Menu"
          >
            <HiOutlineMenu className="w-6 h-6 text-white cursor-pointer" />
          </button>

          <button
            onClick={onNotificationClick}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <HiOutlineBell className="w-6 h-6 text-white cursor-pointer" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* MOBILE LAYOUT (< lg) - Vertical centered */}
        <div className="lg:hidden flex flex-col items-center">
          {/* Avatar */}
          <button
            onClick={onProfileClick}
            className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full mb-3"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </button>

          {/* Name */}
          <h1 className="text-white text-xl font-bold text-center mb-1">
            Hi, {user.name}!
          </h1>

          {/* Role/Badge (optional) */}
          {user.role && (
            <p className="text-white/80 text-xs uppercase tracking-widest text-center mb-6">
              {user.role}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex justify-center gap-6 sm:gap-8">
            <StatItem value={user.weight} unit="kg" label="Weight" />
            <StatItem value={user.age} unit="yo" label="Years Old" />
            <StatItem value={user.height} unit="cm" label="Height" />
          </div>
        </div>

        {/* DESKTOP LAYOUT (>= lg) - Horizontal */}
        <div className="hidden lg:flex justify-between items-center">
          {/* Left: Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={onProfileClick}
              className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </button>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                Hi, {user.name}!
              </h1>
              {user.role && (
                <p className="text-sm text-white/80 uppercase tracking-wide">
                  {user.role}
                </p>
              )}
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex gap-12">
            <StatItem value={user.weight} unit="kg" label="Weight" desktop />
            <StatItem value={user.age} unit="yo" label="Years Old" desktop />
            <StatItem value={user.height} unit="cm" label="Height" desktop />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ value, unit, label, desktop = false }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-baseline gap-1">
      <span className={`font-bold text-white ${desktop ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
        {value}
      </span>
      <span className={`text-white/80 ${desktop ? 'text-base' : 'text-sm'}`}>
        {unit}
      </span>
    </div>
    <span className="text-xs text-white/70 mt-1">
      {label}
    </span>
  </div>
);

export default DashboardHeader;
