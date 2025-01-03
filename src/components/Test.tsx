import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TestContainer = styled.div`
  width: 95%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4299e1, #63b3ed);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const Timer = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2b6cb0;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 1rem;
  background: rgba(237, 242, 247, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);

  span {
    background: linear-gradient(90deg, #4299e1, #63b3ed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 640px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
`;

const QuestionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: rgba(237, 242, 247, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const QuestionDot = styled.div<{
  active: boolean;
  answered: boolean;
  isCorrect?: boolean;
  showResult: boolean;
}>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ active, answered, isCorrect, showResult }) => {
    if (active) return "linear-gradient(135deg, #4299e1, #63b3ed)";
    if (!showResult)
      return answered ? "linear-gradient(135deg, #48BB78, #68D391)" : "#e2e8f0";
    if (isCorrect) return "linear-gradient(135deg, #48BB78, #68D391)";
    return answered ? "linear-gradient(135deg, #F56565, #E53E3E)" : "#e2e8f0";
  }};
  color: ${({ active, answered, showResult }) =>
    active || (showResult && answered) || (!showResult && answered)
      ? "#ffffff"
      : "#4a5568"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ active }) =>
    active ? "0 4px 12px rgba(66, 153, 225, 0.3)" : "none"};

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(237, 242, 247, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const QuestionText = styled.div`
  font-size: 1.3rem;
  color: #2b6cb0;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }

  pre {
    margin: 1rem 0;
    border-radius: 8px;
    font-size: 1rem;
    background: #1e1e1e !important;
  }

  code {
    font-family: "Fira Code", monospace;
    font-size: 0.9em;
  }
`;

const OptionButton = styled.button<{
  selected: boolean;
  isCorrect?: boolean;
  showResult: boolean;
}>`
  display: block;
  width: 100%;
  padding: 1rem 1.25rem;
  margin: 0.75rem 0;
  border: 2px solid
    ${({ selected, isCorrect, showResult }) => {
      if (!showResult) return selected ? "#4299e1" : "transparent";
      if (isCorrect) return "#48BB78";
      return selected ? "#F56565" : "transparent";
    }};
  border-radius: 16px;
  background: ${({ selected, isCorrect, showResult }) => {
    if (!showResult) {
      return selected
        ? "linear-gradient(to right, rgba(66, 153, 225, 0.1), rgba(99, 179, 237, 0.1))"
        : "rgba(255, 255, 255, 0.8)";
    }
    if (isCorrect) {
      return "linear-gradient(to right, rgba(72, 187, 120, 0.1), rgba(104, 211, 145, 0.1))";
    }
    return selected
      ? "linear-gradient(to right, rgba(245, 101, 101, 0.1), rgba(229, 62, 62, 0.1))"
      : "rgba(255, 255, 255, 0.8)";
  }};
  color: ${({ isCorrect, showResult, selected }) => {
    if (!showResult) return "#2d3748";
    if (isCorrect) return "#2F855A";
    return selected ? "#C53030" : "#2d3748";
  }};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  box-shadow: ${({ selected }) =>
    selected
      ? "0 4px 12px rgba(66, 153, 225, 0.2)"
      : "0 2px 6px rgba(0, 0, 0, 0.05)"};
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ selected, isCorrect, showResult }) => {
      if (!showResult) return "linear-gradient(to bottom, #4299e1, #63b3ed)";
      if (isCorrect) return "linear-gradient(to bottom, #48BB78, #68D391)";
      return "linear-gradient(to bottom, #F56565, #E53E3E)";
    }};
    opacity: ${({ selected, isCorrect, showResult }) => {
      if (!showResult) return selected ? "1" : "0";
      return isCorrect ? "1" : selected ? "1" : "0";
    }};
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateX(8px);
    background: rgba(237, 242, 247, 0.9);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (min-width: 768px) {
    padding: 1.25rem;
    font-size: 1.1rem;
  }

  pre {
    margin: 0.5rem 0;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  code {
    font-family: "Fira Code", monospace;
    font-size: 0.9em;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
  gap: 1.5rem;

  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background: linear-gradient(to right, #e2e8f0, #edf2f7);
    color: #2d3748;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(66, 153, 225, 0.1),
        rgba(99, 179, 237, 0.1)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover:not(:disabled) {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);

      &::before {
        opacity: 1;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4299e1, #63b3ed);
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(66, 153, 225, 0.4);

    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 1.25rem 3rem;
    font-size: 1.2rem;
    width: auto;
  }
`;

const ResetButton = styled.button`
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 101, 101, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultContainer = styled.div`
  margin-top: 2.5rem;
  padding: 2rem;
  background: rgba(247, 250, 252, 0.8);
  border-radius: 16px;
  text-align: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4299e1, #63b3ed);
  }

  h3 {
    color: #2b6cb0;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  p {
    color: #2d3748;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(90deg, #4299e1, #63b3ed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  reason?: string;
}

interface TestProps {
  questions: Question[];
  timeLimit: number;
  onComplete: (
    score: number | null,
    selectedAnswers: { [key: number]: string }
  ) => void;
  onReset: () => void;
  onBack: () => void;
  savedState?: {
    score: number | null;
    selectedAnswers: { [key: number]: string };
    isSubmitted: boolean;
  };
}

const renderQuestionWithCode = (text: string) => {
  const parts = text.split(/(```[\s\S]*?```)/);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const [firstLine, ...rest] = part.slice(3, -3).split("\n");
      const language = firstLine.trim() || "javascript";
      const code = rest.join("\n");

      return (
        <pre
          key={index}
          style={{
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "8px",
            fontSize: "0.9em",
            backgroundColor: "#1E1E1E",
            color: "#D4D4D4",
            overflow: "auto",
          }}
        >
          <code>{code.trim()}</code>
        </pre>
      );
    }
    const inlineParts = part.split(/(`[^`]+`)/);
    if (inlineParts.length > 1) {
      return (
        <React.Fragment key={index}>
          {inlineParts.map((inlinePart, i) => {
            if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
              return (
                <code
                  key={i}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.1)",
                    padding: "0.2em 0.4em",
                    borderRadius: "3px",
                  }}
                >
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            return inlinePart;
          })}
        </React.Fragment>
      );
    }
    return part;
  });
};

const Test: React.FC<TestProps> = ({
  questions,
  timeLimit,
  onComplete,
  onReset,
  onBack,
  savedState,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    if (savedState?.isSubmitted) {
      const incorrectQuestionIndex = questions.findIndex(
        (q) => savedState.selectedAnswers[q.id] !== q.correctAnswer
      );
      return incorrectQuestionIndex >= 0 ? incorrectQuestionIndex : 0;
    }
    return 0;
  });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>(savedState?.selectedAnswers || {});
  const [timeLeft, setTimeLeft] = useState(
    savedState?.isSubmitted ? 0 : timeLimit
  );
  const [isSubmitted, setIsSubmitted] = useState(
    savedState?.isSubmitted || false
  );

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: option,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const rawScore = questions.reduce((acc, question) => {
      return (
        acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
    const scoreOutOfTen = (rawScore / questions.length) * 10;
    onComplete(scoreOutOfTen, selectedAnswers);
    setCurrentQuestion(
      questions.findIndex((q) => selectedAnswers[q.id] !== q.correctAnswer)
    );
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(timeLimit);
    setCurrentQuestion(0);
    onReset();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <TestContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#2b6cb0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          ← Back to Tests
        </button>
        <Timer style={{ margin: 0 }}>
          Time Remaining: <span>{formatTime(timeLeft)}</span>
        </Timer>
      </div>
      <QuestionList>
        {questions.map((q, index) => (
          <QuestionDot
            key={q.id}
            active={currentQuestion === index}
            answered={selectedAnswers[q.id] !== undefined}
            isCorrect={selectedAnswers[q.id] === q.correctAnswer}
            showResult={isSubmitted}
            onClick={() => {
              setCurrentQuestion(index);
              if (isSubmitted) {
                document
                  .querySelector(".question-container")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {index + 1}
          </QuestionDot>
        ))}
      </QuestionList>

      <QuestionContainer className="question-container">
        <QuestionText>
          {renderQuestionWithCode(currentQuestionData.question)}
        </QuestionText>
        {currentQuestionData.options.map((option, index) => (
          <div key={index}>
            <OptionButton
              selected={selectedAnswers[currentQuestionData.id] === option}
              onClick={() => handleAnswerSelect(option)}
              disabled={isSubmitted}
              isCorrect={
                isSubmitted && option === currentQuestionData.correctAnswer
              }
              showResult={isSubmitted}
            >
              {renderQuestionWithCode(option)}
              {isSubmitted && option === currentQuestionData.correctAnswer && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#48BB78",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
              )}
            </OptionButton>
          </div>
        ))}
        {isSubmitted && currentQuestionData.reason && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "rgba(72, 187, 120, 0.1)",
              borderRadius: "8px",
              color: "#2F855A",
              fontSize: "0.95rem",
            }}
          >
            {renderQuestionWithCode(currentQuestionData.reason)}
          </div>
        )}
      </QuestionContainer>

      <NavigationButtons>
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0 || isSubmitted}
        >
          Previous
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestion === questions.length - 1 || isSubmitted}
        >
          Next
        </button>
      </NavigationButtons>

      {!isSubmitted && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <SubmitButton onClick={handleSubmit}>Submit Test</SubmitButton>
        </div>
      )}

      {isSubmitted && (
        <ResultContainer>
          <h3>Test Submitted!</h3>
          <p>
            {(
              (questions.reduce(
                (acc, question) =>
                  acc +
                  (selectedAnswers[question.id] === question.correctAnswer
                    ? 1
                    : 0),
                0
              ) /
                questions.length) *
              10
            ).toFixed(1)}
            /10
          </p>
          <ResetButton onClick={handleReset}>Reset Test</ResetButton>
        </ResultContainer>
      )}
    </TestContainer>
  );
};

export default Test;
