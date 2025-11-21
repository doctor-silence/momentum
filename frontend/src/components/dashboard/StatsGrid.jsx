import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  TrendingUp, 
  Heart, 
  Calendar,
  ArrowUpRight
} from "lucide-react";

export default function StatsGrid({ stats }) {
  const statCards = [
    {
      title: "Всего контента",
      value: stats.totalContent,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-400/30"
    },
    {
      title: "Общее вовлечение",
      value: stats.totalEngagement.toLocaleString(),
      icon: Heart,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-400/30"
    },
    {
      title: "Ср. вовлечение",
      value: Math.round(stats.avgEngagement),
      icon: TrendingUp,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-400/30"
    },
    {
      title: "На этой неделе",
      value: stats.contentThisWeek,
      icon: Calendar,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-400/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-r ${stat.bgGradient} backdrop-blur-xl border ${stat.border} shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-green-400 font-medium">
                  {index === 0 ? "12%" : index === 1 ? "8%" : index === 2 ? "15%" : "5%"} в этом месяце
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}