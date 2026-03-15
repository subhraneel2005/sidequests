import type { StopCondition } from "ai";
import type { tools } from "../tools-registry";

// custom stopping condition:
const hasReviewComment: StopCondition<typeof tools> = ({ steps }) => {
    return steps.some(step => step.text?.includes('REVIEW') || step.text?.includes('COMMENT') || step.text.includes('ANSWER')) ?? false;
}


const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {
    const totalUsage = steps.reduce(
        (acc, step) => ({
            inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
            outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
        }),
        { inputTokens: 0, outputTokens: 0 },
    );

    const costEstimate =
        (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;
    return costEstimate > 0.5; // Stop if cost exceeds $0.50
};

export { hasReviewComment, budgetExceeded }