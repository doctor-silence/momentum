import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { generatePromoCodeApi } from "@/api/promocodes"; 
import { useToast } from "@/components/ui/use-toast";

export default function PromoCodeGenerator() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    console.log('handleGenerateCode triggered.'); // Log when function is triggered

    if (!email) {
      console.log('Email is empty, attempting to show toast.'); // Log if email is empty
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваш email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Calling generatePromoCodeApi with email:', email); // Log before API call
    try {
      const response = await generatePromoCodeApi({ email });
      if (response.success) {
        setGeneratedCode(response.data.code);
        setIsModalOpen(true);
        console.log('Promo code generated successfully:', response.data.code); // Log success
      } else {
        toast({
          title: "Ошибка",
          description: response.message || "Не удалось сгенерировать промокод.",
          variant: "destructive",
        });
        console.log('API call returned success: false. Message:', response.message); // Log API failure
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при генерации промокода. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
      console.error("Promo code generation error in catch block:", error); // Log catch error
    } finally {
      setLoading(false);
      console.log('Finished handleGenerateCode. Loading state:', false); // Log finally block
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="text-black" 
        />
        <Button onClick={handleGenerateCode} disabled={loading}>
          {loading ? 'Генерация...' : 'Получить промокод'}
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ваш промокод!</DialogTitle>
            <DialogDescription>
              Используйте этот промокод при оформлении заказа, чтобы получить скидку.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-3xl font-bold text-primary py-4">
            {generatedCode}
          </div>
          <DialogFooter>
            <Button onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              toast({ title: "Промокод скопирован!", description: "Вы можете вставить его при оформлении заказа." });
            }}>
              Копировать
            </Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}