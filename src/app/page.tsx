"use client";

import React, { JSX } from "react";
import ResultScreen from "@/components/resultPage";
import TestScreen from "@/components/testPage";
import WelcomeScreen from "@/components/welcomePage";
import { useState, useEffect } from "react";

// Sample questions data
const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correct: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
  },
];

type Page = "welcome" | "test" | "result";

export default function WordBottleApp(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [testStarted, setTestStarted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg && tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);
  useEffect(() => {
    if (testStarted && timeLeft > 0 && currentPage === "test") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentPage === "test") {
      setCurrentPage("result");
      setTestStarted(false);
    }
  }, [timeLeft, testStarted, currentPage]);

  const startTest = () => {
    setCurrentPage("test");
    setTestStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(20);
  };

  const selectAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentPage("result");
      setTestStarted(false);
    }
  };

  const restart = () => {
    setCurrentPage("welcome");
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setTestStarted(false);
  };

  const goBack = () => {
    setCurrentPage("welcome");
    setTestStarted(false);
  };

  // Render based on current page
  if (currentPage === "welcome") {
    return <WelcomeScreen onStartTest={startTest} user={user} />;
  }

  if (currentPage === "test") {
    return (
      <TestScreen
        questions={questions}
        currentQuestion={currentQuestion}
        timeLeft={timeLeft}
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
        questions={questions}
        home={restart}
        onrestart={startTest}
      />
    );
  }

  return <></>;
}
