import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import CookPage from './pages/CookPage';
import PhoneEatPage from './pages/PhoneEatPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import DiaryPage from './pages/DiaryPage';
import DiaryStoryPage from './pages/DiaryStoryPage';
import DiaryPhotosPage from './pages/DiaryPhotosPage';
import ProfilePage from './pages/ProfilePage';
import ProfileRecipesPage from './pages/ProfileRecipesPage';
import ProfileSavedPage from './pages/ProfileSavedPage';
import ProfilePostsPage from './pages/ProfilePostsPage';
import SettingsPage from './pages/SettingsPage';

/** 仅全屏沉浸页隐藏底栏 */
function shouldHideNav(pathname: string) {
  if (pathname.startsWith('/diary/') && pathname !== '/diary/photos') return true;
  return false;
}

export default function App() {
  const location = useLocation();
  const hideNav = shouldHideNav(location.pathname);

  return (
    <div className="app-frame">
      <div className="app-shell">
        <div className={hideNav ? 'app-content app-content--flush' : 'app-content'}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/random" element={<Navigate to="/" replace />} />
              <Route path="/cook" element={<CookPage />} />
              <Route path="/phone-eat" element={<PhoneEatPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/:postId" element={<PostDetailPage />} />
              <Route path="/post/create" element={<CreatePostPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/diary/photos" element={<DiaryPhotosPage />} />
              <Route path="/diary/:date" element={<DiaryStoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/recipes" element={<ProfileRecipesPage />} />
              <Route path="/profile/saved" element={<ProfileSavedPage />} />
              <Route path="/profile/posts" element={<ProfilePostsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
