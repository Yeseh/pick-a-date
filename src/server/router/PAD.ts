import { createRouter } from "./context";
import { z } from "zod";

const partOfDay = z.enum(["morning", "day", "night", "none"])
const dayOfWeek = z.enum([
  "monday", 
  "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
])

export const padRouter = createRouter()
  .query("get", {
    input: z
      .object({
        key: z.string()
      }),

    async resolve({ ctx, input }) {
        const id = ctx.hashId.decode(input.key)[0];

        return await ctx.prisma.pAD.findFirst({ where: {
          id: id as number
        }})
    },
  })

  .query("getWithAnswers", {
    input: z
      .object({
        key: z.string()
      }),

    async resolve({ ctx, input }) {
        const id = ctx.hashId.decode(input.key)[0];

        return await ctx.prisma.pAD.findFirst({ 
          where: {
            id: id as number
          },
          include: {
            answers: true
          }
        } )
    },
  })

  .mutation("create", {
    input: z.object({
      subject: z.string(),
      rootDate: z.date(),
      possibleDayParts: z.array(partOfDay),
      possibleDays: z.array(dayOfWeek),
      minParticipants: z.number(),
      maxParticipants: z.number(),
      optionsAmount: z.number(),
      autoPickWhenMinReached: z.boolean().default(false),
      anonymous: z.boolean().default(false),
    }),

    async resolve({ctx, input}) {
      const pad = await ctx.prisma.pAD.create({data: input});
      const key = ctx.hashId.encode(pad.id)

      return {
        redirect: `/d/${key}`
      }
    }
  })

  .mutation("answer", {
    input: z.object({
      name: z.string().default("Anonymous"),
      key: z.string(),
      answers: z.array(z.object({
        date: z.date(),
        dayParts: z.array(partOfDay)
      })) 
    }),

    async resolve({ctx, input}) {
      const answers: any[] = []
      const padId = ctx.hashId.decode(input.key)[0]
      // Unix date hash in combination with pad key should be unique enough :)
      const now = new Date();
      const submissionKey = ctx.hashId.encode(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), now.getMilliseconds()).concat()

      for (const answer of input.answers) {
        answers.push({
          padId,
          submissionKey,
          name: input.name,
          date: answer.date,
          dayParts: answer.dayParts
        })
      }

      await ctx.prisma.answer.createMany({ data: answers })

      return {
        redirect: `/a/${input.key}`
      }
    }
  })
