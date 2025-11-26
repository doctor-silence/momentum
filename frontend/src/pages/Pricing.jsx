import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Added Input import
import { Check, Crown, Shield, Zap, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/api/functions";
import { createBillingPortalSession } from "@/api/functions"; // Added import
import { applyPromoCodeApi } from "@/api/promocodes"; // Import applyPromoCodeApi

const FEATURES = [
  "Доступ к AI-студии контента",
  "Неограниченная генерация контента",
  "Календарь и библиотека контента",
  "Панель аналитики",
  "Приоритетные обновления и улучшения",
];

export default function Pricing() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState(""); // State for promo code input
  const [originalPrice, setOriginalPrice] = useState(4700); // Initial price
  const [discountedPrice, setDiscountedPrice] = useState(null); // State for discounted price

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await User.me();
    // Assuming the user object from User.me() has the subscription info
    setProfile(user);
    setLoading(false);
  };

  const isActiveStarter = profile?.subscription_status === 'active';

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const priceToUse = discountedPrice !== null ? discountedPrice : originalPrice;
      const payment = await createCheckoutSession({ price: priceToUse.toFixed(2), currency: "RUB" });
      if (payment?.confirmation?.confirmation_url) {
        window.location.href = payment.confirmation.confirmation_url;
      } else {
        setSubmitting(false);
        alert("Could not start checkout. Please try again.");
      }
    } catch (error) {
        setSubmitting(false);
        alert("Could not start checkout. Please try again.");
    }
  };

  // Added handleManageBilling function
  const handleManageBilling = async () => {
    // This would need to be implemented separately
    alert("Billing management is not available yet.");
  };

  const applyPromoCode = async () => {
    setSubmitting(true);
    console.log("Attempting to apply promo code:", promoCode, "with original price:", originalPrice); // Added console.log
    try {
      const response = await applyPromoCodeApi(promoCode, originalPrice);
      console.log("Promo code API response:", response); // Added console.log
      if (response.success) {
        setDiscountedPrice(response.data.discountedPrice);
        console.log("Discounted price set to:", response.data.discountedPrice); // Added console.log
      } else {
        setDiscountedPrice(null);
        console.log("Promo code application failed:", response.message); // Added console.log
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      setDiscountedPrice(null);
    } finally {
      setSubmitting(false);
      console.log("Submitting state set to false."); // Added console.log
    }
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
              <div className="text-3xl font-bold text-white">
                {discountedPrice !== null ? discountedPrice : originalPrice}₽
                <span className="text-lg text-white/70">/мес</span>
              </div>
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
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6">
              {loading ? (
                <div className="text-white/70">Загружаем ваш тариф...</div>
              ) : isActiveStarter ? (
                <>
                  <div className="text-lg text-white">Вы на тарифе Starter</div>
                   <div className="text-sm text-white/60">Ваша подписка активна.</div>
                </>
              ) : (
                <>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button
                      onClick={applyPromoCode}
                      disabled={submitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4"
                    >
                      Применить
                    </Button>
                  </div>
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