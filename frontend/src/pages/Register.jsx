import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient'; // We'll need a proper auth api file later

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function Register() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      // We will create a proper auth API file later
      await apiClient.post('/auth/register', values);
      // For simplicity, navigate to login after registration.
      // A better UX would be to log them in directly.
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      // You would set an error state here to show the user
    }
  };
  
  const handleGoogleSignIn = () => {
    // Redirect the browser to the backend's Google auth route
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Создать аккаунт</CardTitle>
          <CardDescription className="text-white/70">
            Введите ваши данные для регистрации.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input placeholder="Иван" {...field} className="bg-white/10 border-white/20"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фамилия</FormLabel>
                      <FormControl>
                        <Input placeholder="Иванов" {...field} className="bg-white/10 border-white/20"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Зарегистрироваться
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
          <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/10" onClick={handleGoogleSignIn}>
            Google
          </Button>
           <p className="mt-4 text-center text-sm text-white/70">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="font-semibold text-purple-400 hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
