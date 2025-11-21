import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, BarChart3, Library, Clock, Shield } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "AI-студия контента", desc: "Создавайте конверсионный контент в вашем стиле." },
  { icon: Calendar, title: "Календарь контента", desc: "Планируйте месяц с помощью перетаскивания." },
  { icon: BarChart3, title: "Аналитика", desc: "Отслеживайте эффективность и удваивайте результаты." },
  { icon: Library, title: "Библиотека контента", desc: "Организуйте и используйте ваш лучший контент." },
  { icon: Clock, title: "Экономия времени", desc: "Публикуйте больше с минимальными усилиями." },
  { icon: Shield, title: "Безопасность", desc: "Защищенная аутентификация и оплата через Stripe." },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
      <div className="relative max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Всё, что вам нужно</h2>
        <p className="text-white/70 text-center mt-2">Планируйте. Создавайте. Публикуйте. Развивайтесь.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {FEATURES.map((f) => (
            <Card key={f.title} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">{f.title}</h3>
                <p className="text-white/70 mt-1 text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}