import { zValidator } from "@hono/zod-validator";
import { createSecureRoute, createUnsecureRoute } from "../middleware/session-middleware";
import { z } from "zod";
import { prismaClient } from "../../integration/prisma";
import OpenAI from "openai";
import { openaiApiKey, pineconeApiKey } from "../../utils/environment";
import { Pinecone } from "@pinecone-database/pinecone";

// export const postsRoute = createSecureRoute();

// postsRoute.post(
//   "/",
//   zValidator(
//     "json",
//       z.object({
//         title: z.string().min(1, "only non-empty strings are allowed in text"),
//         text: z.string().min(1, "only non-empty strings are allowed in text"),
        
//     })
//   ),
//     async (context) => {
//         const user =context.get("user");
//         const { title,text } = context.req.valid("json");
        
//         const post = await prismaClient.post.create(
//             {
//                 data: {
//                     title,
//                     text,
//                     authorId: user.id,
//                 },
//                 include: {
//                   author: true,
                  
//                 }
//             }
//         );
//         return context.json(post,201);
//   }
// );

export const postsRoute = createSecureRoute();

postsRoute.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1, "only non-empty strings are allowed in title"),
      text: z.string().min(1, "only non-empty strings are allowed in text"),
    })
  ),
  async (context) => {
    const user = context.get("user");
    const { title, text } = context.req.valid("json");

    // 1. Insert to Supabase via Prisma
    const post = await prismaClient.post.create({
      data: {
        title,
        text,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 2. Generate Embedding (OpenAI shown below)
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", // or another supported embedding model
      input: `${title}\n${text}`,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // 3. Upsert to Pinecone
    const pinecone = new Pinecone({ apiKey: pineconeApiKey });
    const index = pinecone.index("platinum").namespace("posts");

    await index.upsert([
      {
        id: post.id,
        values: embedding,
        metadata: {
          title,
          text,
          author: post.author.name ?? "Anonymous",
        },
      },
    ]);

    return context.json(post, 201);
  }
);
