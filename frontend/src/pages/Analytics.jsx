import React, { useEffect, useMemo, useState, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load analytics charts component
const AnalyticsCharts = React.lazy(() => import("../components/analytics/Charts"));

export default function Analytics() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    const all = await base44.entities.Content.list("-created_date", 500);
    setItems(all);
    setIsLoading(false);
  };

  const stats = useMemo(() => {
    const total = items.length;
    const byStatus = items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + 1 }), {});
    const byPlatform = items.reduce((acc, i) => ({ ...acc, [i.platform]: (acc[i.platform] || 0) + 1 }), {});
    return { total, byStatus, byPlatform };
  }, [items]);

  const platformData = useMemo(() => {
    return Object.entries(stats.byPlatform).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const statusData = useMemo(() => {
    return Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const timeSeries = useMemo(() => {
    const m = new Map();
    items.forEach((i) => {
      const key = format(new Date(i.created_date), "MMM dd");
      m.set(key, (m.get(key) || 0) + 1);
    });
    return Array.from(m.entries()).map(([date, count]) => ({ date, count })).slice(-14);
  }, [items]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Аналитика</h1>
          {isLoading && <span className="text-white/70 text-sm">Загрузка...</span>}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Всего контента</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{stats.total}</div>
              <p className="text-white/60 text-sm mt-2">За всё время</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">По статусу</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {statusData.map((s) => (
                <Badge key={s.name} variant="outline" className="bg-white/10 border-white/20 text-white">
                  {s.name}: {s.value}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">По платформе</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {platformData.map((p) => (
                <Badge key={p.name} variant="outline" className="bg-white/10 border-white/20 text-white">
                  {p.name}: {p.value}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={
          <div className="grid gap-6">
            <div className="bg-white/10 backdrop-blur-xl border-white/20 rounded-xl p-6">
              <Skeleton className="h-6 w-64 bg-white/20 mb-4" />
              <Skeleton className="h-80 w-full bg-white/10" />
            </div>
            <div className="bg-white/10 backdrop-blur-xl border-white/20 rounded-xl p-6">
              <Skeleton className="h-6 w-64 bg-white/20 mb-4" />
              <Skeleton className="h-80 w-full bg-white/10" />
            </div>
          </div>
        }>
          <AnalyticsCharts timeSeries={timeSeries} platformData={platformData} />
        </Suspense>
      </div>
    </div>
  );
}