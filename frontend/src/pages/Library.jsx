import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library as LibraryIcon } from "lucide-react";
import { getUserContentApi } from "@/api/content"; // Import the API function

export default function Library() {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userContent = await getUserContentApi();
        setContent(userContent);
      } catch (error) {
        setError(error.message || "Не удалось загрузить контент.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []); // Runs once on component mount

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <LibraryIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">Библиотека контента</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Ваш сохраненный контент</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <p className="text-white/70 text-center">Загрузка...</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {!isLoading && !error && content.length === 0 && (
              <p className="text-white/70 text-center">Вы еще не сохранили ни одного контента.</p>
            )}
            {!isLoading && !error && content.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.map((item) => (
                  <Card key={item.id} className="bg-white/5 border-white/10 text-white flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-white/70 line-clamp-4">{item.body}</p>
                    </CardContent>
                    <div className="p-4 mt-auto border-t border-white/10 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-white/10">{item.platform}</Badge>
                        <Badge variant="outline" className="bg-white/10">{item.content_type}</Badge>
                        <Badge variant="secondary">{item.status}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}