import { Id } from '@draught/utils';
import * as z from 'zod';

export const IdSchema: (prefix?: string) => z.Schema<Id> = prefix =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  prefix
    ? z.string().refine(id => id.startsWith(prefix + '_'))
    : (z.string() as any);

export const DateSchema = z
  .string()
  .regex(
    /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i
  );

export const BaseSchema = z.object({
  _id: IdSchema(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type Base = z.infer<typeof BaseSchema>;
