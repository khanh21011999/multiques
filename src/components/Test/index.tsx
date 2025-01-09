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
  const [isAnswerShown, setIsAnswerShown] = useState(false);

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
      setIsAnswerShown(true);
      if (answer === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleShowAnswer = () => {
    setIsAnswerShown(true);
    const correct =
      Array.isArray(currentQuestion.correctAnswer) &&
      currentQuestion.correctAnswer.length === selectedAnswers.length &&
      currentQuestion.correctAnswer.every((answer) =>
        selectedAnswers.includes(answer)
      );
    if (correct) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setIsAnswerShown(false);
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
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswers.includes(answer);
                const isCorrect =
                  isAnswerShown &&
                  (Array.isArray(currentQuestion.correctAnswer)
                    ? currentQuestion.correctAnswer.includes(answer)
                    : answer === currentQuestion.correctAnswer);

                return (
                  <button
                    key={index}
                    className={`answer ${isSelected ? "selected" : ""} ${
                      isAnswerShown
                        ? isCorrect
                          ? "correct"
                          : isSelected
                          ? "incorrect"
                          : ""
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(answer)}
                    disabled={isAnswerShown}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
            {isMultiSelect && !isAnswerShown && (
              <button
                className="submit"
                onClick={handleShowAnswer}
                disabled={selectedAnswers.length === 0}
              >
                Answer
              </button>
            )}
            {isAnswerShown && (
              <button className="submit" onClick={handleNext}>
                Next
              </button>
            )}
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
