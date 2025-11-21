import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Lightbulb, Sparkles, Loader2 } from "lucide-react";

export default function ContentIdeas({ ideas = [], isLoading, onSelectIdea, onRefresh }) {
  const handleUse = (idea) => {
    const prompt = `Create a ${idea.content_type} for ${idea.target_platform}.

Topic: ${idea.topic}
Unique angle: ${idea.angle}
Hook: ${idea.hook}
Key points: ${(idea.key_points || []).join("; ")}
CTA: ${idea.call_to_action}

Tone: engaging, expert, actionable.`;
    onSelectIdea(prompt);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader className="gap-3 sm:flex sm:items-center sm:justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-300" />
          Идеи для контента
        </CardTitle>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Создать новые идеи контента"
          className="w-full sm:w-auto sm:ml-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {isLoading ? "Генерация..." : "Создать идеи"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ideas.length === 0 && !isLoading && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-white/80">
            Идей пока нет. Нажмите «Создать идеи», чтобы получить свежие подсказки для вашего профиля.
          </div>
        )}
        {ideas.map((idea) => (
          <div key={idea.id || idea.topic} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-white font-semibold line-clamp-1">{idea.topic}</h4>
              <div className="flex gap-2">
                {idea.target_platform && (
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
                    {idea.target_platform}
                  </Badge>
                )}
                {idea.content_type && (
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
                    {idea.content_type}
                  </Badge>
                )}
                {typeof idea.trending_factor === "number" && (
                  <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/30">
                    Тренд {Math.round(idea.trending_factor)}
                  </Badge>
                )}
              </div>
            </div>
            {idea.hook && <p className="text-white/80 text-sm">{idea.hook}</p>}
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs line-clamp-2">
                {idea.angle}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => handleUse(idea)}
                aria-label={`Use idea: ${idea.topic}`}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Использовать идею
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}