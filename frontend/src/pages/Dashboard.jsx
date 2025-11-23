import React, { useEffect, useState } from "react";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentContent from "@/components/dashboard/RecentContent";
import QuickActions from "@/components/dashboard/QuickActions";

import { getUserContentApi } from "@/api/content";
// We'll need a dashboard stats API endpoint later, for now we derive from content list
// import { getDashboardStats } from "@/api/dashboard";

export default function Dashboard() {
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent content
        const userContent = await getUserContentApi();
        setContent(userContent || []);

        // Derive stats from the content list
        // In a real app, this would come from a dedicated stats endpoint
        const derivedStats = {
          totalContent: userContent.length,
          totalEngagement: 0, // Mock data
          avgEngagement: 0, // Mock data
          contentThisWeek: userContent.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        };
        setStats(derivedStats);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <WelcomeCard />
      <StatsGrid stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
      <RecentContent content={content} isLoading={isLoading} />
    </div>
  );
}