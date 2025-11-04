import { HiOutlineBell, HiOutlineMenu } from 'react-icons/hi';

const UserStatsHeader = ({
  user,
  onProfileClick,
  onNotificationClick,
  onMenuClick
}) => {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Content */}
      <div className="relative px-6 pt-12 pb-20">
        {/* Top Icons Row */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Menu"
          >
            <HiOutlineMenu className="w-6 h-6" />
          </button>

          <button
            onClick={onNotificationClick}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <HiOutlineBell className="w-6 h-6" />
            {/* Red notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <button
            onClick={onProfileClick}
            className="mb-3 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </button>

          {/* User Name */}
          <h1 className="text-2xl font-bold text-white text-center mb-1">
            Hi, {user?.name?.split(' ')[0] || 'there'}!
          </h1>

          {/* Role/Subtitle */}
          {user?.role && (
            <p className="text-xs uppercase tracking-widest text-white/80 text-center mb-6">
              {user.role}
            </p>
          )}

          {/* User Stats Row */}
          <div className="flex justify-center gap-8 sm:gap-12 text-center">
            {/* Weight */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-white">
                  {user?.weight || 0}
                </span>
                <span className="text-sm text-white/80">
                  kg
                </span>
              </div>
              <span className="text-xs text-white/70">
                Weight
              </span>
            </div>

            {/* Age */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-white">
                  {user?.age || 0}
                </span>
                <span className="text-sm text-white/80">
                  yo
                </span>
              </div>
              <span className="text-xs text-white/70">
                Years Old
              </span>
            </div>

            {/* Height */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-white">
                  {user?.height || 0}
                </span>
                <span className="text-sm text-white/80">
                  cm
                </span>
              </div>
              <span className="text-xs text-white/70">
                Height
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsHeader;
