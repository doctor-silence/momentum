import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Local API and utils
import { generateAiContent, generateIdeasFromAI } from "@/api/ai";
import { saveContentApi } from "@/api/content";
import { createPageUrl } from "@/utils";

// UI Components
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Lightbulb,
  Save
} from "lucide-react";

// Sub-components for Generate page
import PlatformSelector from "../components/generate/PlatformSelector";
import ContentTypeSelector from "../components/generate/ContentTypeSelector";
import GenerationOptions from "../components/generate/GenerationOptions";
import GeneratedContent from "../components/generate/GeneratedContent";
import ContentIdeas from "../components/generate/ContentIdeas";

export default function Generate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile && savedProfile !== 'undefined') {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
    return {
      industry: 'бизнес-коучинг',
      core_message: 'Трансформация жизни через проверенные стратегии',
      brand_voice: { tone: 'professional' },
      content_pillars: ['мышление', 'стратегия', 'советы по успеху'],
    };
  });

  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");

  const generateContentIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const ideasPrompt = `...`; // Prompt for ideas
      const result = await generateIdeasFromAI(ideasPrompt);
      setContentIdeas(result.ideas || []);
    } catch (error) {
      console.error("Error generating content ideas:", error);
      toast({ variant: "destructive", title: "Ошибка генерации идей", description: error.message });
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const generateContent = async (prompt = null) => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const finalPrompt = prompt || customPrompt || `Создай контент о ${userProfile?.core_message}`;
      const spec = "..."; // Simplified for brevity
      const fullPromptContext = `...`; // Simplified for brevity
      const result = await generateAiContent(fullPromptContext);
      setGeneratedContent({ ...result, generation_prompt: finalPrompt });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({ variant: "destructive", title: "Ошибка генерации", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;
    setIsSaving(true);
    try {
      const contentToSave = {
        title: generatedContent.title,
        body: generatedContent.body,
        platform: generatedContent.platform,
        content_type: generatedContent.content_type,
        hashtags: generatedContent.hashtags,
        status: "draft"
      };
      await saveContentApi(contentToSave);
      toast({ title: "Контент сохранен" });
      navigate('/library');
    } catch (error) {
      console.error("Error saving content:", error);
      toast({ variant: "destructive", title: "Ошибка сохранения", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
    const copyToClipboard = async () => {
    if (!generatedContent) return;
    const text = `${generatedContent.body}\n\n${generatedContent.hashtags?.map(tag => `#${tag}`).join(' ') || ''}`;
    await navigator.clipboard.writeText(text);
    toast({ title: "Скопировано!", description: "Текст контента скопирован в буфер обмена." });
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">AI-студия контента</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Превратите ваше сообщение в убедительный контент, который усиливает ваше влияние на всех платформах
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="relative z-20 pointer-events-auto bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                    Настройки генерации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PlatformSelector selected={selectedPlatform} onSelect={setSelectedPlatform} />
                  <ContentTypeSelector selected={selectedContentType} onSelect={setSelectedContentType} platform={selectedPlatform} />
                  <GenerationOptions tone={selectedTone} onToneChange={setSelectedTone} audience={selectedAudience} onAudienceChange={setSelectedAudience} userProfile={userProfile} />
                  <div className="space-y-3">
                    <label className="text-white font-medium">Пользовательский запрос</label>
                    <Textarea
                      placeholder="Опишите, какой контент вы хотите создать..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm resize-none h-24"
                    />
                  </div>
                  <Button onClick={() => generateContent()} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105">
                    {isLoading ? (<><RefreshCw className="w-5 h-5 mr-2 animate-spin" />Генерация...</>) : (<><Sparkles className="w-5 h-5 mr-2" />Сгенерировать контент</>)}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <ContentIdeas
              ideas={contentIdeas}
              isLoading={isLoadingIdeas}
              onSelectIdea={generateContent}
              onRefresh={generateContentIdeas}
            />
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {generatedContent ? (
                <GeneratedContent content={generatedContent} onSave={saveContent} onCopy={copyToClipboard} onRegenerate={() => generateContent(generatedContent.generation_prompt)} isLoading={isLoading} isSaving={isSaving} />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-white/20 flex items-center justify-center mx-auto">
                      <Lightbulb className="w-16 h-16 text-white/50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Готовы творить магию?</h3>
                    <p className="text-white/70 max-w-md mx-auto">
                      Выберите платформу, тип контента и нажмите «Сгенерировать», чтобы создать убедительный контент, усиливающий ваше сообщение
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
