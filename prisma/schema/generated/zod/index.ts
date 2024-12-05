import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const SchoolAccountConfigScalarFieldEnumSchema = z.enum(['username_format','domain_name','school_id']);

export const StudentMemberScalarFieldEnumSchema = z.enum(['id','school_attended_id','email','student_id','nickname','purchase_channel','has_stickers','auth_providers','created_at','activated_at','password_hash']);

export const PersonalMembershipOrderScalarFieldEnumSchema = z.enum(['id','member_id','school_id','class','number','real_name','need_sticker','is_paid']);

export const PartnerSchoolScalarFieldEnumSchema = z.enum(['id','short_name','full_name','plan']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const AuthenticationProviderSchema = z.enum(['Password','Google']);

export type AuthenticationProviderType = `${z.infer<typeof AuthenticationProviderSchema>}`

export const MembershipPurchaseChannelSchema = z.enum(['Personal','StudentCouncil']);

export type MembershipPurchaseChannelType = `${z.infer<typeof MembershipPurchaseChannelSchema>}`

export const PartnerPlanSchema = z.enum(['Personal','GroupA','GroupB','Combined']);

export type PartnerPlanType = `${z.infer<typeof PartnerPlanSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// SCHOOL ACCOUNT CONFIG SCHEMA
/////////////////////////////////////////

export const SchoolAccountConfigSchema = z.object({
  username_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int(),
})

export type SchoolAccountConfig = z.infer<typeof SchoolAccountConfigSchema>

/////////////////////////////////////////
// STUDENT MEMBER SCHEMA
/////////////////////////////////////////

export const StudentMemberSchema = z.object({
  purchase_channel: MembershipPurchaseChannelSchema,
  auth_providers: AuthenticationProviderSchema.array(),
  id: z.string().cuid(),
  school_attended_id: z.number().int(),
  email: z.string().nullable(),
  student_id: z.string().nullable(),
  nickname: z.string().nullable(),
  has_stickers: z.boolean(),
  created_at: z.coerce.date(),
  activated_at: z.coerce.date().nullable(),
  password_hash: z.string().nullable(),
})

export type StudentMember = z.infer<typeof StudentMemberSchema>

/////////////////////////////////////////
// PERSONAL MEMBERSHIP ORDER SCHEMA
/////////////////////////////////////////

export const PersonalMembershipOrderSchema = z.object({
  id: z.number().int(),
  member_id: z.string().nullable(),
  school_id: z.number().int(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean(),
})

export type PersonalMembershipOrder = z.infer<typeof PersonalMembershipOrderSchema>

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

// SCHOOL ACCOUNT CONFIG
//------------------------------------------------------

export const SchoolAccountConfigIncludeSchema: z.ZodType<Prisma.SchoolAccountConfigInclude> = z.object({
  school: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
}).strict()

export const SchoolAccountConfigArgsSchema: z.ZodType<Prisma.SchoolAccountConfigDefaultArgs> = z.object({
  select: z.lazy(() => SchoolAccountConfigSelectSchema).optional(),
  include: z.lazy(() => SchoolAccountConfigIncludeSchema).optional(),
}).strict();

export const SchoolAccountConfigSelectSchema: z.ZodType<Prisma.SchoolAccountConfigSelect> = z.object({
  username_format: z.boolean().optional(),
  domain_name: z.boolean().optional(),
  school_id: z.boolean().optional(),
  school: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
}).strict()

// STUDENT MEMBER
//------------------------------------------------------

export const StudentMemberIncludeSchema: z.ZodType<Prisma.StudentMemberInclude> = z.object({
  school_attended: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
  membership_order: z.union([z.boolean(),z.lazy(() => PersonalMembershipOrderArgsSchema)]).optional(),
}).strict()

export const StudentMemberArgsSchema: z.ZodType<Prisma.StudentMemberDefaultArgs> = z.object({
  select: z.lazy(() => StudentMemberSelectSchema).optional(),
  include: z.lazy(() => StudentMemberIncludeSchema).optional(),
}).strict();

export const StudentMemberSelectSchema: z.ZodType<Prisma.StudentMemberSelect> = z.object({
  id: z.boolean().optional(),
  school_attended_id: z.boolean().optional(),
  email: z.boolean().optional(),
  student_id: z.boolean().optional(),
  nickname: z.boolean().optional(),
  purchase_channel: z.boolean().optional(),
  has_stickers: z.boolean().optional(),
  auth_providers: z.boolean().optional(),
  created_at: z.boolean().optional(),
  activated_at: z.boolean().optional(),
  password_hash: z.boolean().optional(),
  school_attended: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
  membership_order: z.union([z.boolean(),z.lazy(() => PersonalMembershipOrderArgsSchema)]).optional(),
}).strict()

// PERSONAL MEMBERSHIP ORDER
//------------------------------------------------------

export const PersonalMembershipOrderIncludeSchema: z.ZodType<Prisma.PersonalMembershipOrderInclude> = z.object({
  member: z.union([z.boolean(),z.lazy(() => StudentMemberArgsSchema)]).optional(),
  school: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
}).strict()

export const PersonalMembershipOrderArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderDefaultArgs> = z.object({
  select: z.lazy(() => PersonalMembershipOrderSelectSchema).optional(),
  include: z.lazy(() => PersonalMembershipOrderIncludeSchema).optional(),
}).strict();

export const PersonalMembershipOrderSelectSchema: z.ZodType<Prisma.PersonalMembershipOrderSelect> = z.object({
  id: z.boolean().optional(),
  member_id: z.boolean().optional(),
  school_id: z.boolean().optional(),
  class: z.boolean().optional(),
  number: z.boolean().optional(),
  real_name: z.boolean().optional(),
  need_sticker: z.boolean().optional(),
  is_paid: z.boolean().optional(),
  member: z.union([z.boolean(),z.lazy(() => StudentMemberArgsSchema)]).optional(),
  school: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
}).strict()

// PARTNER SCHOOL
//------------------------------------------------------

export const PartnerSchoolIncludeSchema: z.ZodType<Prisma.PartnerSchoolInclude> = z.object({
  google_account_config: z.union([z.boolean(),z.lazy(() => SchoolAccountConfigArgsSchema)]).optional(),
  students: z.union([z.boolean(),z.lazy(() => StudentMemberFindManyArgsSchema)]).optional(),
  personal_orders: z.union([z.boolean(),z.lazy(() => PersonalMembershipOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PartnerSchoolCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PartnerSchoolArgsSchema: z.ZodType<Prisma.PartnerSchoolDefaultArgs> = z.object({
  select: z.lazy(() => PartnerSchoolSelectSchema).optional(),
  include: z.lazy(() => PartnerSchoolIncludeSchema).optional(),
}).strict();

export const PartnerSchoolCountOutputTypeArgsSchema: z.ZodType<Prisma.PartnerSchoolCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PartnerSchoolCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PartnerSchoolCountOutputTypeSelectSchema: z.ZodType<Prisma.PartnerSchoolCountOutputTypeSelect> = z.object({
  students: z.boolean().optional(),
  personal_orders: z.boolean().optional(),
}).strict();

export const PartnerSchoolSelectSchema: z.ZodType<Prisma.PartnerSchoolSelect> = z.object({
  id: z.boolean().optional(),
  short_name: z.boolean().optional(),
  full_name: z.boolean().optional(),
  plan: z.boolean().optional(),
  google_account_config: z.union([z.boolean(),z.lazy(() => SchoolAccountConfigArgsSchema)]).optional(),
  students: z.union([z.boolean(),z.lazy(() => StudentMemberFindManyArgsSchema)]).optional(),
  personal_orders: z.union([z.boolean(),z.lazy(() => PersonalMembershipOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PartnerSchoolCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const SchoolAccountConfigWhereInputSchema: z.ZodType<Prisma.SchoolAccountConfigWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SchoolAccountConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  username_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigOrderByWithRelationInputSchema: z.ZodType<Prisma.SchoolAccountConfigOrderByWithRelationInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  school: z.lazy(() => PartnerSchoolOrderByWithRelationInputSchema).optional()
}).strict();

export const SchoolAccountConfigWhereUniqueInputSchema: z.ZodType<Prisma.SchoolAccountConfigWhereUniqueInput> = z.object({
  school_id: z.number().int()
})
.and(z.object({
  school_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SchoolAccountConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  username_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict());

export const SchoolAccountConfigOrderByWithAggregationInputSchema: z.ZodType<Prisma.SchoolAccountConfigOrderByWithAggregationInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SchoolAccountConfigCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SchoolAccountConfigAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SchoolAccountConfigMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SchoolAccountConfigMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SchoolAccountConfigSumOrderByAggregateInputSchema).optional()
}).strict();

export const SchoolAccountConfigScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SchoolAccountConfigScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SchoolAccountConfigScalarWhereWithAggregatesInputSchema),z.lazy(() => SchoolAccountConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SchoolAccountConfigScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SchoolAccountConfigScalarWhereWithAggregatesInputSchema),z.lazy(() => SchoolAccountConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  username_format: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  school_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const StudentMemberWhereInputSchema: z.ZodType<Prisma.StudentMemberWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  student_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => EnumMembershipPurchaseChannelFilterSchema),z.lazy(() => MembershipPurchaseChannelSchema) ]).optional(),
  has_stickers: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  auth_providers: z.lazy(() => EnumAuthenticationProviderNullableListFilterSchema).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  school_attended: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
  membership_order: z.union([ z.lazy(() => PersonalMembershipOrderNullableScalarRelationFilterSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional().nullable(),
}).strict();

export const StudentMemberOrderByWithRelationInputSchema: z.ZodType<Prisma.StudentMemberOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  student_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  nickname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  purchase_channel: z.lazy(() => SortOrderSchema).optional(),
  has_stickers: z.lazy(() => SortOrderSchema).optional(),
  auth_providers: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  school_attended: z.lazy(() => PartnerSchoolOrderByWithRelationInputSchema).optional(),
  membership_order: z.lazy(() => PersonalMembershipOrderOrderByWithRelationInputSchema).optional()
}).strict();

export const StudentMemberWhereUniqueInputSchema: z.ZodType<Prisma.StudentMemberWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  student_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => EnumMembershipPurchaseChannelFilterSchema),z.lazy(() => MembershipPurchaseChannelSchema) ]).optional(),
  has_stickers: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  auth_providers: z.lazy(() => EnumAuthenticationProviderNullableListFilterSchema).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  school_attended: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
  membership_order: z.union([ z.lazy(() => PersonalMembershipOrderNullableScalarRelationFilterSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional().nullable(),
}).strict());

export const StudentMemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.StudentMemberOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  student_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  nickname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  purchase_channel: z.lazy(() => SortOrderSchema).optional(),
  has_stickers: z.lazy(() => SortOrderSchema).optional(),
  auth_providers: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => StudentMemberCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => StudentMemberAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => StudentMemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => StudentMemberMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => StudentMemberSumOrderByAggregateInputSchema).optional()
}).strict();

export const StudentMemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.StudentMemberScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => StudentMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => StudentMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => StudentMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  student_id: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  nickname: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => EnumMembershipPurchaseChannelWithAggregatesFilterSchema),z.lazy(() => MembershipPurchaseChannelSchema) ]).optional(),
  has_stickers: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  auth_providers: z.lazy(() => EnumAuthenticationProviderNullableListFilterSchema).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const PersonalMembershipOrderWhereInputSchema: z.ZodType<Prisma.PersonalMembershipOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PersonalMembershipOrderWhereInputSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonalMembershipOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonalMembershipOrderWhereInputSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  member_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  school_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  class: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  real_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  need_sticker: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  is_paid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  member: z.union([ z.lazy(() => StudentMemberNullableScalarRelationFilterSchema),z.lazy(() => StudentMemberWhereInputSchema) ]).optional().nullable(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.PersonalMembershipOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  member_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  class: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  real_name: z.lazy(() => SortOrderSchema).optional(),
  need_sticker: z.lazy(() => SortOrderSchema).optional(),
  is_paid: z.lazy(() => SortOrderSchema).optional(),
  member: z.lazy(() => StudentMemberOrderByWithRelationInputSchema).optional(),
  school: z.lazy(() => PartnerSchoolOrderByWithRelationInputSchema).optional()
}).strict();

export const PersonalMembershipOrderWhereUniqueInputSchema: z.ZodType<Prisma.PersonalMembershipOrderWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    member_id: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    member_id: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  member_id: z.string().optional(),
  AND: z.union([ z.lazy(() => PersonalMembershipOrderWhereInputSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonalMembershipOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonalMembershipOrderWhereInputSchema),z.lazy(() => PersonalMembershipOrderWhereInputSchema).array() ]).optional(),
  school_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  class: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  real_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  need_sticker: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  is_paid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  member: z.union([ z.lazy(() => StudentMemberNullableScalarRelationFilterSchema),z.lazy(() => StudentMemberWhereInputSchema) ]).optional().nullable(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict());

export const PersonalMembershipOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.PersonalMembershipOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  member_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  class: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  real_name: z.lazy(() => SortOrderSchema).optional(),
  need_sticker: z.lazy(() => SortOrderSchema).optional(),
  is_paid: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PersonalMembershipOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PersonalMembershipOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PersonalMembershipOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PersonalMembershipOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PersonalMembershipOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const PersonalMembershipOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PersonalMembershipOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonalMembershipOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  member_id: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  school_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  class: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  real_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  need_sticker: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  is_paid: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const PartnerSchoolWhereInputSchema: z.ZodType<Prisma.PartnerSchoolWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  short_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  full_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  plan: z.union([ z.lazy(() => EnumPartnerPlanFilterSchema),z.lazy(() => PartnerPlanSchema) ]).optional(),
  google_account_config: z.union([ z.lazy(() => SchoolAccountConfigNullableScalarRelationFilterSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional().nullable(),
  students: z.lazy(() => StudentMemberListRelationFilterSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderListRelationFilterSchema).optional()
}).strict();

export const PartnerSchoolOrderByWithRelationInputSchema: z.ZodType<Prisma.PartnerSchoolOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigOrderByWithRelationInputSchema).optional(),
  students: z.lazy(() => StudentMemberOrderByRelationAggregateInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderOrderByRelationAggregateInputSchema).optional()
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
  google_account_config: z.union([ z.lazy(() => SchoolAccountConfigNullableScalarRelationFilterSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional().nullable(),
  students: z.lazy(() => StudentMemberListRelationFilterSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderListRelationFilterSchema).optional()
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

export const SchoolAccountConfigCreateInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateInput> = z.object({
  username_format: z.string(),
  domain_name: z.string(),
  school: z.lazy(() => PartnerSchoolCreateNestedOneWithoutGoogle_account_configInputSchema)
}).strict();

export const SchoolAccountConfigUncheckedCreateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedCreateInput> = z.object({
  username_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int()
}).strict();

export const SchoolAccountConfigUpdateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInputSchema).optional()
}).strict();

export const SchoolAccountConfigUncheckedUpdateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigCreateManyInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateManyInput> = z.object({
  username_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int()
}).strict();

export const SchoolAccountConfigUpdateManyMutationInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateManyMutationInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateManyInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StudentMemberCreateInputSchema: z.ZodType<Prisma.StudentMemberCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolCreateNestedOneWithoutStudentsInputSchema),
  membership_order: z.lazy(() => PersonalMembershipOrderCreateNestedOneWithoutMemberInputSchema).optional()
}).strict();

export const StudentMemberUncheckedCreateInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderUncheckedCreateNestedOneWithoutMemberInputSchema).optional()
}).strict();

export const StudentMemberUpdateInputSchema: z.ZodType<Prisma.StudentMemberUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInputSchema).optional(),
  membership_order: z.lazy(() => PersonalMembershipOrderUpdateOneWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderUncheckedUpdateOneWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberCreateManyInputSchema: z.ZodType<Prisma.StudentMemberCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable()
}).strict();

export const StudentMemberUpdateManyMutationInputSchema: z.ZodType<Prisma.StudentMemberUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StudentMemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PersonalMembershipOrderCreateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateInput> = z.object({
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean(),
  member: z.lazy(() => StudentMemberCreateNestedOneWithoutMembership_orderInputSchema).optional(),
  school: z.lazy(() => PartnerSchoolCreateNestedOneWithoutPersonal_ordersInputSchema)
}).strict();

export const PersonalMembershipOrderUncheckedCreateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  member_id: z.string().optional().nullable(),
  school_id: z.number().int(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean()
}).strict();

export const PersonalMembershipOrderUpdateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateInput> = z.object({
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  member: z.lazy(() => StudentMemberUpdateOneWithoutMembership_orderNestedInputSchema).optional(),
  school: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutPersonal_ordersNestedInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  member_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderCreateManyInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  member_id: z.string().optional().nullable(),
  school_id: z.number().int(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean()
}).strict();

export const PersonalMembershipOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateManyMutationInput> = z.object({
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  member_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolCreateInputSchema: z.ZodType<Prisma.PartnerSchoolCreateInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUpdateManyWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolNestedInputSchema).optional()
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

export const PartnerSchoolScalarRelationFilterSchema: z.ZodType<Prisma.PartnerSchoolScalarRelationFilter> = z.object({
  is: z.lazy(() => PartnerSchoolWhereInputSchema).optional(),
  isNot: z.lazy(() => PartnerSchoolWhereInputSchema).optional()
}).strict();

export const SchoolAccountConfigCountOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigCountOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigAvgOrderByAggregateInput> = z.object({
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigMaxOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigMinOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigMinOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigSumOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigSumOrderByAggregateInput> = z.object({
  school_id: z.lazy(() => SortOrderSchema).optional()
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

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumMembershipPurchaseChannelFilterSchema: z.ZodType<Prisma.EnumMembershipPurchaseChannelFilter> = z.object({
  equals: z.lazy(() => MembershipPurchaseChannelSchema).optional(),
  in: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  notIn: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const EnumAuthenticationProviderNullableListFilterSchema: z.ZodType<Prisma.EnumAuthenticationProviderNullableListFilter> = z.object({
  equals: z.lazy(() => AuthenticationProviderSchema).array().optional().nullable(),
  has: z.lazy(() => AuthenticationProviderSchema).optional().nullable(),
  hasEvery: z.lazy(() => AuthenticationProviderSchema).array().optional(),
  hasSome: z.lazy(() => AuthenticationProviderSchema).array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const PersonalMembershipOrderNullableScalarRelationFilterSchema: z.ZodType<Prisma.PersonalMembershipOrderNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const StudentMemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  student_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  purchase_channel: z.lazy(() => SortOrderSchema).optional(),
  has_stickers: z.lazy(() => SortOrderSchema).optional(),
  auth_providers: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberAvgOrderByAggregateInput> = z.object({
  school_attended_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  student_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  purchase_channel: z.lazy(() => SortOrderSchema).optional(),
  has_stickers: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  student_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  purchase_channel: z.lazy(() => SortOrderSchema).optional(),
  has_stickers: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberSumOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberSumOrderByAggregateInput> = z.object({
  school_attended_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const EnumMembershipPurchaseChannelWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMembershipPurchaseChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipPurchaseChannelSchema).optional(),
  in: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  notIn: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => NestedEnumMembershipPurchaseChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const StudentMemberNullableScalarRelationFilterSchema: z.ZodType<Prisma.StudentMemberNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => StudentMemberWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StudentMemberWhereInputSchema).optional().nullable()
}).strict();

export const PersonalMembershipOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  member_id: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  class: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  real_name: z.lazy(() => SortOrderSchema).optional(),
  need_sticker: z.lazy(() => SortOrderSchema).optional(),
  is_paid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PersonalMembershipOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PersonalMembershipOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  member_id: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  class: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  real_name: z.lazy(() => SortOrderSchema).optional(),
  need_sticker: z.lazy(() => SortOrderSchema).optional(),
  is_paid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PersonalMembershipOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  member_id: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional(),
  class: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  real_name: z.lazy(() => SortOrderSchema).optional(),
  need_sticker: z.lazy(() => SortOrderSchema).optional(),
  is_paid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PersonalMembershipOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPartnerPlanFilterSchema: z.ZodType<Prisma.EnumPartnerPlanFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanFilterSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigNullableScalarRelationFilterSchema: z.ZodType<Prisma.SchoolAccountConfigNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional().nullable()
}).strict();

export const StudentMemberListRelationFilterSchema: z.ZodType<Prisma.StudentMemberListRelationFilter> = z.object({
  every: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  some: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  none: z.lazy(() => StudentMemberWhereInputSchema).optional()
}).strict();

export const PersonalMembershipOrderListRelationFilterSchema: z.ZodType<Prisma.PersonalMembershipOrderListRelationFilter> = z.object({
  every: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional(),
  some: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional(),
  none: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional()
}).strict();

export const StudentMemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StudentMemberOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PersonalMembershipOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PersonalMembershipOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const EnumPartnerPlanWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPartnerPlanWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPartnerPlanFilterSchema).optional()
}).strict();

export const PartnerSchoolCreateNestedOneWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolCreateNestedOneWithoutGoogle_account_configInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutGoogle_account_configInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutGoogle_account_configInputSchema).optional(),
  upsert: z.lazy(() => PartnerSchoolUpsertWithoutGoogle_account_configInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PartnerSchoolUpdateToOneWithWhereWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUpdateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const StudentMemberCreateauth_providersInputSchema: z.ZodType<Prisma.StudentMemberCreateauth_providersInput> = z.object({
  set: z.lazy(() => AuthenticationProviderSchema).array()
}).strict();

export const PartnerSchoolCreateNestedOneWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateNestedOneWithoutStudentsInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutStudentsInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional()
}).strict();

export const PersonalMembershipOrderCreateNestedOneWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateNestedOneWithoutMemberInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUncheckedCreateNestedOneWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedCreateNestedOneWithoutMemberInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMembershipPurchaseChannelFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MembershipPurchaseChannelSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const StudentMemberUpdateauth_providersInputSchema: z.ZodType<Prisma.StudentMemberUpdateauth_providersInput> = z.object({
  set: z.lazy(() => AuthenticationProviderSchema).array().optional(),
  push: z.union([ z.lazy(() => AuthenticationProviderSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutStudentsInputSchema).optional(),
  upsert: z.lazy(() => PartnerSchoolUpsertWithoutStudentsInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PartnerSchoolUpdateToOneWithWhereWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUpdateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutStudentsInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderUpdateOneWithoutMemberNestedInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateOneWithoutMemberNestedInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutMemberInputSchema).optional(),
  upsert: z.lazy(() => PersonalMembershipOrderUpsertWithoutMemberInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateToOneWithWhereWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUpdateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutMemberInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderUncheckedUpdateOneWithoutMemberNestedInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateOneWithoutMemberNestedInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutMemberInputSchema).optional(),
  upsert: z.lazy(() => PersonalMembershipOrderUpsertWithoutMemberInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PersonalMembershipOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateToOneWithWhereWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUpdateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutMemberInputSchema) ]).optional(),
}).strict();

export const StudentMemberCreateNestedOneWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberCreateNestedOneWithoutMembership_orderInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutMembership_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutMembership_orderInputSchema).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional()
}).strict();

export const PartnerSchoolCreateNestedOneWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolCreateNestedOneWithoutPersonal_ordersInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutPersonal_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutPersonal_ordersInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional()
}).strict();

export const StudentMemberUpdateOneWithoutMembership_orderNestedInputSchema: z.ZodType<Prisma.StudentMemberUpdateOneWithoutMembership_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutMembership_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutMembership_orderInputSchema).optional(),
  upsert: z.lazy(() => StudentMemberUpsertWithoutMembership_orderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StudentMemberUpdateToOneWithWhereWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUpdateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutMembership_orderInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolUpdateOneRequiredWithoutPersonal_ordersNestedInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateOneRequiredWithoutPersonal_ordersNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutPersonal_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutPersonal_ordersInputSchema).optional(),
  upsert: z.lazy(() => PartnerSchoolUpsertWithoutPersonal_ordersInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PartnerSchoolUpdateToOneWithWhereWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUpdateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutPersonal_ordersInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateNestedOneWithoutSchoolInput> = z.object({
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema).optional(),
  connect: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema).optional()
}).strict();

export const StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateNestedManyWithoutSchool_attendedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema).array(),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StudentMemberCreateManySchool_attendedInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PersonalMembershipOrderCreateNestedManyWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateNestedManyWithoutSchoolInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema).array(),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PersonalMembershipOrderCreateManySchoolInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInput> = z.object({
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema).optional(),
  connect: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema).optional()
}).strict();

export const StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema).array(),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StudentMemberCreateManySchool_attendedInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PersonalMembershipOrderUncheckedCreateNestedManyWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedCreateNestedManyWithoutSchoolInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema).array(),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PersonalMembershipOrderCreateManySchoolInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumPartnerPlanFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPartnerPlanFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PartnerPlanSchema).optional()
}).strict();

export const SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateOneWithoutSchoolNestedInput> = z.object({
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema).optional(),
  upsert: z.lazy(() => SchoolAccountConfigUpsertWithoutSchoolInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SchoolAccountConfigUpdateToOneWithWhereWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUpdateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema) ]).optional(),
}).strict();

export const StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema: z.ZodType<Prisma.StudentMemberUpdateManyWithoutSchool_attendedNestedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema).array(),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StudentMemberCreateManySchool_attendedInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StudentMemberUpdateManyWithWhereWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpdateManyWithWhereWithoutSchool_attendedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StudentMemberScalarWhereInputSchema),z.lazy(() => StudentMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PersonalMembershipOrderUpdateManyWithoutSchoolNestedInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateManyWithoutSchoolNestedInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema).array(),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PersonalMembershipOrderCreateManySchoolInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInput> = z.object({
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema).optional(),
  upsert: z.lazy(() => SchoolAccountConfigUpsertWithoutSchoolInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SchoolAccountConfigUpdateToOneWithWhereWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUpdateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema) ]).optional(),
}).strict();

export const StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema).array(),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StudentMemberCreateManySchool_attendedInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StudentMemberWhereUniqueInputSchema),z.lazy(() => StudentMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StudentMemberUpdateManyWithWhereWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUpdateManyWithWhereWithoutSchool_attendedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StudentMemberScalarWhereInputSchema),z.lazy(() => StudentMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolNestedInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolNestedInput> = z.object({
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema).array(),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PersonalMembershipOrderCreateManySchoolInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema).array() ]).optional(),
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

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumMembershipPurchaseChannelFilterSchema: z.ZodType<Prisma.NestedEnumMembershipPurchaseChannelFilter> = z.object({
  equals: z.lazy(() => MembershipPurchaseChannelSchema).optional(),
  in: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  notIn: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumMembershipPurchaseChannelWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMembershipPurchaseChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipPurchaseChannelSchema).optional(),
  in: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  notIn: z.lazy(() => MembershipPurchaseChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => NestedEnumMembershipPurchaseChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipPurchaseChannelFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumPartnerPlanFilterSchema: z.ZodType<Prisma.NestedEnumPartnerPlanFilter> = z.object({
  equals: z.lazy(() => PartnerPlanSchema).optional(),
  in: z.lazy(() => PartnerPlanSchema).array().optional(),
  notIn: z.lazy(() => PartnerPlanSchema).array().optional(),
  not: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => NestedEnumPartnerPlanFilterSchema) ]).optional(),
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

export const PartnerSchoolCreateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolCreateWithoutGoogle_account_configInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  students: z.lazy(() => StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateWithoutGoogle_account_configInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  students: z.lazy(() => StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolCreateOrConnectWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolCreateOrConnectWithoutGoogle_account_configInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]),
}).strict();

export const PartnerSchoolUpsertWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUpsertWithoutGoogle_account_configInput> = z.object({
  update: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema) ]),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]),
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateToOneWithWhereWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateToOneWithWhereWithoutGoogle_account_configInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema) ]),
}).strict();

export const PartnerSchoolUpdateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateWithoutGoogle_account_configInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  students: z.lazy(() => StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUpdateManyWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  students: z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PartnerSchoolCreateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateWithoutStudentsInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateWithoutStudentsInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedCreateNestedManyWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolCreateOrConnectWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateOrConnectWithoutStudentsInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]),
}).strict();

export const PersonalMembershipOrderCreateWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateWithoutMemberInput> = z.object({
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean(),
  school: z.lazy(() => PartnerSchoolCreateNestedOneWithoutPersonal_ordersInputSchema)
}).strict();

export const PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedCreateWithoutMemberInput> = z.object({
  id: z.number().int().optional(),
  school_id: z.number().int(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean()
}).strict();

export const PersonalMembershipOrderCreateOrConnectWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateOrConnectWithoutMemberInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]),
}).strict();

export const PartnerSchoolUpsertWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUpsertWithoutStudentsInput> = z.object({
  update: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutStudentsInputSchema) ]),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]),
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateToOneWithWhereWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateToOneWithWhereWithoutStudentsInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutStudentsInputSchema) ]),
}).strict();

export const PartnerSchoolUpdateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateWithoutStudentsInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUpdateManyWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateWithoutStudentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema).optional(),
  personal_orders: z.lazy(() => PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUpsertWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpsertWithoutMemberInput> = z.object({
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutMemberInputSchema) ]),
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutMemberInputSchema) ]),
  where: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUpdateToOneWithWhereWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateToOneWithWhereWithoutMemberInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithoutMemberInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutMemberInputSchema) ]),
}).strict();

export const PersonalMembershipOrderUpdateWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateWithoutMemberInput> = z.object({
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  school: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutPersonal_ordersNestedInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUncheckedUpdateWithoutMemberInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateWithoutMemberInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StudentMemberCreateWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberCreateWithoutMembership_orderInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolCreateNestedOneWithoutStudentsInputSchema)
}).strict();

export const StudentMemberUncheckedCreateWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateWithoutMembership_orderInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable()
}).strict();

export const StudentMemberCreateOrConnectWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberCreateOrConnectWithoutMembership_orderInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutMembership_orderInputSchema) ]),
}).strict();

export const PartnerSchoolCreateWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolCreateWithoutPersonal_ordersInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateWithoutPersonal_ordersInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  plan: z.lazy(() => PartnerPlanSchema),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema).optional()
}).strict();

export const PartnerSchoolCreateOrConnectWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolCreateOrConnectWithoutPersonal_ordersInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutPersonal_ordersInputSchema) ]),
}).strict();

export const StudentMemberUpsertWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberUpsertWithoutMembership_orderInput> = z.object({
  update: z.union([ z.lazy(() => StudentMemberUpdateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutMembership_orderInputSchema) ]),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutMembership_orderInputSchema) ]),
  where: z.lazy(() => StudentMemberWhereInputSchema).optional()
}).strict();

export const StudentMemberUpdateToOneWithWhereWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberUpdateToOneWithWhereWithoutMembership_orderInput> = z.object({
  where: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StudentMemberUpdateWithoutMembership_orderInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutMembership_orderInputSchema) ]),
}).strict();

export const StudentMemberUpdateWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberUpdateWithoutMembership_orderInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateWithoutMembership_orderInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateWithoutMembership_orderInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PartnerSchoolUpsertWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolUpsertWithoutPersonal_ordersInput> = z.object({
  update: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutPersonal_ordersInputSchema) ]),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutPersonal_ordersInputSchema) ]),
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateToOneWithWhereWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateToOneWithWhereWithoutPersonal_ordersInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PartnerSchoolUpdateWithoutPersonal_ordersInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutPersonal_ordersInputSchema) ]),
}).strict();

export const PartnerSchoolUpdateWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateWithoutPersonal_ordersInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateWithoutPersonal_ordersInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateWithoutPersonal_ordersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PartnerPlanSchema),z.lazy(() => EnumPartnerPlanFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const SchoolAccountConfigCreateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateWithoutSchoolInput> = z.object({
  username_format: z.string(),
  domain_name: z.string()
}).strict();

export const SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedCreateWithoutSchoolInput> = z.object({
  username_format: z.string(),
  domain_name: z.string()
}).strict();

export const SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateOrConnectWithoutSchoolInput> = z.object({
  where: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]),
}).strict();

export const StudentMemberCreateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateWithoutSchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderCreateNestedOneWithoutMemberInputSchema).optional()
}).strict();

export const StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateWithoutSchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderUncheckedCreateNestedOneWithoutMemberInputSchema).optional()
}).strict();

export const StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateOrConnectWithoutSchool_attendedInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema) ]),
}).strict();

export const StudentMemberCreateManySchool_attendedInputEnvelopeSchema: z.ZodType<Prisma.StudentMemberCreateManySchool_attendedInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StudentMemberCreateManySchool_attendedInputSchema),z.lazy(() => StudentMemberCreateManySchool_attendedInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PersonalMembershipOrderCreateWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateWithoutSchoolInput> = z.object({
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean(),
  member: z.lazy(() => StudentMemberCreateNestedOneWithoutMembership_orderInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedCreateWithoutSchoolInput> = z.object({
  id: z.number().int().optional(),
  member_id: z.string().optional().nullable(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean()
}).strict();

export const PersonalMembershipOrderCreateOrConnectWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateOrConnectWithoutSchoolInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema) ]),
}).strict();

export const PersonalMembershipOrderCreateManySchoolInputEnvelopeSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateManySchoolInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PersonalMembershipOrderCreateManySchoolInputSchema),z.lazy(() => PersonalMembershipOrderCreateManySchoolInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SchoolAccountConfigUpsertWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpsertWithoutSchoolInput> = z.object({
  update: z.union([ z.lazy(() => SchoolAccountConfigUpdateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema) ]),
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]),
  where: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional()
}).strict();

export const SchoolAccountConfigUpdateToOneWithWhereWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateToOneWithWhereWithoutSchoolInput> = z.object({
  where: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SchoolAccountConfigUpdateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema) ]),
}).strict();

export const SchoolAccountConfigUpdateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateWithoutSchoolInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateWithoutSchoolInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUpsertWithWhereUniqueWithoutSchool_attendedInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StudentMemberUpdateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutSchool_attendedInputSchema) ]),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema) ]),
}).strict();

export const StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUpdateWithWhereUniqueWithoutSchool_attendedInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StudentMemberUpdateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutSchool_attendedInputSchema) ]),
}).strict();

export const StudentMemberUpdateManyWithWhereWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUpdateManyWithWhereWithoutSchool_attendedInput> = z.object({
  where: z.lazy(() => StudentMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StudentMemberUpdateManyMutationInputSchema),z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedInputSchema) ]),
}).strict();

export const StudentMemberScalarWhereInputSchema: z.ZodType<Prisma.StudentMemberScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StudentMemberScalarWhereInputSchema),z.lazy(() => StudentMemberScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberScalarWhereInputSchema),z.lazy(() => StudentMemberScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  student_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => EnumMembershipPurchaseChannelFilterSchema),z.lazy(() => MembershipPurchaseChannelSchema) ]).optional(),
  has_stickers: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  auth_providers: z.lazy(() => EnumAuthenticationProviderNullableListFilterSchema).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpsertWithWhereUniqueWithoutSchoolInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutSchoolInputSchema) ]),
  create: z.union([ z.lazy(() => PersonalMembershipOrderCreateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedCreateWithoutSchoolInputSchema) ]),
}).strict();

export const PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateWithWhereUniqueWithoutSchoolInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PersonalMembershipOrderUpdateWithoutSchoolInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateWithoutSchoolInputSchema) ]),
}).strict();

export const PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateManyWithWhereWithoutSchoolInput> = z.object({
  where: z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PersonalMembershipOrderUpdateManyMutationInputSchema),z.lazy(() => PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolInputSchema) ]),
}).strict();

export const PersonalMembershipOrderScalarWhereInputSchema: z.ZodType<Prisma.PersonalMembershipOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema),z.lazy(() => PersonalMembershipOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  member_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  school_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  class: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  real_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  need_sticker: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  is_paid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const StudentMemberCreateManySchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateManySchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  purchase_channel: z.lazy(() => MembershipPurchaseChannelSchema),
  has_stickers: z.boolean().optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberCreateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  password_hash: z.string().optional().nullable()
}).strict();

export const PersonalMembershipOrderCreateManySchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateManySchoolInput> = z.object({
  id: z.number().int().optional(),
  member_id: z.string().optional().nullable(),
  class: z.string(),
  number: z.string(),
  real_name: z.string(),
  need_sticker: z.boolean(),
  is_paid: z.boolean()
}).strict();

export const StudentMemberUpdateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUpdateWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderUpdateOneWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership_order: z.lazy(() => PersonalMembershipOrderUncheckedUpdateOneWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateManyWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateManyWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  purchase_channel: z.union([ z.lazy(() => MembershipPurchaseChannelSchema),z.lazy(() => EnumMembershipPurchaseChannelFieldUpdateOperationsInputSchema) ]).optional(),
  has_stickers: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  auth_providers: z.union([ z.lazy(() => StudentMemberUpdateauth_providersInputSchema),z.lazy(() => AuthenticationProviderSchema).array() ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PersonalMembershipOrderUpdateWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateWithoutSchoolInput> = z.object({
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  member: z.lazy(() => StudentMemberUpdateOneWithoutMembership_orderNestedInputSchema).optional()
}).strict();

export const PersonalMembershipOrderUncheckedUpdateWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateWithoutSchoolInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  member_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolInputSchema: z.ZodType<Prisma.PersonalMembershipOrderUncheckedUpdateManyWithoutSchoolInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  member_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  class: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  real_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  need_sticker: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const SchoolAccountConfigFindFirstArgsSchema: z.ZodType<Prisma.SchoolAccountConfigFindFirstArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereInputSchema.optional(),
  orderBy: z.union([ SchoolAccountConfigOrderByWithRelationInputSchema.array(),SchoolAccountConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: SchoolAccountConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SchoolAccountConfigScalarFieldEnumSchema,SchoolAccountConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SchoolAccountConfigFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SchoolAccountConfigFindFirstOrThrowArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereInputSchema.optional(),
  orderBy: z.union([ SchoolAccountConfigOrderByWithRelationInputSchema.array(),SchoolAccountConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: SchoolAccountConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SchoolAccountConfigScalarFieldEnumSchema,SchoolAccountConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SchoolAccountConfigFindManyArgsSchema: z.ZodType<Prisma.SchoolAccountConfigFindManyArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereInputSchema.optional(),
  orderBy: z.union([ SchoolAccountConfigOrderByWithRelationInputSchema.array(),SchoolAccountConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: SchoolAccountConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SchoolAccountConfigScalarFieldEnumSchema,SchoolAccountConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SchoolAccountConfigAggregateArgsSchema: z.ZodType<Prisma.SchoolAccountConfigAggregateArgs> = z.object({
  where: SchoolAccountConfigWhereInputSchema.optional(),
  orderBy: z.union([ SchoolAccountConfigOrderByWithRelationInputSchema.array(),SchoolAccountConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: SchoolAccountConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SchoolAccountConfigGroupByArgsSchema: z.ZodType<Prisma.SchoolAccountConfigGroupByArgs> = z.object({
  where: SchoolAccountConfigWhereInputSchema.optional(),
  orderBy: z.union([ SchoolAccountConfigOrderByWithAggregationInputSchema.array(),SchoolAccountConfigOrderByWithAggregationInputSchema ]).optional(),
  by: SchoolAccountConfigScalarFieldEnumSchema.array(),
  having: SchoolAccountConfigScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SchoolAccountConfigFindUniqueArgsSchema: z.ZodType<Prisma.SchoolAccountConfigFindUniqueArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereUniqueInputSchema,
}).strict() ;

export const SchoolAccountConfigFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SchoolAccountConfigFindUniqueOrThrowArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereUniqueInputSchema,
}).strict() ;

export const StudentMemberFindFirstArgsSchema: z.ZodType<Prisma.StudentMemberFindFirstArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereInputSchema.optional(),
  orderBy: z.union([ StudentMemberOrderByWithRelationInputSchema.array(),StudentMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: StudentMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StudentMemberScalarFieldEnumSchema,StudentMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StudentMemberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.StudentMemberFindFirstOrThrowArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereInputSchema.optional(),
  orderBy: z.union([ StudentMemberOrderByWithRelationInputSchema.array(),StudentMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: StudentMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StudentMemberScalarFieldEnumSchema,StudentMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StudentMemberFindManyArgsSchema: z.ZodType<Prisma.StudentMemberFindManyArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereInputSchema.optional(),
  orderBy: z.union([ StudentMemberOrderByWithRelationInputSchema.array(),StudentMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: StudentMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StudentMemberScalarFieldEnumSchema,StudentMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StudentMemberAggregateArgsSchema: z.ZodType<Prisma.StudentMemberAggregateArgs> = z.object({
  where: StudentMemberWhereInputSchema.optional(),
  orderBy: z.union([ StudentMemberOrderByWithRelationInputSchema.array(),StudentMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: StudentMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StudentMemberGroupByArgsSchema: z.ZodType<Prisma.StudentMemberGroupByArgs> = z.object({
  where: StudentMemberWhereInputSchema.optional(),
  orderBy: z.union([ StudentMemberOrderByWithAggregationInputSchema.array(),StudentMemberOrderByWithAggregationInputSchema ]).optional(),
  by: StudentMemberScalarFieldEnumSchema.array(),
  having: StudentMemberScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StudentMemberFindUniqueArgsSchema: z.ZodType<Prisma.StudentMemberFindUniqueArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereUniqueInputSchema,
}).strict() ;

export const StudentMemberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.StudentMemberFindUniqueOrThrowArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereUniqueInputSchema,
}).strict() ;

export const PersonalMembershipOrderFindFirstArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderFindFirstArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereInputSchema.optional(),
  orderBy: z.union([ PersonalMembershipOrderOrderByWithRelationInputSchema.array(),PersonalMembershipOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonalMembershipOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonalMembershipOrderScalarFieldEnumSchema,PersonalMembershipOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PersonalMembershipOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderFindFirstOrThrowArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereInputSchema.optional(),
  orderBy: z.union([ PersonalMembershipOrderOrderByWithRelationInputSchema.array(),PersonalMembershipOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonalMembershipOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonalMembershipOrderScalarFieldEnumSchema,PersonalMembershipOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PersonalMembershipOrderFindManyArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderFindManyArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereInputSchema.optional(),
  orderBy: z.union([ PersonalMembershipOrderOrderByWithRelationInputSchema.array(),PersonalMembershipOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonalMembershipOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonalMembershipOrderScalarFieldEnumSchema,PersonalMembershipOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PersonalMembershipOrderAggregateArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderAggregateArgs> = z.object({
  where: PersonalMembershipOrderWhereInputSchema.optional(),
  orderBy: z.union([ PersonalMembershipOrderOrderByWithRelationInputSchema.array(),PersonalMembershipOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonalMembershipOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PersonalMembershipOrderGroupByArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderGroupByArgs> = z.object({
  where: PersonalMembershipOrderWhereInputSchema.optional(),
  orderBy: z.union([ PersonalMembershipOrderOrderByWithAggregationInputSchema.array(),PersonalMembershipOrderOrderByWithAggregationInputSchema ]).optional(),
  by: PersonalMembershipOrderScalarFieldEnumSchema.array(),
  having: PersonalMembershipOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PersonalMembershipOrderFindUniqueArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderFindUniqueArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereUniqueInputSchema,
}).strict() ;

export const PersonalMembershipOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderFindUniqueOrThrowArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolFindFirstArgsSchema: z.ZodType<Prisma.PartnerSchoolFindFirstArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PartnerSchoolScalarFieldEnumSchema,PartnerSchoolScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PartnerSchoolFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PartnerSchoolFindFirstOrThrowArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
  where: PartnerSchoolWhereInputSchema.optional(),
  orderBy: z.union([ PartnerSchoolOrderByWithRelationInputSchema.array(),PartnerSchoolOrderByWithRelationInputSchema ]).optional(),
  cursor: PartnerSchoolWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PartnerSchoolScalarFieldEnumSchema,PartnerSchoolScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PartnerSchoolFindManyArgsSchema: z.ZodType<Prisma.PartnerSchoolFindManyArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
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
  include: PartnerSchoolIncludeSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PartnerSchoolFindUniqueOrThrowArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const SchoolAccountConfigCreateArgsSchema: z.ZodType<Prisma.SchoolAccountConfigCreateArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  data: z.union([ SchoolAccountConfigCreateInputSchema,SchoolAccountConfigUncheckedCreateInputSchema ]),
}).strict() ;

export const SchoolAccountConfigUpsertArgsSchema: z.ZodType<Prisma.SchoolAccountConfigUpsertArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereUniqueInputSchema,
  create: z.union([ SchoolAccountConfigCreateInputSchema,SchoolAccountConfigUncheckedCreateInputSchema ]),
  update: z.union([ SchoolAccountConfigUpdateInputSchema,SchoolAccountConfigUncheckedUpdateInputSchema ]),
}).strict() ;

export const SchoolAccountConfigCreateManyArgsSchema: z.ZodType<Prisma.SchoolAccountConfigCreateManyArgs> = z.object({
  data: z.union([ SchoolAccountConfigCreateManyInputSchema,SchoolAccountConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SchoolAccountConfigCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SchoolAccountConfigCreateManyAndReturnArgs> = z.object({
  data: z.union([ SchoolAccountConfigCreateManyInputSchema,SchoolAccountConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SchoolAccountConfigDeleteArgsSchema: z.ZodType<Prisma.SchoolAccountConfigDeleteArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  where: SchoolAccountConfigWhereUniqueInputSchema,
}).strict() ;

export const SchoolAccountConfigUpdateArgsSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateArgs> = z.object({
  select: SchoolAccountConfigSelectSchema.optional(),
  include: SchoolAccountConfigIncludeSchema.optional(),
  data: z.union([ SchoolAccountConfigUpdateInputSchema,SchoolAccountConfigUncheckedUpdateInputSchema ]),
  where: SchoolAccountConfigWhereUniqueInputSchema,
}).strict() ;

export const SchoolAccountConfigUpdateManyArgsSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateManyArgs> = z.object({
  data: z.union([ SchoolAccountConfigUpdateManyMutationInputSchema,SchoolAccountConfigUncheckedUpdateManyInputSchema ]),
  where: SchoolAccountConfigWhereInputSchema.optional(),
}).strict() ;

export const SchoolAccountConfigDeleteManyArgsSchema: z.ZodType<Prisma.SchoolAccountConfigDeleteManyArgs> = z.object({
  where: SchoolAccountConfigWhereInputSchema.optional(),
}).strict() ;

export const StudentMemberCreateArgsSchema: z.ZodType<Prisma.StudentMemberCreateArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  data: z.union([ StudentMemberCreateInputSchema,StudentMemberUncheckedCreateInputSchema ]),
}).strict() ;

export const StudentMemberUpsertArgsSchema: z.ZodType<Prisma.StudentMemberUpsertArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereUniqueInputSchema,
  create: z.union([ StudentMemberCreateInputSchema,StudentMemberUncheckedCreateInputSchema ]),
  update: z.union([ StudentMemberUpdateInputSchema,StudentMemberUncheckedUpdateInputSchema ]),
}).strict() ;

export const StudentMemberCreateManyArgsSchema: z.ZodType<Prisma.StudentMemberCreateManyArgs> = z.object({
  data: z.union([ StudentMemberCreateManyInputSchema,StudentMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const StudentMemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.StudentMemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ StudentMemberCreateManyInputSchema,StudentMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const StudentMemberDeleteArgsSchema: z.ZodType<Prisma.StudentMemberDeleteArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  where: StudentMemberWhereUniqueInputSchema,
}).strict() ;

export const StudentMemberUpdateArgsSchema: z.ZodType<Prisma.StudentMemberUpdateArgs> = z.object({
  select: StudentMemberSelectSchema.optional(),
  include: StudentMemberIncludeSchema.optional(),
  data: z.union([ StudentMemberUpdateInputSchema,StudentMemberUncheckedUpdateInputSchema ]),
  where: StudentMemberWhereUniqueInputSchema,
}).strict() ;

export const StudentMemberUpdateManyArgsSchema: z.ZodType<Prisma.StudentMemberUpdateManyArgs> = z.object({
  data: z.union([ StudentMemberUpdateManyMutationInputSchema,StudentMemberUncheckedUpdateManyInputSchema ]),
  where: StudentMemberWhereInputSchema.optional(),
}).strict() ;

export const StudentMemberDeleteManyArgsSchema: z.ZodType<Prisma.StudentMemberDeleteManyArgs> = z.object({
  where: StudentMemberWhereInputSchema.optional(),
}).strict() ;

export const PersonalMembershipOrderCreateArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  data: z.union([ PersonalMembershipOrderCreateInputSchema,PersonalMembershipOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const PersonalMembershipOrderUpsertArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderUpsertArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereUniqueInputSchema,
  create: z.union([ PersonalMembershipOrderCreateInputSchema,PersonalMembershipOrderUncheckedCreateInputSchema ]),
  update: z.union([ PersonalMembershipOrderUpdateInputSchema,PersonalMembershipOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const PersonalMembershipOrderCreateManyArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateManyArgs> = z.object({
  data: z.union([ PersonalMembershipOrderCreateManyInputSchema,PersonalMembershipOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PersonalMembershipOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ PersonalMembershipOrderCreateManyInputSchema,PersonalMembershipOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PersonalMembershipOrderDeleteArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderDeleteArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  where: PersonalMembershipOrderWhereUniqueInputSchema,
}).strict() ;

export const PersonalMembershipOrderUpdateArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateArgs> = z.object({
  select: PersonalMembershipOrderSelectSchema.optional(),
  include: PersonalMembershipOrderIncludeSchema.optional(),
  data: z.union([ PersonalMembershipOrderUpdateInputSchema,PersonalMembershipOrderUncheckedUpdateInputSchema ]),
  where: PersonalMembershipOrderWhereUniqueInputSchema,
}).strict() ;

export const PersonalMembershipOrderUpdateManyArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderUpdateManyArgs> = z.object({
  data: z.union([ PersonalMembershipOrderUpdateManyMutationInputSchema,PersonalMembershipOrderUncheckedUpdateManyInputSchema ]),
  where: PersonalMembershipOrderWhereInputSchema.optional(),
}).strict() ;

export const PersonalMembershipOrderDeleteManyArgsSchema: z.ZodType<Prisma.PersonalMembershipOrderDeleteManyArgs> = z.object({
  where: PersonalMembershipOrderWhereInputSchema.optional(),
}).strict() ;

export const PartnerSchoolCreateArgsSchema: z.ZodType<Prisma.PartnerSchoolCreateArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
  data: z.union([ PartnerSchoolCreateInputSchema,PartnerSchoolUncheckedCreateInputSchema ]),
}).strict() ;

export const PartnerSchoolUpsertArgsSchema: z.ZodType<Prisma.PartnerSchoolUpsertArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
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
  include: PartnerSchoolIncludeSchema.optional(),
  where: PartnerSchoolWhereUniqueInputSchema,
}).strict() ;

export const PartnerSchoolUpdateArgsSchema: z.ZodType<Prisma.PartnerSchoolUpdateArgs> = z.object({
  select: PartnerSchoolSelectSchema.optional(),
  include: PartnerSchoolIncludeSchema.optional(),
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