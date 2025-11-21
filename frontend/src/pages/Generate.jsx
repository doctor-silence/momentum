import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Local API and utils
import { generateAiContent, generateIdeasFromAI } from "@/api/ai";
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
} from "lucide-react";

// Sub-components for Generate page
import PlatformSelector from "../components/generate/PlatformSelector";
import ContentTypeSelector from "../components/generate/ContentTypeSelector";
import GenerationOptions from "../components/generate/GenerationOptions";
import GeneratedContent from "../components/generate/GeneratedContent";
import ContentIdeas from "../components/generate/ContentIdeas";


export default function Generate() {
    const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  // Load profile from localStorage or use a default mock
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile && savedProfile !== 'undefined') {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
    // Fallback if no profile is in storage
    return {
      industry: 'бизнес-коучинг',
      core_message: 'Трансформация жизни через проверенные стратегии',
      brand_voice: { tone: 'professional' },
      content_pillars: ['мышление', 'стратегия', 'советы по успеху'],
    };
  });

  // Generation parameters
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");


    const generateContentIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const ideasPrompt = `КРИТИЧЕСКИ ВАЖНО: ВСЕ ИДЕИ ДОЛЖНЫ БЫТЬ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!

      Сгенерируй 5 СВЕЖИХ и НЕОБЫЧНЫХ идей контента для соцсетей на тему "${userProfile?.industry || 'успех в бизнесе и личная продуктивность'}".

      Контентные столпы: ${userProfile?.content_pillars?.join(', ')}
      
      Постарайся, чтобы эти идеи отличались от предыдущих. Случайный фактор для разнообразия: ${Math.random()}.

      Для каждой идеи предоставь НА РУССКОМ:
      - Тему
      - Уникальный угол
      - Хук для привлечения внимания
      - Ключевые пункты
      - Призыв к действию
      - Прогноз (low/medium/high)
      - Трендовый фактор (0-100)

      ВСЁ ДОЛЖНО БЫТЬ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!`;

      const result = await generateIdeasFromAI(ideasPrompt);
      setContentIdeas(result.ideas || []);

    } catch (error) {
      console.error("Error generating content ideas:", error);
      toast({
        variant: "destructive",
        title: "Ошибка генерации идей",
        description: error.message || "Не удалось получить ответ от AI.",
      });
    } finally {
      setIsLoadingIdeas(false);
    }
  };
  
const generateContent = async (prompt = null) => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const finalPrompt = prompt || customPrompt || `Создай контент о ${userProfile?.core_message}`;
      
      const platformAndContentTypeSpecs = {
        instagram: {
          post: "Формат для Instagram поста: Завлекающий заголовок. Текст до 100 СЛОВ (2-3 коротких абзаца). Обязательно используй 2-3 релевантных эмодзи для визуального акцента. Закончи вопросом. 5-7 релевантных хештегов.",
          story: "Формат для Instagram сторис: Разбей на 3-5 'экранов'. Каждый экран - это короткая фраза или тезис (5-15 слов).",
          video_script: "Формат для Reels: Сценарий для короткого вертикального видео (15-60 секунд). Сильный хук в первые 3 секунды."
        },
        telegram: {
          post: "Формат для Telegram поста: Информативный, хорошо структурированный текст. 2-4 абзаца (150-300 слов). Используй **жирный шрифт** и *курсив*.",
        },
        linkedin: {
          post: "Формат для LinkedIn поста: Профессиональный, экспертный пост. 4-5 абзацев (250-350 слов). Структурируй текст.",
        },
        tiktok: {
          video_script: "Формат для TikTok: Сценарий для вирусного видео (15-45 секунд). Простой и понятный сценарий.",
        },
        twitter: {
          post: "Формат для Twitter (X): Один короткий твит (до 280 символов).",
          thread: "Формат для треда в Twitter (X): Серия из 3-5 твитов.",
        },
        vk: {
          post: "Формат для поста VK: Дружелюбный, вовлекающий пост. 3-4 абзаца (150-300 слов).",
        },
      };

      const spec = platformAndContentTypeSpecs[selectedPlatform]?.[selectedContentType] || 'Стандартный текстовый пост.';

      const fullPromptContext = `Главное требование: ВСЁ должно быть ТОЛЬКО на русском языке.

### Контекст эксперта
Ты эксперт по созданию русскоязычного контента для **${userProfile?.industry}**.
Твоя задача — написать контент на тему, которую я укажу ниже.
**ЗАПРЕЩЕНО:** Ты НЕ должен упоминать бизнес, корпорации, менеджмент или любую другую тему, не связанную напрямую с **${userProfile?.industry}** и темой запроса. Фокусируйся только на теме.

### Параметры
- **Ключевое сообщение:** ${userProfile?.core_message}
- **Голос бренда:** ${selectedTone}
${selectedAudience ? `- **Целевая аудитория:** ${selectedAudience}` : ''}
- **Платформа:** ${selectedPlatform}
- **Тип контента:** ${selectedContentType}

### СТРОГОЕ ТРЕБОВАНИЕ К ФОРМАТУ
Ты ДОЛЖЕН неукоснительно следовать спецификации формата. Не превышай указанный объем.
- **Спецификация формата:** ${spec}

### Требования к контенту
Создай убедительный контент, который:
1. Сразу захватывает внимание.
2. Даёт реальную ценность в рамках заданной темы.
3. Отражает твою экспертизу.
4. Включает русскоязычные хештеги.
5. Содержит чёткий призыв к действию.
6. Уместно использует эмодзи для улучшения читаемости.

### Тема
${finalPrompt}

### Критическое напоминание
Весь текст должен быть ТОЛЬКО на русском языке и строго соответствовать теме и спецификации формата.`;

      const result = await generateAiContent(fullPromptContext);

      setGeneratedContent({
        ...result,
        platform: selectedPlatform,
        content_type: selectedContentType,
        target_audience: selectedAudience,
        generation_prompt: finalPrompt
      });

    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        variant: "destructive",
        title: "Ошибка генерации",
        description: error.message || "Не удалось получить ответ от AI.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    const text = `${generatedContent.body}\n\n${generatedContent.hashtags?.map(tag => `#${tag}`).join(' ') || ''}`;
    await navigator.clipboard.writeText(text);
    toast({ title: "Скопировано!", description: "Текст контента скопирован в буфер обмена." });
  };
  
  const saveContent = async () => {
    toast({
        variant: "destructive",
        title: "Функция не реализована",
        description: "Сохранение контента будет добавлено в будущем.",
      });
  }

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
                <GeneratedContent content={generatedContent} onSave={saveContent} onCopy={copyToClipboard} onRegenerate={() => generateContent(generatedContent.generation_prompt)} isLoading={isLoading} />
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