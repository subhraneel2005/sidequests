import z from "zod";

export const WriteFileSchema = z.object({
    folder: z
        .string()
        .optional()
        .describe("Optional folder path (relative to project root) where the file should be created."),

    filename: z
        .string()
        .describe("Name of the file to create including extension (e.g. index.ts, config.json)."),

    fileContent: z
        .string()
        .describe("Full content that should be written into the file. This will overwrite the file if it already exists."),
})

export const ReadFileSchema = z.object({
    folder: z
        .string()
        .optional()
        .describe("Optional folder path (relative to the project root) where the file is located."),

    filename: z
        .string()
        .describe("Name of the file to read including extension (e.g. index.ts, package.json)."),
})

export const ReadFileResultSchema = z.union([
    z.object({
        success: z.literal(true),
        fileContent: z
            .string()
            .describe("Full textual content of the requested file."),
    }),
    z.object({
        success: z.literal(false),
        error: z.string()
    })
])

export type WriteFileProps = z.infer<typeof WriteFileSchema>
export type ReadFileProps = z.infer<typeof ReadFileSchema>
export type ReadFileResults = z.infer<typeof ReadFileResultSchema>