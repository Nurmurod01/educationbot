"use client";

import React, { JSX } from "react";
import ResultScreen from "@/components/resultPage";
import TestScreen from "@/components/testPage";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/welcomePage";

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
  const [timeLeft, setTimeLeft] = useState(20);
  const [testStarted, setTestStarted] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);

  const loadQuestions = async () => {
    const userId = user?.id;

    setLoading(true);
    try {
      const questionsRes = await fetch(
        `http://49.13.163.83:8083/api/quiz/${userId}`
      );

      if (questionsRes.ok) {
        const apiQuestions: ApiQuestion[] = await questionsRes.json();
        setQuestions(apiQuestions);
      } else {
        console.warn("Questions endpoint not available, using fallback");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getNextQuestion = () => {
    const availableQuestions = questions.filter(
      (q) => !usedQuestionIds.has(q.id)
    );

    if (availableQuestions.length === 0) {
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

  const startTest = async () => {
    await loadQuestions();

    setCurrentPage("test");
    setTestStarted(true);
    setScore(0);
    setTotalAnswered(0);
    setTimeLeft(20);
    setUsedQuestionIds(new Set());

    // Birinchi savolni olish
    const firstQuestion = getNextQuestion();
    setCurrentQuestion(firstQuestion);
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

    // Keyingi savolni olish
    const nextQuestion = getNextQuestion();
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
    return <WelcomeScreen onStartTest={startTest} user={user} />;
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
      />
    );
  }

  return <></>;
}
