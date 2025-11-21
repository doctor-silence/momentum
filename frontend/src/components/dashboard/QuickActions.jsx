import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Settings, 
  Zap,
  ArrowRight,
  ClipboardList
} from "lucide-react";

const quickActions = [
  {
    title: "Создать контент",
    description: "Создавайте AI-контент",
    icon: Sparkles,
    href: "Generate",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-400/30"
  },
  {
    title: "Запланировать посты",
    description: "Планируйте календарь",
    icon: Calendar,
    href: "Calendar",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-400/30"
  },
  {
    title: "Смотреть аналитику",
    description: "Отслеживайте эффективность",
    icon: BarChart3,
    href: "Analytics",
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-400/30"
  },
  {
    title: "Настройки профиля",
    description: "Обновите голос бренда",
    icon: Settings,
    href: "Profile",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/30"
  },
  {
    title: "Запустить QA-аудит",
    description: "Полный QA + UX отчёт",
    icon: ClipboardList,
    href: "Agents?agent=qa_tester&qa=true",
    gradient: "from-fuchsia-500 to-rose-500",
    bgGradient: "from-fuchsia-500/20 to-rose-500/20",
    border: "border-fuchsia-400/30"
  }
];

export default function QuickActions({ userProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(action.href)}>
                <div className={`group p-4 rounded-xl bg-gradient-to-r ${action.bgGradient} border ${action.border} hover:scale-105 transition-all duration-300 cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{action.title}</h4>
                        <p className="text-white/70 text-sm">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}