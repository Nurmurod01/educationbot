"use client";

import React, { JSX } from "react";
import ResultScreen from "@/components/resultPage";
import TestScreen from "@/components/testPage";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/welcomePage";

// API Question interface
interface ApiQuestion {
  id: number;
  level: number;
  word: string;
  options: {
    id: number;
    option: string;
    is_correct: boolean;
  }[];
}

// Converted question format for the app
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(
    new Set()
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // 1 daqiqa
  const [testStarted, setTestStarted] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);

  // Load questions from API
  const loadQuestions = async () => {
    // if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`http://49.13.163.83:8083/api/quiz/822245102`);
      if (!res.ok) throw new Error("Failed to fetch questions");

      const apiQuestions: ApiQuestion[] = await res.json();

      // Convert API format to app format
      const convertedQuestions: Question[] = apiQuestions.map((apiQ) => {
        const correctIndex = apiQ.options.findIndex((opt) => opt.is_correct);
        return {
          id: apiQ.id,
          question: apiQ.word,
          options: apiQ.options.map((opt) => opt.option),
          correct: correctIndex,
        };
      });

      setQuestions(convertedQuestions);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get next unused question
  const getNextQuestion = () => {
    const availableQuestions = questions.filter(
      (q) => !usedQuestionIds.has(q.id)
    );

    if (availableQuestions.length === 0) {
      // Barcha savollar tugadi
      setCurrentPage("result");
      setTestStarted(false);
      return null;
    }

    // Random savol tanlash
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    // Ishlatilgan savollar ro'yxatiga qo'shish
    setUsedQuestionIds((prev) => new Set([...prev, selectedQuestion.id]));

    return selectedQuestion;
  };

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && currentPage === "test") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentPage === "test") {
      // Vaqt tugadi
      setCurrentPage("result");
      setTestStarted(false);
    }
  }, [timeLeft, testStarted, currentPage]);

  const startTest = async () => {
    // Savollarni yuklash
    await loadQuestions();

    // Test boshlash
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

    const isCorrect = selectedIndex === currentQuestion.correct;

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
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
