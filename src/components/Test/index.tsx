import React, { useState } from "react";

interface TestProps {
  questions: {
    question: string;
    answers: string[];
    correctAnswer: string | string[];
  }[];
  onComplete: (score: number) => void;
}

const Test: React.FC<TestProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isMultiSelect = Array.isArray(currentQuestion.correctAnswer);

  const handleAnswerSelect = (answer: string) => {
    if (isMultiSelect) {
      setSelectedAnswers((prev) => {
        if (prev.includes(answer)) {
          return prev.filter((a) => a !== answer);
        }
        return [...prev, answer];
      });
    } else {
      setSelectedAnswers([answer]);
    }
  };

  const handleSubmit = () => {
    if (isMultiSelect) {
      const correct =
        currentQuestion.correctAnswer.length === selectedAnswers.length &&
        currentQuestion.correctAnswer.every((answer) =>
          selectedAnswers.includes(answer)
        );
      if (correct) setScore((prev) => prev + 1);
    } else {
      if (selectedAnswers[0] === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
    } else {
      setShowResults(true);
      onComplete(score);
    }
  };

  return (
    <div className="test-container">
      {!showResults ? (
        <>
          <div className="question">
            <h2>{currentQuestion.question}</h2>
            <div className="answers">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer ${
                    selectedAnswers.includes(answer) ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
            <button
              className="submit"
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0}
            >
              Submit
            </button>
          </div>
          <div className="progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </>
      ) : (
        <div className="results">
          <h2>Test Complete!</h2>
          <p>
            Your score: {score} out of {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Test;
