
import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import apiClient from "@/api/apiClient";

export default function PaymentSuccess() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const me = await User.me();
      setProfile(me);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleActivate = async () => {
    try {
        await apiClient.put('/users/me/activate-subscription');
        await loadProfile(); // Reload profile to get updated status
        alert('Подписка активирована!');
    } catch (error) {
        console.error('Error activating subscription:', error);
        alert('Не удалось активировать подписку.');
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-300" />
            </div>
            <CardTitle className="text-white text-3xl">Все готово!</CardTitle>
            <p className="text-white/70">
              Благодарим за подписку на Momentum Amplify. Ваш план активирован, и вы можете начать создавать, планировать и анализировать контент.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <div className="text-white/80 text-sm">
                Статус:{" "}
                {loading ? (
                  "Проверка..."
                ) : profile?.subscription_status ? (
                  <span className="text-emerald-300 font-medium">{profile.subscription_status}</span>
                ) : (
                  <span className="text-white/60">В ожидании</span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Link to={createPageUrl("Dashboard")} className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Home className="w-4 h-4 mr-2" /> Панель управления
                </Button>
              </Link>
            </div>

            <div className="text-xs text-white/60 text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="font-bold text-red-300/90 mb-2">Для информации:</p>
                <p>Поскольку приложение запущено локально, сервер не может автоматически получать уведомления от Юкассы об успешной оплате (веб-хуки).</p>
                <p>Нажмите эту кнопку, чтобы вручную активировать подписку для тестирования.</p>
                <Button onClick={handleActivate} className="mt-4" variant="destructive">Активировать подписку</Button>
            </div>

            <div className="text-xs text-white/60 text-center">
              Совет: Вы можете в любое время вернуться к тарифам, чтобы управлять своим планом.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
