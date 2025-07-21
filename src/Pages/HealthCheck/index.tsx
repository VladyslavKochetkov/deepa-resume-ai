import { Spinner, StatusMessage } from "@inkjs/ui";
import { generateText } from "ai";
import { Box, Text, useInput } from "ink";
import { gemini } from "../../providers/google";
import { useEffect, useState } from "react";
import { applicationExplanation } from "../../prompts/applicationExplanation";
import { useNavigate } from "react-router";

type HealthCheckStatus =
  | ["attempting", null]
  | ["failed", string]
  | ["passed", string];

const useGeminiConnected = () => {
  const [isConnected, setIsConnected] = useState<HealthCheckStatus>([
    "attempting",
    null,
  ]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await generateText({
          model: gemini,
          maxTokens: 500,
          system: applicationExplanation,
          temperature: 1,
          prompt: `Seed: ${Math.round(
            Math.random() * 1000000
          )}. Generate a short cheerful message greeting the user to another job application. Keep your statements neutral regarding whether or not the user has used this application in the past, avoid words like again or first. Keep it concise and friendly and positive. Only respond with the message, no other text.`,
        });
        setIsConnected(["passed", result.text]);
      } catch (error) {
        console.error(error);
        setIsConnected([
          "failed",
          error instanceof Error ? error.message : "Unknown error",
        ]);
      }
    };
    checkConnection();
  }, []);

  return isConnected;
};

export const HealthCheck = () => {
  const navigate = useNavigate();
  const geminiStatus = useGeminiConnected();

  const [allSuccessful, setAllSuccessful] = useState(false);
  useEffect(() => {
    setAllSuccessful(geminiStatus[0] === "passed");
  }, [geminiStatus]);

  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    if (allSuccessful) {
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [allSuccessful]);

  useEffect(() => {
    if (countDown === 0) {
      navigate("/landing");
    }
  }, [countDown, navigate]);

  useInput((_, keys) => {
    if (allSuccessful && keys.return) {
      navigate("/landing");
    }
  });

  return (
    <Box flexDirection="column">
      <Text>Performing Health Check...</Text>
      <Box flexDirection="column">
        <Box gap={1}>
          <Text>Gemini Connection</Text>
          {geminiStatus[0] === "attempting" ? (
            <Spinner />
          ) : (
            <StatusMessage
              variant={geminiStatus[0] === "failed" ? "error" : "success"}
            >
              {geminiStatus[1]}
            </StatusMessage>
          )}
        </Box>
        {allSuccessful && (
          <Text>
            Giving you {countDown} seconds to enjoy the cheerful message, or
            press <Text bold>Enter</Text> to continue.
          </Text>
        )}
      </Box>
    </Box>
  );
};
