
import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Home, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createBillingPortalSession } from "@/api/functions";

export default function PaymentSuccess() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await User.me();
        const res = await UserProfile.filter({ created_by: me.email });
        setProfile(res[0] || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleManageBilling = async () => {
    const { data } = await createBillingPortalSession();
    if (data?.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-300" />
            </div>
            <CardTitle className="text-white text-3xl">You're all set!</CardTitle>
            <p className="text-white/70">
              Thank you for subscribing to Momentum Amplify. Your plan is now active and you can start creating, scheduling, and analyzing content.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <div className="text-white/80 text-sm">
                Status:{" "}
                {loading ? (
                  "Checking..."
                ) : profile?.stripe_subscription_status ? (
                  <span className="text-emerald-300 font-medium">{profile.stripe_subscription_status}</span>
                ) : (
                  <span className="text-white/60">Pending</span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <Link to={createPageUrl("Dashboard")} className="w-full">
                <Button className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20">
                  <Home className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl("Generate")} className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="w-4 h-4 mr-2" /> Create Content
                </Button>
              </Link>
              <Link to={createPageUrl("Calendar")} className="w-full">
                <Button className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20">
                  <Calendar className="w-4 h-4 mr-2" /> Open Calendar
                </Button>
              </Link>
              <Button onClick={handleManageBilling} className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20" aria-label="Manage billing in Stripe">
                Manage Billing
              </Button>
            </div>

            <div className="text-xs text-white/60">
              Tip: You can revisit Pricing anytime to manage your plan.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
