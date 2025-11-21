import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Linkedin,
  Instagram, 
  Music,
  Twitter,
  Users,
  Send
} from "lucide-react";

const platforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-400/30",
    description: "Профессиональная сеть"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "from-pink-500 to-purple-600",
    bgColor: "from-pink-500/20 to-purple-600/20",
    borderColor: "border-pink-400/30",
    description: "Визуальные истории"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-400/30",
    description: "Короткие видео"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-400/30",
    description: "Разговоры"
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    color: "from-blue-400 to-blue-600",
    bgColor: "from-blue-400/20 to-blue-600/20",
    borderColor: "border-blue-400/30",
    description: "Мессенджер"
  },
  {
    id: "vk",
    name: "ВКонтакте",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
    bgColor: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    description: "Соцсеть"
  }
];

export default function PlatformSelector({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <label className="text-white font-medium">Платформа</label>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selected === platform.id;
          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(platform.id)}
              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? `bg-gradient-to-r ${platform.bgColor} border ${platform.borderColor} shadow-lg` 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg ${isSelected ? `bg-gradient-to-r ${platform.color}` : 'bg-white/10'}`}>
                  <platform.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{platform.name}</p>
                  <p className="text-white/60 text-xs">{platform.description}</p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}