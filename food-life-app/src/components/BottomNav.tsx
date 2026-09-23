import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, User } from 'lucide-react';
import { cn } from '../utils/meal';

const tabs = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/community', label: '饭圈', icon: Users },
  { to: '/diary', label: '美食日记', icon: BookOpen },
  { to: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  return (
    <nav
      className="bottom-nav"
      style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
    >
      <div className="glass-nav flex items-center justify-around rounded-[28px] px-2 py-2.5 mx-4">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 min-w-[64px] py-1 rounded-2xl transition-colors',
                isActive ? 'text-tomato' : 'text-ink-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="text-[11px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
