import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiList, FiActivity, FiTrendingUp, FiUser } from 'react-icons/fi';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FiHome,
    },
    {
      path: '/workouts',
      label: 'Workouts',
      icon: FiActivity,
    },
    {
      path: '/exercises',
      label: 'Exercises',
      icon: FiList,
    },
    {
      path: '/progress',
      label: 'Progress',
      icon: FiTrendingUp,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: FiUser,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${active ? 'stroke-2' : ''}`} />
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              GetFit
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'stroke-2' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Info / Actions */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">User</p>
                <p className="text-xs text-gray-600 truncate">user@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
