import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { User as UserEntity } from "@/api/entities";

export default function CTA() {
  const handleStart = async () => {
    await UserEntity.loginWithRedirect(window.location.origin + createPageUrl("Dashboard"));
  };

  return (
    <section id="pricing" className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200">
            <Crown className="w-4 h-4" />
            <span className="text-sm">Стартовый — 4700₽/мес</span>
          </div>
          <h3 className="text-white text-2xl md:text-3xl font-bold mt-4">Готовы усилить ваше сообщение?</h3>
          <p className="text-white/80 mt-2">Присоединяйтесь сейчас и начните публиковать конверсионный контент.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleStart} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-7 py-6 rounded-xl">
              Начать
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to={createPageUrl("Pricing")}>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Посмотреть полный план
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}