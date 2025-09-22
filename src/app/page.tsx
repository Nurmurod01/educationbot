"use client";

import React, { JSX } from "react";
import ResultScreen from "@/components/resultPage";
import TestScreen from "@/components/testPage";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/welcomePage";
import { usePersistedState } from "@/components/usePresidenthook";

// API Question interface
export interface ApiQuestion {
  id: number;
  level: number;
  word: string;
  options: {
    id: number;
    option: string;
    is_correct: boolean;
  }[];
}

// API User Response interface
export interface ApiUserResponse {
  user_id: number;
  username: string;
  full_name: string;
  level: {
    name: string;
  };
  coin: number;
}

type Page = "welcome" | "test" | "result";

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      user?: TelegramWebAppUser;
    };
    ready: () => void;
    expand?: () => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export default function WordBottleApp(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(
    new Set()
  );
  const [currentQuestion, setCurrentQuestion] = useState<ApiQuestion | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [testStarted, setTestStarted] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [limitReached, setLimitReached] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [userTryCount, setUserTryCount] = useState<number>(0);

  const [swap, setSwap] = usePersistedState<"eng-uzb" | "uzb-eng">(
    "swap",
    "eng-uzb"
  );

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (typeof tg.expand === "function") {
        tg.expand();
      }
    }
  }, []);

  const loadQuestions = async (): Promise<ApiQuestion[]> => {
    const userId = user?.id || 822245102;

    setLoading(true);
    try {
      const questionsRes = await fetch(
        `https://api.octava-edu.uz/api/quiz/${userId}?is_swap=${
          swap === "eng-uzb" ? 0 : 1
        }`
      );

      if (questionsRes.status === 450) {
        setLimitReached(true);
        setPopup(
          "Siz bugungi barcha so'zlarni topdingiz!\nSiz zo'rsiz\nErtaga qaytib urunib ko'ring"
        );
        return [];
      }
      if (questionsRes.ok) {
        const apiQuestions: ApiQuestion[] = await questionsRes.json();
        setQuestions(apiQuestions);
        return apiQuestions; // Return qilamiz
      } else {
        console.warn("Questions endpoint not available, using fallback");
        setQuestions([]);
        return []; // Bo'sh array qaytaramiz
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
      return []; // Xatolik holatida bo'sh array
    } finally {
      setLoading(false);
    }
  };

  const getNextQuestion = (questionsArray: ApiQuestion[] = questions) => {
    // Parameter sifatida questions arrayini olish
    const availableQuestions = questionsArray.filter(
      (q) => !usedQuestionIds.has(q.id)
    );

    console.log("Available questions:", availableQuestions.length); // Debug uchun

    if (availableQuestions.length === 0) {
      console.log("No more questions, going to result page"); // Debug uchun
      setCurrentPage("result");
      setTestStarted(false);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    setUsedQuestionIds((prev) => new Set([...prev, selectedQuestion.id]));

    return selectedQuestion;
  };

  useEffect(() => {
    if (testStarted && timeLeft > 0 && currentPage === "test") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentPage === "test") {
      setCurrentPage("result");
      setTestStarted(false);
    }
  }, [timeLeft, testStarted, currentPage]);

  useEffect(() => {
    if (limitReached) {
      const timer = setTimeout(() => {
        setPopup(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    const fetchQuestions = async () => {
      await loadQuestions();
    };
    fetchQuestions();
  }, []);
  const handleUserInfo = (tryCount: number) => {
    setUserTryCount(tryCount);
  };
  const startTest = async () => {
    // Avval loading holatiga o'tkazamiz
    setLoading(true);
    if (userTryCount <= 0) {
      setIsPracticeMode(true);
    } else {
      setIsPracticeMode(false);
    }
    console.log(swap);

    try {
      // Questions yuklab olamiz va natijani kutamiz
      const loadedQuestions = await loadQuestions();

      console.log("Loaded questions count:", loadedQuestions.length); // Debug uchun

      if (loadedQuestions.length === 0) {
        alert("Savollar yuklanmadi. Iltimos qayta urinib ko'ring.");
        setLoading(false);
        return;
      }

      setScore(0);
      setTotalAnswered(0);
      setTimeLeft(10);
      setUsedQuestionIds(new Set());

      // Birinchi savolni yuklab olgan questions array bilan olamiz
      const firstQuestion = getNextQuestion(loadedQuestions);

      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        setCurrentPage("test");
        setTestStarted(true);
      } else {
        alert("Savollar topilmadi.");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      alert("Test boshlashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (selectedIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect =
      selectedIndex ===
      currentQuestion.options.findIndex((opt) => opt.is_correct);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTotalAnswered((prev) => prev + 1);

    // Keyingi savolni olish (hozirgi questions state bilan)
    const nextQuestion = getNextQuestion(questions);
    setCurrentQuestion(nextQuestion);

    // Agar savol qolmagan bo'lsa, result sahifasiga o'tish
    if (!nextQuestion) {
      setCurrentPage("result");
      setTestStarted(false);
    }
  };

  const restart = () => {
    setCurrentPage("welcome");
    setCurrentQuestion(null);
    setScore(0);
    setTotalAnswered(0);
    setTimeLeft(20);
    setTestStarted(false);
    setUsedQuestionIds(new Set());
  };

  const goBack = () => {
    setCurrentPage("welcome");
    setTestStarted(false);
    setCurrentQuestion(null);
    setUsedQuestionIds(new Set());
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen bg-white flex items-center justify-center p-3">
        <div className="absolute top-3 start-3 end-3 bottom-3 p-3 rounded-2xl bg-[#A42FC1]">
          {/* Decorative circles */}
          <div className="absolute top-12 start-0.5 w-15 h-15 rounded-full bg-white/10 z-10"></div>
          <div className="absolute bottom-12 start-0.5 w-15 h-15 rounded-full bg-white/10 z-10"></div>
          <div className="absolute top-1 start-44 w-20 h-20 rounded-full bg-white/10 z-10"></div>
          <div className="absolute bottom-3 start-64 w-20 h-20 rounded-full bg-white/10 z-10"></div>
          <div className="absolute -bottom-5 start-24 w-20 h-20 rounded-full bg-white/10 z-10"></div>
          <div className="absolute top-15 -end-5 w-17 h-17 rounded-full bg-white/10 z-10"></div>
          <div className="absolute bottom-36 end-5 w-20 h-20 rounded-full bg-white/10 z-10"></div>
          <div className="absolute top-80 start-1 w-17 h-17 rounded-full bg-white/10 z-10"></div>
          <div className="absolute top-96 -end-5 w-17 h-17 rounded-full bg-white/10 z-10"></div>
          <div className="absolute top-5 end-56 w-10 h-10 rounded-full bg-white/10 z-10"></div>
          <div className="absolute bottom-44 start-10 w-10 h-10 rounded-full bg-white/10 z-10"></div>

          {/* Loading content */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-sm mx-auto text-center bg-white rounded-2xl p-8 shadow-2xl">
              {/* Loading spinner */}
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A42FC1]"></div>
              </div>

              <h2 className="text-xl font-semibold text-[#A42FC1] mb-2">
                Loading...
              </h2>
              <p className="text-gray-600 text-sm">Fetching your information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "welcome") {
    return (
      <div className="relative overflow-hidden min-h-screen">
        {popup && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center bg-red-500 text-white px-4 py-2 rounded-b-lg shadow-lg z-50 animate-fade-out">
            <h1 className="w-full">{popup}</h1>
          </div>
        )}
        <WelcomeScreen
          onStartTest={startTest}
          user={user}
          limitReached={limitReached}
          onUserInfoLoaded={handleUserInfo}
          isPracticeMode={isPracticeMode}
          setIsPracticeMode={setIsPracticeMode}
          swap={swap}
          setSwap={setSwap}
        />
        ;
      </div>
    );
  }

  if (currentPage === "test" && currentQuestion) {
    return (
      <TestScreen
        question={currentQuestion}
        timeLeft={timeLeft}
        totalAnswered={totalAnswered}
        onSelectAnswer={selectAnswer}
        onGoBack={goBack}
        setTimeLeft={setTimeLeft}
        isPracticeMode={isPracticeMode}
      />
    );
  }

  if (currentPage === "result") {
    return (
      <ResultScreen
        score={score}
        totalAnswered={totalAnswered}
        home={restart}
        onrestart={startTest}
        isPracticeMode={isPracticeMode}
      />
    );
  }

  return <></>;
}
