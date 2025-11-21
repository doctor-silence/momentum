import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OPTIONS = [
  { value: "content_strategist", label: "Стратег контента" },
  { value: "calendar_planner", label: "Планировщик календаря" },
  { value: "analytics_researcher", label: "Аналитик-исследователь" },
  { value: "qa_tester", label: "QA-тестировщик" }
];

export default function AgentPicker({ value, onChange }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-white text-sm font-medium">Выберите агента</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Выберите агента" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-white/20 z-50">
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-white">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}