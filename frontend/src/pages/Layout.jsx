import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Sparkles,
  Calendar,
  BarChart3,
  Library,
  User,
  Zap,
  Crown,
  Menu,
  CreditCard,
  MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const navigationItems = [
  { title: "Панель управления", url: createPageUrl("Dashboard"), icon: Home, description: "Командный центр" },
  { title: "Генерация", url: createPageUrl("Generate"), icon: Sparkles, description: "AI-студия контента" },
  { title: "Календарь", url: createPageUrl("Calendar"), icon: Calendar, description: "Планирование контента" },
  { title: "Аналитика", url: createPageUrl("Analytics"), icon: BarChart3, description: "Статистика эффективности" },
  { title: "Библиотека", url: createPageUrl("Library"), icon: Library, description: "Архив контента" },
  { title: "Тарифы", url: createPageUrl("Pricing"), icon: CreditCard, description: "Обновить план" },
  { title: "Агенты", url: createPageUrl("Agents"), icon: MessageSquare, description: "Студия агентов" }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, hash } = location;

  useEffect(() => {
    // This hook now handles all scrolling behavior
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // This replaces the functionality of the old ScrollToTop component
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // Dependency array ensures this runs on any location change
  }, [pathname, hash]);


  // No layout for auth pages
  if (["Login", "Register", "AuthCallback", "PaymentSuccess"].includes(currentPageName)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    );
  }

  // Special marketing layout for the public Landing page (header, but no sidebar)
  if (["Landing", "LeadMagnet"].includes(currentPageName)) {
    return (
      <div className="min-h-screen relative">
        {/* Global Background - mark as decorative and click-through */}
        <div aria-hidden="true" className="decorative-overlay gradient-mask fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pointer-events-none" />
        <div aria-hidden="true" className="decorative-overlay fixed inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        {/* Click-through + portal z-index safety CSS - Removed explicit style block to avoid conflicts */}
        
        <header className="relative z-20 px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl" role="banner">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Momentum Amplify</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/#how" className="text-white/80 hover:text-white text-sm">Как это работает</Link>
              <Link to="/lead-magnet" className="text-white/80 hover:text-white text-sm">Ускорьте Развитие</Link>
              <button onClick={() => document.dispatchEvent(new CustomEvent('openPricingModal'))} className="text-white/80 hover:text-white text-sm">Тарифы</button>
              <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 text-sm">
                Войти
              </button>
            </div>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="relative z-10" role="main" style={{ zIndex: 1, pointerEvents: 'auto' }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    );
  }

  // Default layout with sidebar for the main application
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        <div aria-hidden="true" className="decorative-overlay gradient-mask fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pointer-events-none" />
        
        {/* Hard overrides + portal z-index safety */}
        <style>{`
          [data-sidebar="sidebar"] {
            background: linear-gradient(to bottom, rgba(2,6,23,0.98), rgba(15,23,42,0.96)) !important;
            color: rgba(255,255,255,0.95) !important;
            border-right: 1px solid rgba(255,255,255,0.12) !important;
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
          }
          [data-sidebar="sidebar"] a,
          [data-sidebar="sidebar"] [data-sidebar="menu-button"] { color: rgba(255,255,255,0.92) !important; }
          [data-sidebar="sidebar"] .text-muted-foreground,
          [data-sidebar="sidebar"] [class*="text-muted-foreground"] { color: rgba(255,255,255,0.7) !important; }
          [data-sidebar="menu-button"]:hover { background-color: rgba(255,255,255,0.08) !important; }
        `}</style>
        
        <Sidebar className="w-72 border-r border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-indigo-900/80 text-white" role="navigation" aria-label="Primary">
          <SidebarHeader className="border-b border-white/10 p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">Momentum Amplify</h2>
                <p className="text-xs text-white/80">Pro</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4 text-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-white/70 uppercase tracking-wider px-2 py-3">Навигация</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url} className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 border border-white/20 text-white shadow-lg' : 'hover:bg-white/5 text-white/90 border border-transparent'}`}>
                            <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-white/10 text-white/90 group-hover:bg-white/15'}`}>
                              <item.icon className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-xs opacity-80">{item.description}</div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-white/70 uppercase tracking-wider px-2 py-3">Аккаунт</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={createPageUrl("Profile")} className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-white/90 border border-transparent">
                        <div className="p-2 rounded-lg bg-white/10 text-white/90 group-hover:bg-white/15">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold">Профиль</div>
                          <div className="text-xs opacity-80">Настройки</div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
</SidebarContent>
          <SidebarFooter className="border-t border-white/10 p-4">
            <Link to={createPageUrl("Pricing")} className="block mb-3" aria-label="Upgrade to Pro plan">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">Pro План</p>
                    <p className="text-xs text-amber-200">Улучшить и получить больше</p>
                  </div>
                </div>
              </div>
            </Link>
            <button onClick={() => { localStorage.removeItem('authToken'); navigate('/login'); }} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition" aria-label="Выйти">
              Выйти
            </button>
          </SidebarFooter>
        </Sidebar>
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col relative" role="main">
          <header className="lg:hidden bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4 text-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                                  <h1 className="text-lg font-bold text-white">Momentum Amplify</h1>              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto relative">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}