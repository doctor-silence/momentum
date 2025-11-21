import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const toneOptions = [
  { value: "professional", label: "Профессиональный" },
  { value: "conversational", label: "Разговорный" },
  { value: "inspiring", label: "Вдохновляющий" },
  { value: "authoritative", label: "Авторитетный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "bold", label: "Смелый" }
];

export default function GenerationOptions({ 
  tone, 
  onToneChange, 
  audience, 
  onAudienceChange, 
  userProfile 
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-white font-medium">Tone</label>
        <Select value={tone} onValueChange={onToneChange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
            <SelectValue placeholder="Выберите тон" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
            {toneOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {userProfile?.target_audiences && userProfile.target_audiences.length > 0 && (
        <div className="space-y-2">
          <label className="text-white font-medium">Целевая аудитория</label>
          <Select value={audience} onValueChange={onAudienceChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <SelectValue placeholder="Выберите аудиторию" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
              {userProfile.target_audiences.map((aud) => (
                <SelectItem 
                  key={aud.name} 
                  value={aud.name}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {aud.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}