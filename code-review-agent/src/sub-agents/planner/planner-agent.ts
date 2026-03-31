import { tool, ToolLoopAgent } from "ai";
import { instructions } from "./instructions";
import { checkIfAllTodosAreCompletedTool, createAllTodosTool, createTodoTool, getNextPendingTodoTool, updateTodoStatusTool } from "../../tools/planner/todo-actions";
import z from "zod";
import { selectModel } from "../../utils/select-model";


const { chatModel } = await selectModel();


const plannerSubagent = new ToolLoopAgent({
    model: chatModel,
    instructions,
    tools: {
        createTodoTool,
        createAllTodosTool,
        updateTodoStatusTool,
        getNextPendingTodoTool,
        checkIfAllTodosAreCompletedTool,
    }
})

export const plannerSubagentTool = tool({
    description: "generate detailed plan for what user wants and generate atomic todos follwoing the provided schema",
    inputSchema: z.object({
        userQuery: z.string().describe("user query that explains what user wants")
    }),
    execute: async ({ userQuery }, { abortSignal }) => {
        const result = await plannerSubagent.stream({
            prompt: userQuery,
            abortSignal,
        })
       return result.textStream
      },
})

