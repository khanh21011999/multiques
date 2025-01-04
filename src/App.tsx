import React, { useState } from "react";
import Test from "./components/Test";
import testsData from "./tests.json";
import styled from "styled-components";

const AppContainer = styled.div`
  padding: 3rem 2rem;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 0%,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    pointer-events: none;
  }
`;

const PageTitle = styled.h1`
  color: #2b6cb0;
  margin-bottom: 3rem;
  font-size: 3rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #4299e1, #63b3ed);
    margin: 1rem auto 0;
    border-radius: 2px;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 2rem;
  }
`;

const TestList = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TestCard = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(8px);
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
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(31, 38, 135, 0.2);
    border-color: rgba(255, 255, 255, 0.4);

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const TestTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const TestDescription = styled.p`
  color: #4a5568;
  font-size: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #4299e1;
    border-radius: 50%;
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const App: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<{
    [testId: number]: {
      score: number | null;
      selectedAnswers: { [questionId: number]: string | string[] };
      isSubmitted: boolean;
    };
  }>({});

  const handleTestSelect = (testId: number) => {
    setSelectedTest(testId);
  };

  const handleTestComplete = (
    testId: number,
    score: number | null,
    selectedAnswers: { [questionId: number]: string | string[] }
  ) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        score,
        selectedAnswers,
        isSubmitted: true,
      },
    }));
  };

  const handleTestReset = (testId: number) => {
    setTestResults((prev) => {
      const newResults = { ...prev };
      delete newResults[testId];
      return newResults;
    });
  };

  return (
    <AppContainer>
      {selectedTest === null ? (
        <>
          <PageTitle>Available Tests</PageTitle>
          <TestList>
            {testsData.tests.map((test) => (
              <TestCard key={test.id} onClick={() => handleTestSelect(test.id)}>
                <TestTitle>{test.title}</TestTitle>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <TestDescription>
                    {test.questions.length} questions
                  </TestDescription>
                  {testResults[test.id]?.isSubmitted && (
                    <TestDescription style={{ color: "#2F855A" }}>
                      Last score: {testResults[test.id].score?.toFixed(1)}/10
                    </TestDescription>
                  )}
                </div>
              </TestCard>
            ))}
          </TestList>
        </>
      ) : (
        <Test
          questions={
            testsData.tests.find((test) => test.id === selectedTest)!
              .questions as any
          }
          timeLimit={
            testsData.tests.find((test) => test.id === selectedTest)!.timeLimit
          }
          onComplete={(score, answers) =>
            handleTestComplete(selectedTest, score, answers)
          }
          onReset={() => handleTestReset(selectedTest)}
          savedState={testResults[selectedTest]}
          onBack={() => setSelectedTest(null)}
        />
      )}
    </AppContainer>
  );
};

export default App;
