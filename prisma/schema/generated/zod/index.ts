import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const PartnerSchoolScalarFieldEnumSchema = z.enum(['id','short_name','full_name','plan']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const PartnerPlanSchema = z.enum(['Personal','GroupA','GroupB','Combined']);

export type PartnerPlanType = `${z.infer<typeof PartnerPlanSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PARTNER SCHOOL SCHEMA
/////////////////////////////////////////

export const PartnerSchoolSchema = z.object({
  plan: PartnerPlanSchema,
  id: z.number().int(),
  short_name: z.string(),
  full_name: z.string(),
})

export type PartnerSchool = z.infer<typeof PartnerSchoolSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// PARTNER SCHOOL
//------------------------------------------------------

export const PartnerSchoolSelectSchema: z.ZodType<Prisma.PartnerSchoolSelect> = z.object({
  id: z.boolean().optional(),
  short_name: z.boolean().optional(),
  full_name: z.boolean().optional(),
  plan: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const PartnerSchoolWhereInputSchema: z.ZodType<Prisma.PartnerSchoolWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  short_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  full_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  plan: z.union([ z.lazy(() => EnumPartnerPlanFilterSchema),z.lazy(() => PartnerPlanSchema) ]).optional(),
}).strict();

export const PartnerSchoolOrderByWithRelationInputSchema: z.ZodType<Prisma.PartnerSchoolOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolWhereUniqueInputSchema: z.ZodType<Prisma.PartnerSchoolWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  short_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  full_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  plan: z.union([ z.lazy(() => EnumPartnerPlanFilterSchema),z.lazy(() => PartnerPlanSchema) ]).optional(),
}).strict());

export const PartnerSchoolOrderByWithAggregationInputSchema: z.ZodType<Prisma.PartnerSchoolOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PartnerSchoolCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PartnerSchoolAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PartnerSchoolMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PartnerSchoolMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PartnerSchoolSumOrderByAggregateInputSchema).optional()
}).strict();

export const PartnerSchoolScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PartnerSchoolScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PartnerSchoolScalarWhereWithAggregatesInputSchema),z.lazy(() => PartnerSchoolScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolScalarWhereWithAggregatesInputSchema),z.lazy(() => PartnerSchoolScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  short_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  full_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  plan: z.union([ z.lazy(() => EnumPartnerPlanWithAggregatesFilterSchema),z.lazy(() => PartnerPlanSchema) ]).optional(),
}).strict();

export const PartnerSchoolCreateInputSchema: z.ZodType<Prisma.PartnerSchoolCreateInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema)
}).strict();

export const PartnerSchoolUncheckedCreateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema)
}).strict();

export const PartnerSchoolUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolUncheckedUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolCreateManyInputSchema: z.ZodType<Prisma.PartnerSchoolCreateManyInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema)
}).strict();

export const PartnerSchoolUpdateManyMutationInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateManyMutationInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumPartnerPlanFilterSchema: z.ZodType<Prisma.EnumPartnerPlanFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanFilterSchema) ]).optional(),
}).strict();

export const PartnerSchoolCountOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolMinOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolSumOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const EnumPartnerPlanWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPartnerPlanWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const EnumPartnerPlanFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPartnerPlanFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PartnerPlanSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPartnerPlanFilterSchema: z.ZodType<Prisma.NestedEnumPartnerPlanFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedEnumPartnerPlanWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPartnerPlanWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional()
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const PartnerSchoolFindFirstArgsSchema: z.ZodType<Prisma.PartnerSchoolFindFirstArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PartnerSchoolScalarFieldEnumSchema,PartnerSchoolScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PartnerSchoolFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PartnerSchoolFindFirstOrThrowArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PartnerSchoolScalarFieldEnumSchema,PartnerSchoolScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PartnerSchoolFindManyArgsSchema: z.ZodType<Prisma.PartnerSchoolFindManyArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PartnerSchoolScalarFieldEnumSchema,PartnerSchoolScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PartnerSchoolAggregateArgsSchema: z.ZodType<Prisma.PartnerSchoolAggregateArgs> = z.object({
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PartnerSchoolGroupByArgsSchema: z.ZodType<Prisma.PartnerSchoolGroupByArgs> = z.object({
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithAggregationInputSchema.array(),PartnerSchoolOrderByWithAggregationInputSchema ]).optional(),
  by: PartnerSchoolScalarFieldEnumSchema.array(),
  having: PartnerSchoolScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PartnerSchoolFindUniqueArgsSchema: z.ZodType<Prisma.PartnerSchoolFindUniqueArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PartnerSchoolFindUniqueOrThrowArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolCreateArgsSchema: z.ZodType<Prisma.PartnerSchoolCreateArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  data: z.union([ PartnerSchoolCreateInputSchema,PartnerSchoolUncheckedCreateInputSchema ]),
}).strict() ;

export const PartnerSchoolUpsertArgsSchema: z.ZodType<Prisma.PartnerSchoolUpsertArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
  create: z.union([ PartnerSchoolCreateInputSchema,PartnerSchoolUncheckedCreateInputSchema ]),
  update: z.union([ PartnerSchoolUpdateInputSchema,PartnerSchoolUncheckedUpdateInputSchema ]),
}).strict() ;

export const PartnerSchoolCreateManyArgsSchema: z.ZodType<Prisma.PartnerSchoolCreateManyArgs> = z.object({
  data: z.union([ PartnerSchoolCreateManyInputSchema,PartnerSchoolCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PartnerSchoolCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PartnerSchoolCreateManyAndReturnArgs> = z.object({
  data: z.union([ PartnerSchoolCreateManyInputSchema,PartnerSchoolCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PartnerSchoolDeleteArgsSchema: z.ZodType<Prisma.PartnerSchoolDeleteArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolUpdateArgsSchema: z.ZodType<Prisma.PartnerSchoolUpdateArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  data: z.union([ PartnerSchoolUpdateInputSchema,PartnerSchoolUncheckedUpdateInputSchema ]),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolUpdateManyArgsSchema: z.ZodType<Prisma.PartnerSchoolUpdateManyArgs> = z.object({
  data: z.union([ PartnerSchoolUpdateManyMutationInputSchema,PartnerSchoolUncheckedUpdateManyInputSchema ]),
  where: PartnerSchoolWhereInputSchema.optional(),
}).strict() ;

export const PartnerSchoolDeleteManyArgsSchema: z.ZodType<Prisma.PartnerSchoolDeleteManyArgs> = z.object({
  where: PartnerSchoolWhereInputSchema.optional(),
}).strict() ;