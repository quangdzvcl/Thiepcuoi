import { z } from 'zod';
export const rsvpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9\s().-]{9,20}$/),
  side: z.enum(['groom', 'bride']), attendance: z.enum(['yes', 'no', 'maybe']),
  guests: z.number().int().min(0).max(10), wishes: z.string().trim().max(1500),
  website: z.string().max(0),
  publish_wish: z.boolean().default(false),
  submission_id: z.string().uuid().optional(),
}).superRefine((data, ctx) => { if (data.attendance !== 'no' && data.guests < 1) ctx.addIssue({ code: 'custom', path: ['guests'], message: 'Cần ít nhất một khách.' }); });
