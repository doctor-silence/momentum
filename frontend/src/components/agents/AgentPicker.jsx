import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OPTIONS = [
  { value: "content_strategist", label: "Стратег контента" },
  { value: "calendar_planner", label: "Планировщик календаря" },
  { value: "analytics_researcher", label: "Аналитик-исследователь" },
  { value: "qa_tester", label: "QA-тестировщик" }
];

// Consistent styling for Select components
const selectTriggerClass = "bg-white/10 border-white/20 text-white data-[placeholder]:text-white/60 w-full md:w-[220px] justify-between";
const selectContentClass = "bg-slate-800/90 border-white/20 text-white backdrop-blur-lg";
const selectItemClass = "hover:bg-white/10 focus:bg-white/10";

export default function AgentPicker({ value, onChange }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-white text-sm font-medium">Выберите агента</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder="Выберите агента" />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className={selectItemClass}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}