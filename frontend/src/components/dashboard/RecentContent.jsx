import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Heart, 
  MessageSquare, 
  ExternalLink,
  Clock,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ContentViewModal from "../common/ContentViewModal";

const platformColors = {
  linkedin: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  instagram: "bg-pink-500/20 text-pink-300 border-pink-400/30",
  tiktok: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  twitter: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
};

const statusColors = {
  draft: "bg-gray-500/20 text-gray-300 border-gray-400/30",
  scheduled: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  published: "bg-green-500/20 text-green-300 border-green-400/30"
};

export default function RecentContent({ content }) {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  if (content.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-white/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Контента пока нет</h3>
            <p className="text-white/70 mb-6">Начните создавать потрясающий контент для усиления вашего сообщения</p>
            <Link to={createPageUrl("Generate")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                Создать первый контент
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Недавний контент
          </CardTitle>
          <Link to={createPageUrl("Library")}>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Показать все
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleContentClick(item)}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${platformColors[item.platform]} border font-medium`}>
                      {item.platform}
                    </Badge>
                    <Badge className={`${statusColors[item.status]} border font-medium`}>
                      {item.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-white line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.created_date), "MMM d, yyyy")}
                    </div>
                    {item.performance_data && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.performance_data.impressions || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {item.performance_data.likes || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {item.performance_data.comments || 0}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <ContentViewModal
        content={selectedContent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </motion.div>
  );
}