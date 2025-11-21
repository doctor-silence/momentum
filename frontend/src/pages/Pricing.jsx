import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Zap, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/api/functions";
import { createBillingPortalSession } from "@/api/functions"; // Added import

const FEATURES = [
  "Доступ к AI-студии контента",
  "Неограниченная генерация контента",
  "Календарь и библиотека контента",
  "Панель аналитики",
  "Приоритетные обновления и улучшения",
];

const PRICE_ID = "price_1RzKqB7JTIVdAcBEmgt2CPCs"; // Stripe monthly price id (Starter)

export default function Pricing() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await User.me();
    const res = await UserProfile.filter({ created_by: user.email });
    setProfile(res[0] || null);
    setLoading(false);
  };

  const isActiveStarter =
    profile?.subscription_tier === "starter" &&
    (profile?.stripe_subscription_status === "active" || profile?.stripe_subscription_status === "trialing");

  const handleCheckout = async () => {
    setSubmitting(true);
    const { data } = await createCheckoutSession({ priceId: PRICE_ID });
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setSubmitting(false);
      alert("Could not start checkout. Please try again.");
    }
  };

  // Added handleManageBilling function
  const handleManageBilling = async () => {
    const { data } = await createBillingPortalSession();
    if (data?.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Info banner for new users without a profile */}
        {!loading && !profile && (
          <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-400/30 text-white/90">
            Новичок? Вы можете подписаться сейчас и заполнить профиль после оплаты.
          </div>
        )}

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200">
            <Crown className="w-4 h-4" />
            <span className="text-sm">Momentum Amplified App</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Разблокируйте ваш рост</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Переходите на тариф Starter для публикации неограниченного AI-контента и управления всем рабочим процессом в одном месте.
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Стартовый</CardTitle>
                <div className="text-white/60 text-sm">Всё необходимое для создания, планирования и анализа</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">4700₽<span className="text-lg text-white/70">/мес</span></div>
              {isActiveStarter ? (
                <Badge className="mt-2 bg-emerald-500/30 text-emerald-200 border-emerald-400/30">Активен</Badge>
              ) : (
                <Badge className="mt-2 bg-amber-500/30 text-amber-200 border-amber-400/30">Лучшее предложение</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400/30">
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                  </div>
                  <span className="text-white/90">{f}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2 text-white/60 text-sm">
                <Shield className="w-4 h-4" />
                Защищено Stripe
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6">
              {loading ? (
                <div className="text-white/70">Загружаем ваш тариф...</div>
              ) : isActiveStarter ? (
                <>
                  <div className="text-lg text-white">Вы на тарифе Starter</div>
                  <div className="flex gap-2 w-full">
                    <Button onClick={handleManageBilling} variant="outline" className="w-full bg-white/10 border-white/20 text-white">
                      Управление оплатой
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-white/80 text-center">Начните подписку сейчас</div>
                  <Button
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8"
                  >
                    {submitting ? "Переход..." : (
                      <>
                        Получить Starter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-white/50">Отмена в любое время</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}