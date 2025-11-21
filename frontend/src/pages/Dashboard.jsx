import React, { useState, useEffect } from "react";

import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Sparkles,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

import StatsGrid from "../components/dashboard/StatsGrid";
import RecentContent from "../components/dashboard/RecentContent";
import QuickActions from "../components/dashboard/QuickActions";
import WelcomeCard from "../components/dashboard/WelcomeCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalEngagement: 0,
    avgEngagement: 0,
    contentThisWeek: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get user profile
      const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }

      // Get recent content
      const content = await base44.entities.Content.filter({ created_by: currentUser.email }, "-created_date", 10);
      setRecentContent(content);

      // Calculate stats
      const totalContent = content.length;
      const totalEngagement = content.reduce((sum, item) => 
        sum + (item.performance_data?.likes || 0) + 
        (item.performance_data?.comments || 0) + 
        (item.performance_data?.shares || 0), 0
      );
      const avgEngagement = totalContent > 0 ? totalEngagement / totalContent : 0;
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const contentThisWeek = content.filter(item => 
        new Date(item.created_date) >= weekAgo
      ).length;

      setStats({
        totalContent,
        totalEngagement,
        avgEngagement,
        contentThisWeek
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Загружаем командный центр...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        {!userProfile?.onboarding_completed && (
          <WelcomeCard user={user} />
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              С возвращением, {user?.full_name?.split(' ')[0] || 'Создатель'}
            </h1>
            <p className="text-white/70 text-lg">
              Ваш командный центр усиления сообщений
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Link to={createPageUrl("Generate")}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Создать контент
              </Button>
            </Link>
            <Link to={createPageUrl("Calendar")}>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Запланировать
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentContent content={recentContent} />
          </div>
          
          <div className="space-y-8">
            <QuickActions userProfile={userProfile} />
            
            {/* Today's Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    Сегодняшние возможности
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Пиковое время LinkedIn</p>
                        <p className="text-white/70 text-sm">Опубликуйте через 2 часа для максимального охвата</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Трендовая тема</p>
                        <p className="text-white/70 text-sm">"ИИ в бизнесе" сегодня в тренде</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}