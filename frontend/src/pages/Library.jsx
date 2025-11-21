import React, { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import ContentViewModal from "../components/common/ContentViewModal";

const platformColors = {
  linkedin: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  instagram: "bg-pink-500/20 text-pink-300 border-pink-400/30",
  tiktok: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  twitter: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
};

const statusColors = {
  draft: "bg-gray-500/20 text-gray-300 border-gray-400/30",
  scheduled: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  published: "bg-green-500/20 text-green-300 border-green-400/30",
  archived: "bg-slate-500/20 text-slate-300 border-slate-400/30",
};

export default function Library() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [visibleCount, setVisibleCount] = useState(30);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    const all = await base44.entities.Content.list("-updated_date", 200);
    setItems(all);
    setIsLoading(false);
  };

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesPlatform = platform === "all" || i.platform === platform;
      const matchesStatus = status === "all" || i.status === status;
      const matchesSearch =
        !searchTerm ||
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.body?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPlatform && matchesStatus && matchesSearch;
    });
  }, [items, platform, status, searchTerm]);

  useEffect(() => {
    setVisibleCount(30);
  }, [searchTerm, platform, status]);

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const setStatusFor = async (item, newStatus) => {
    await base44.entities.Content.update(item.id, { status: newStatus });
    toast({ title: "Статус обновлён", description: `"${item.title}" установлен в ${newStatus}.` });
    await load();
  };

  const setScheduleFor = async (item, date) => {
    if (!date) return;
    await base44.entities.Content.update(item.id, { scheduled_date: date.toISOString(), status: "scheduled" });
    toast({ title: "Запланировано", description: `"${item.title}" запланирован на ${date.toLocaleDateString()}.` });
    await load();
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">Библиотека контента</h1>
          <div className="flex gap-2">
            <Button aria-label="Обновить библиотеку" onClick={load} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Link to={createPageUrl("Generate")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Создать контент
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 relative z-10 overflow-visible">
          <CardHeader>
            <CardTitle className="text-white">Фильтры</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Поиск контента..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger aria-label="Фильтр по платформе" className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Платформа" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20 z-50">
                <SelectItem value="all" className="text-white">Все платформы</SelectItem>
                <SelectItem value="linkedin" className="text-white">LinkedIn</SelectItem>
                <SelectItem value="instagram" className="text-white">Instagram</SelectItem>
                <SelectItem value="tiktok" className="text-white">TikTok</SelectItem>
                <SelectItem value="twitter" className="text-white">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Фильтр по статусу" className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20 z-50">
                <SelectItem value="all" className="text-white">Все статусы</SelectItem>
                <SelectItem value="draft" className="text-white">Черновик</SelectItem>
                <SelectItem value="scheduled" className="text-white">Запланировано</SelectItem>
                <SelectItem value="published" className="text-white">Опубликовано</SelectItem>
                <SelectItem value="archived" className="text-white">Архивировано</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 md:col-span-2 lg:col-span-3 overflow-visible">
              <CardContent className="p-10 text-center text-white/70">
                Контент не найден. Попробуйте изменить фильтры или создать новый контент.
              </CardContent>
            </Card>
          ) : filtered.slice(0, visibleCount).map((item) => (
            <Card key={item.id} className="bg-white/10 backdrop-blur-xl border-white/20 overflow-visible cursor-pointer hover:bg-white/15 transition-all" onClick={() => handleContentClick(item)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{item.body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${platformColors[item.platform]} border`}>{item.platform}</Badge>
                  <Badge className={`${statusColors[item.status]} border`}>{item.status}</Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">{item.content_type}</Badge>
                  {item.scheduled_date && (
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
                      {format(typeof item.scheduled_date === "string" ? parseISO(item.scheduled_date) : new Date(item.scheduled_date), "MMM d, yyyy")}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Select onValueChange={(v) => setStatusFor(item, v)}>
                    <SelectTrigger aria-label={`Установить статус для ${item.title}`} className="bg-white/10 border-white/20 text-white w-32">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20 z-50">
                      <SelectItem value="draft" className="text-white">Черновик</SelectItem>
                      <SelectItem value="scheduled" className="text-white">Запланировано</SelectItem>
                      <SelectItem value="published" className="text-white">Опубликовано</SelectItem>
                      <SelectItem value="archived" className="text-white">Архивировано</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" aria-label={`Запланировать ${item.title}`}>
                        <CalendarIcon className="w-4 h-4 mr-2" /> Запланировать
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-white/90 rounded-lg z-50">
                      <CalendarPicker
                        mode="single"
                        selected={item.scheduled_date ? parseISO(item.scheduled_date) : undefined}
                        onSelect={(date) => setScheduleFor(item, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length > visibleCount && (
          <div className="flex justify-center">
            <Button
              onClick={() => setVisibleCount((c) => c + 30)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              aria-label="Загрузить ещё"
            >
              Загрузить ещё ({Math.min(filtered.length - visibleCount, 30)} шт.)
            </Button>
          </div>
        )}

        <ContentViewModal
          content={selectedContent}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </div>
  );
}