import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from "lucide-react";
import { getUserContentApi } from "@/api/content";

export default function Analytics() {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const userContent = await getUserContentApi();
        setContent(userContent);
      } catch (error) {
        console.error("Failed to fetch analytics content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Simple data transformation for charts
  const platformCounts = content.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(platformCounts).map(platform => ({
    name: platform,
    count: platformCounts[platform],
  }));

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">Аналитика</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Контент по платформам</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '400px' }}>
            {isLoading ? (
              <p className="text-white/70">Загрузка данных...</p>
            ) : chartData.length === 0 ? (
              <p className="text-white/70">Нет данных для анализа.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="count" fill="rgba(16, 185, 129, 0.7)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}