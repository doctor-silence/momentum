import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, ArrowRight, Crown } from "lucide-react";

export default function WelcomeCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <Card className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 backdrop-blur-xl border-white/30 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-xl" />
        
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Добро пожаловать на Momentum Amplify!
                </h2>
              </div>
              
              <p className="text-white/80 text-lg max-w-2xl">
                Привет {user?.full_name?.split(' ')[0]}! Вы готовы изменить то, как мир видит ваше сообщение. 
                Давайте начнём с определения вашей ключевой трансформационной идеи и настройки ваших контентных суперспособностей.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to={createPageUrl("Profile")}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Завершить настройку
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Generate")}>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3 rounded-xl transition-all duration-300">
                    Пропустить и создать контент
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}