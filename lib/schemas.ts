import { z } from "zod";

export const eventTypes = [
  "Wedding",
  "Reception",
  "Engagement Function",
  "Other Event",
] as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
  .or(z.literal(""))
  .optional();

export const enquirySchema = z
  .object({
    eventType: z.string().min(1, "Please select an event type"),
    guests: z
      .string()
      .trim()
      .min(1, "Please enter the number of guests")
      .refine(
        (v) => /^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 100000,
        "Please enter a valid number of guests"
      ),
    eventStart: isoDate,
    eventEnd: isoDate,
    firstName: z.string().trim().min(2, "Please enter your first name").max(60),
    lastName: z.string().trim().max(60).optional(),
    phone: z
      .string()
      .trim()
      .refine(
        (v) => /^\+?\d{10,13}$/.test(v.replace(/[\s-]/g, "")),
        "Please enter a valid phone number"
      ),
    email: z.string().trim().email("Please enter a valid email address").max(120),
    location: z.string().trim().min(2, "Please enter the city or venue").max(200),
    message: z.string().trim().max(2000).optional(),
    website: z.string().optional(), // honeypot
  })
  .refine((d) => !d.eventStart || !d.eventEnd || d.eventEnd >= d.eventStart, {
    message: "End date cannot be before the start date",
    path: ["eventEnd"],
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60),
  eventType: z.string().min(1, "Please select an event type"),
  rating: z.number().int().min(1, "Please choose a star rating").max(5),
  text: z
    .string()
    .trim()
    .min(10, "Please write a few words about your experience")
    .max(1500),
  website: z.string().optional(), // honeypot
});

export type ReviewInput = z.infer<typeof reviewSchema>;