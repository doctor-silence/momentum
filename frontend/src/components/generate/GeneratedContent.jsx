import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Copy, 
  Save, 
  RefreshCw, 
  Edit, 
  Eye,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function GeneratedContent({ 
  content, 
  onSave, 
  onCopy, 
  onRegenerate,
  isLoading,
  isSaving // Add isSaving prop
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const updatedContent = { ...content, body: editedContent };
    onSave(updatedContent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Performance Prediction */}
      <Card className="bg-gradient-to-r from-emerald-900/40 to-green-900/30 backdrop-blur-xl border border-emerald-500/40 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="text-white font-semibold">Прогноз эффективности</p>
                <p className="text-white/80 text-sm">
                  {content.estimated_performance || "Ожидается высокое вовлечение"}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-700/50 text-white border-emerald-500/60">
              AI оптимизирован
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Сгенерированный контент
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30">
              {content.platform}
            </Badge>
            <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30">
              {content.content_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Preview */}
          <div className="relative">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm min-h-40 resize-none"
              />
            ) : (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 min-h-40">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {content.body}
                </p>
              </div>
            )}
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="space-y-2">
              <label className="text-white font-medium">Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((hashtag, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white/90"
                  >
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {(content.hook_analysis || content.value_proposition) && (
            <div className="grid md:grid-cols-2 gap-4">
              {content.hook_analysis && (
                <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
                  <h4 className="text-white font-medium mb-2">Анализ хука</h4>
                  <p className="text-purple-200 text-sm">{content.hook_analysis}</p>
                </div>
              )}
              {content.value_proposition && (
                <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-400/30">
                  <h4 className="text-white font-medium mb-2">Ценностное предложение</h4>
                  <p className="text-amber-200 text-sm">{content.value_proposition}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving} // Disable when saving
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить и запланировать
                </>
              )}
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-2 rounded-lg transition-all duration-300"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-2 rounded-lg transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Превью" : "Редактировать"}
            </Button>

            <Button
              onClick={onRegenerate}
              disabled={isLoading}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-2 rounded-lg transition-all duration-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Перегенерировать
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}