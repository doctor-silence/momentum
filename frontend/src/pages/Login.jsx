import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email("Неверный формат email."),
  password: z.string().min(1, "Пароль обязателен."),
});

export default function Login() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setFormError(''); // Reset error on new submission
    try {
      const { data } = await apiClient.post('/auth/login', values);
      localStorage.setItem('authToken', data.token); // Save the token
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; // Update apiClient instance
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      // The interceptor might create a new Error, so check error.message first.
      const message = error.message || error.response?.data?.message || 'Произошла неизвестная ошибка.';
      setFormError(message);
    }
  };
  
  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google'; // Use relative path
  };

  const handleVkSignIn = () => {
    window.location.href = '/api/auth/vk'; // Use relative path
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
          <CardDescription className="text-white/70">
            Введите ваш email и пароль для входа.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} className="bg-white/10 border-white/20"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-white/20"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && (
                <p className="text-sm font-medium text-red-400 text-center">{formError}</p>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800/80 px-2 text-white/70">
                Или продолжить с
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/10" onClick={handleGoogleSignIn}>
              Google
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-white/70">
            Нет аккаунта?{" "}
            <Link to="/register" className="font-semibold text-purple-400 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
