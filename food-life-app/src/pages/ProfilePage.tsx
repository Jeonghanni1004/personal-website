import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Footprints,
  ChefHat,
  Bookmark,
  FileText,
  Settings,
  Bell,
  Shield,
  Info,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SafeImage from '../components/SafeImage';
import { getCurrentUser } from '../api';

const menus = [
  { to: '/diary', icon: Footprints, label: '我的饭迹' },
  { to: '/profile/recipes', icon: ChefHat, label: '我的菜谱' },
  { to: '/profile/saved', icon: Bookmark, label: '我的收藏' },
  { to: '/profile/posts', icon: FileText, label: '我的帖子' },
  { to: '/settings', icon: Settings, label: '账号与设置' },
  { to: '/settings', icon: Bell, label: '通知' },
  { to: '/settings', icon: Shield, label: '隐私' },
  { to: '/settings', icon: Info, label: '关于' },
];

export default function ProfilePage() {
  const user = getCurrentUser();

  return (
    <PageTransition>
      <div className="page">
        <header className="pt-2 mb-6">
          <div className="flex items-center gap-4">
            <SafeImage
              src={user.avatar}
              className="w-20 h-20 rounded-full"
              alt={user.name}
              fallbackEmoji="👤"
            />
            <div>
              <h2 className="font-display text-2xl font-semibold">{user.name}</h2>
              <p className="text-ink-muted text-sm mt-0.5">{user.bio}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { n: user.mealCount, l: '吃饭次数' },
            { n: user.recipeCount, l: '菜谱' },
            { n: user.postCount, l: '帖子' },
          ].map((s) => (
            <div key={s.l} className="card py-4 text-center">
              <p className="font-display text-2xl font-bold text-tomato">{s.n}</p>
              <p className="text-xs text-ink-muted mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden divide-y divide-border">
          {menus.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-cream-dark/50"
            >
              <m.icon size={18} className="text-ink-muted" />
              <span className="flex-1 text-sm font-medium">{m.label}</span>
              <ChevronRight size={16} className="text-ink-muted" />
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
