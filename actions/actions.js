"use server";

import { createStreamableValue } from "ai/rsc";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const nim = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});

export async function continueConversation(messages) {
  const result = await streamText({
    model: nim("google/gemma-2-9b-it"),
    messages,
    temperature: 0.8,
    topP: 0.7,
    maxTokens: 1024,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
