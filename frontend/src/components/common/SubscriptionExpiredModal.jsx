import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, XCircle } from "lucide-react"; // Using XCircle for expired status
import { Link } from "react-router-dom"; // Assuming you have react-router-dom

export default function SubscriptionExpiredModal({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-red-500/50 text-white z-50"> 
        <DialogHeader className="flex flex-col items-center text-center">
          <XCircle className="w-16 h-16 text-red-400 mb-4" /> 
          <DialogTitle className="text-2xl font-bold text-red-300"> 
            Срок вашей подписки истек!
          </DialogTitle>
          <DialogDescription className="text-lg text-white/70 mt-2">
            К сожалению, срок действия вашей платной подписки истек.
            Чтобы продолжить пользоваться всеми функциями AI-студии,
            пожалуйста, продлите свою подписку.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
          <Link to="/pricing">
            <Button className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"> 
              <Sparkles className="w-5 h-5" />
              Продлить подписку
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-white/70 hover:bg-white/10 hover:text-white border border-white/20 py-3 px-6 rounded-xl transition-all duration-300"
          >
            Не сейчас
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
