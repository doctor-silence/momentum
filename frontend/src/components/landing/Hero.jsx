import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
// import { User as UserEntity } from "@/api/entities"; // Not needed anymore

export default function Hero({ onOpenPricingModal }) {
  // const handleSignIn = async () => { // Not needed anymore
  //   await UserEntity.loginWithRedirect(window.location.origin + createPageUrl("Dashboard"));
  // };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-purple-500/10" />
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200">
          <Zap className="w-4 h-4" />
          <span className="text-sm">Momentum Amplify</span>
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Превратите ваше сообщение в движение
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
          Создавайте, планируйте и анализируйте контент, который развивает ваш бизнес — без лишних сложностей.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={createPageUrl("Register")}>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-7 py-6 rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Начать
            </Button>
          </Link>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={onOpenPricingModal}>
            Посмотреть тарифы
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-white/70 text-sm">
          <Shield className="w-4 h-4" />
          <span>Безопасный вход через Google • Отмена в любой момент</span>
        </div>
      </div>
    </section>
  );
}