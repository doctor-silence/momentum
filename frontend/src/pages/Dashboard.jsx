import React, { useEffect, useState } from "react";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentContent from "@/components/dashboard/RecentContent";
import QuickActions from "@/components/dashboard/QuickActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { getUserContentApi } from "@/api/content";

export default function Dashboard() {
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCodeData, setPromoCodeData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userContent = await getUserContentApi();
        setContent(userContent || []);

        const derivedStats = {
          totalContent: userContent.length,
          totalEngagement: 0, 
          avgEngagement: 0, 
          contentThisWeek: userContent.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        };
        setStats(derivedStats);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Check for promo code after registration
    const storedPromoCode = localStorage.getItem('newlyRegisteredPromoCode');
    if (storedPromoCode) {
      try {
        const parsedPromoCode = JSON.parse(storedPromoCode);
        setPromoCodeData(parsedPromoCode);
        setIsPromoModalOpen(true);
        localStorage.removeItem('newlyRegisteredPromoCode'); // Clear it after showing
      } catch (e) {
        console.error("Failed to parse stored promo code:", e);
        localStorage.removeItem('newlyRegisteredPromoCode'); // Clear invalid data
      }
    }
  }, []); // Run once on mount

  const handleCopyPromoCode = () => {
    if (promoCodeData?.code) {
      navigator.clipboard.writeText(promoCodeData.code);
      toast({ title: "Промокод скопирован!", description: "Вы можете вставить его при оформлении заказа." });
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <WelcomeCard />
      <StatsGrid stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentContent content={content} isLoading={isLoading} />
        </div>
      </div>

      {/* Promo Code Modal */}
      <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white"> {/* Added custom classes */}
          <DialogHeader>
            <DialogTitle className="text-white">Поздравляем с регистрацией!</DialogTitle> {/* Adjusted text color */}
            <DialogDescription className="text-white/70"> {/* Adjusted text color */}
              Мы рады приветствовать вас! Вот ваш эксклюзивный промокод.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-3xl font-bold text-amber-400 py-4"> {/* Adjusted text color */}
            {promoCodeData?.code}
          </div>
          <p className="text-center text-sm text-white/70"> {/* Adjusted text color */}
            Скидка: {promoCodeData?.discountValue}% ({promoCodeData?.discountType === 'percentage' ? 'процентная' : 'фиксированная'})
            {promoCodeData?.expiresAt && ` до ${new Date(promoCodeData.expiresAt).toLocaleDateString()}`}
          </p>
          <DialogFooter>
            <Button onClick={handleCopyPromoCode} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"> {/* Styled button */}
              Копировать
            </Button>
            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => setIsPromoModalOpen(false)}> {/* Removed variant="outline" and applied direct styles */}
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}