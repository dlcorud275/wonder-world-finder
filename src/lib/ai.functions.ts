import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output } from "ai";
import { CONTENT, STAGES } from "./content-data";

const InputSchema = z.object({
  stage: z.enum(["infant", "toddler", "early", "middle"]),
  interests: z.string().min(1).max(500),
});

export const recommendFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI 키가 설정되지 않았어요.");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": apiKey },
    });

    const stageInfo = STAGES.find((s) => s.id === data.stage)!;
    const candidates = CONTENT.filter((c) => c.stage === data.stage);
    const catalog = candidates
      .map(
        (c) =>
          `- ${c.id} | ${c.kind === "book" ? "책" : "영상"} | ${c.title} (${c.creator}) — ${c.summary} [tags: ${c.tags.join(", ")}]`,
      )
      .join("\n");

    const prompt = `당신은 아동 발달 전문 큐레이터입니다.\n\n대상 단계: ${stageInfo.label} (${stageInfo.ages}) — ${stageInfo.desc}\n부모의 요청: "${data.interests}"\n\n다음 후보 중 가장 적합한 2~4개를 골라 id 배열로 반환하고, 부모에게 따뜻하게 추천 이유를 한국어 2~3문장으로 설명하세요.\n\n후보:\n${catalog}`;

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        experimental_output: Output.object({
          schema: z.object({
            ids: z.array(z.string()).min(1).max(4),
            reason: z.string(),
          }),
        }),
      });
      const validIds = experimental_output.ids.filter((id) =>
        candidates.some((c) => c.id === id),
      );
      return { ids: validIds, reason: experimental_output.reason };
    } catch (e: any) {
      if (e?.statusCode === 429)
        throw new Error("요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
      if (e?.statusCode === 402)
        throw new Error("AI 사용량이 모두 소진되었어요. 워크스페이스에 크레딧을 추가해주세요.");
      throw new Error("AI 추천을 받지 못했어요.");
    }
  });