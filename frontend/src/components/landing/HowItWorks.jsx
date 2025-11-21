import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Wand2, Calendar, BarChart3 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { icon: Wand2, title: "Генерация", desc: "Укажите тему и аудиторию. Получите контент в вашем стиле." },
    { icon: Calendar, title: "Планирование", desc: "Запланируйте публикации в календаре одним кликом." },
    { icon: BarChart3, title: "Анализ", desc: "Отслеживайте эффективность и усиливайте успешный контент." },
  ];
  return (
    <section id="how" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Как это работает</h2>
        <p className="text-white/70 text-center mt-2">Три простых шага для усиления вашего сообщения</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {steps.map((s) => (
            <Card key={s.title} className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="text-white/70 text-sm">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-6 text-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">Кредитная карта не требуется для начала</span>
        </div>
      </div>
    </section>
  );
}