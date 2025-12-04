import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';

export default function LeadMagnet() {
  const navigate = useNavigate();

  const handleGetPromoCode = () => {
    navigate('/register');
  };

  const text = "Ускорьте Развитие Бизнеса: Получите Скидку 30% на AI Контент".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Скидка 30% на AI Контент - Momentum Amplify</title>
        {/* Top.Mail.Ru counter */}
        <script type="text/javascript">
          {`
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3724112", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `}
        </script>
        <noscript>
          {`
            <div><img src="https://top-fwz1.mail.ru/counter?id=3724112;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div>
          `}
        </noscript>
        {/* /Top.Mail.Ru counter */}
      </Helmet>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {text.map((word, index) => (
              <motion.span
                key={index}
                variants={child}
                className="inline-block mr-2" // Added margin-right for word separation
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Получите эксклюзивный **Промокод на скидку 30%** на первый месяц использования Momentum Amplify. Начните создавать конверсионный контент уже сегодня.
          </p>
          <form className="mt-8 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={handleGetPromoCode} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-7 py-3 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                ПОЛУЧИТЬ ПРОМОКОД
              </button>
            </div>
            <p className="mt-3 text-xs text-white/60">Кредитная карта не требуется для начала.</p>
          </form>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Дорогой SMM и медленный рост?</h2>
            <p className="mt-3 text-white/70 max-w-3xl mx-auto">
              Ручное управление социальными сетями отнимает ресурсы, которые можно было бы вложить в развитие бизнеса.
            </p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white text-lg">Дорогой SMM-специалист</h3>
              <p className="mt-2 text-white/70 text-sm">Наем опытного менеджера стоит дорого, а результат не всегда предсказуем.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white text-lg">Медленный рост</h3>
              <p className="mt-2 text-white/70 text-sm">Ваши охваты и вовлеченность стагнируют, а конкуренты растут быстрее.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white text-lg">Хаос в публикациях</h3>
              <p className="mt-2 text-white/70 text-sm">Отсутствие системного подхода к SMM планированию приводит к нерегулярным и неэффективным публикациям.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Ваш Шанс на Прорыв с 30% Скидкой</h2>
            <p className="mt-3 text-white/70 max-w-3xl mx-auto">
              Промокод дает вам доступ к полному функционалу тарифа "Стартовый" за минимальную цену. Это идеальная возможность **протестировать AI-генерацию и аналитику контента** без больших вложений и увидеть реальный рост.
            </p>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Автоматизация SMM в 3 Простых Шага</h2>
            </div>
            <div className="mt-10 grid md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-semibold text-amber-300">1. Генерация</h4>
                    <p className="text-white/80 mt-1">Наша AI-студия создает конверсионный контент (посты, идеи, сценарии) за считанные минуты.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-amber-300">2. Планирование</h4>
                    <p className="text-white/80 mt-1">Визуальный календарь и функция drag-and-drop делают SMM планирование простым и предсказуемым.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-amber-300">3. Анализ</h4>
                    <p className="text-white/80 mt-1">Наша аналитика контента показывает, какие темы и форматы удваивают вашу вовлеченность.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-white">Начните Ваше Развитие Прямо Сейчас</h2>
          <p className="mt-4 text-white/80 text-lg">
            Получите ваш персональный промокод и сделайте первый шаг к автоматизации SMM и росту вашего бизнеса.
          </p>
          <form className="mt-8 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={handleGetPromoCode} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                ПОЛУЧИТЬ ПРОМОКОД НА СКИДКУ 30%
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-white/70">
            Кредитная карта не требуется. Безопасный вход через Google.
          </p>
        </div>
      </section>
    </>
  );
}
