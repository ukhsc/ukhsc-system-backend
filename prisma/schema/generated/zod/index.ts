import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const FederatedAccountScalarFieldEnumSchema = z.enum(['id','provider','provider_identifier','email','user_id']);

export const SchoolAccountConfigScalarFieldEnumSchema = z.enum(['username_format','student_username_format','password_format','domain_name','school_id']);

export const LoginActivityScalarFieldEnumSchema = z.enum(['id','device_id','ip_address','login_time','success']);

export const SystemConfigurationUpdatesScalarFieldEnumSchema = z.enum(['id','created_at','updated_at','service_status','contract_start_date','contract_end_date']);

export const StudentMemberScalarFieldEnumSchema = z.enum(['id','school_attended_id','user_id','nickname','student_id_hash','password_hash','created_at','activated_at','expired_at']);

export const PartnerSchoolScalarFieldEnumSchema = z.enum(['id','short_name','full_name']);

export const UserScalarFieldEnumSchema = z.enum(['id','primary_email','created_at','updated_at']);

export const UserDeviceScalarFieldEnumSchema = z.enum(['id','user_id','name','type','operating_system','created_at','updated_at']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const FederatedProviderSchema = z.enum(['Google','GoogleWorkspace']);

export type FederatedProviderType = `${z.infer<typeof FederatedProviderSchema>}`

export const SystemServiceStatusSchema = z.enum(['Normal','Maintenance']);

export type SystemServiceStatusType = `${z.infer<typeof SystemServiceStatusSchema>}`

export const DeviceTypeSchema = z.enum(['Browser','Mobile','Unknown']);

export type DeviceTypeType = `${z.infer<typeof DeviceTypeSchema>}`

export const DeviceOperatingSystemSchema = z.enum(['Android','iOS','Unknown']);

export type DeviceOperatingSystemType = `${z.infer<typeof DeviceOperatingSystemSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// FEDERATED ACCOUNT SCHEMA
/////////////////////////////////////////

export const FederatedAccountSchema = z.object({
  provider: FederatedProviderSchema,
  id: z.number().int(),
  /**
   * User identifier from the provider (e.g. Google ID)
   */
  provider_identifier: z.string(),
  email: z.string(),
  user_id: z.number().int(),
})

export type FederatedAccount = z.infer<typeof FederatedAccountSchema>

/////////////////////////////////////////
// SCHOOL ACCOUNT CONFIG SCHEMA
/////////////////////////////////////////

export const SchoolAccountConfigSchema = z.object({
  /**
   * Human-readable username format (e.g. "s + 7-digit student ID")
   */
  username_format: z.string(),
  /**
   * Regex pattern for student usernames where capture group 1 extracts the student ID (e.g. "s([0-9]{7})" - group 1 captures the 7-digit ID)
   */
  student_username_format: z.string(),
  /**
   * Human-readable password format (e.g. same as birthday)
   */
  password_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int(),
})

export type SchoolAccountConfig = z.infer<typeof SchoolAccountConfigSchema>

/////////////////////////////////////////
// LOGIN ACTIVITY SCHEMA
/////////////////////////////////////////

export const LoginActivitySchema = z.object({
  id: z.number().int(),
  device_id: z.number().int(),
  ip_address: z.string().nullable(),
  login_time: z.coerce.date(),
  success: z.boolean(),
})

export type LoginActivity = z.infer<typeof LoginActivitySchema>

/////////////////////////////////////////
// SYSTEM CONFIGURATION UPDATES SCHEMA
/////////////////////////////////////////

export const SystemConfigurationUpdatesSchema = z.object({
  service_status: SystemServiceStatusSchema,
  id: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  contract_start_date: z.coerce.date(),
  contract_end_date: z.coerce.date(),
})

export type SystemConfigurationUpdates = z.infer<typeof SystemConfigurationUpdatesSchema>

/////////////////////////////////////////
// STUDENT MEMBER SCHEMA
/////////////////////////////////////////

export const StudentMemberSchema = z.object({
  id: z.string().cuid(),
  school_attended_id: z.number().int(),
  user_id: z.number().int(),
  nickname: z.string().nullable(),
  student_id_hash: z.string().nullable(),
  password_hash: z.string().nullable(),
  created_at: z.coerce.date(),
  activated_at: z.coerce.date().nullable(),
  expired_at: z.coerce.date().nullable(),
})

export type StudentMember = z.infer<typeof StudentMemberSchema>

/////////////////////////////////////////
// PARTNER SCHOOL SCHEMA
/////////////////////////////////////////

export const PartnerSchoolSchema = z.object({
  id: z.number().int(),
  short_name: z.string(),
  full_name: z.string(),
})

export type PartnerSchool = z.infer<typeof PartnerSchoolSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  primary_email: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER DEVICE SCHEMA
/////////////////////////////////////////

export const UserDeviceSchema = z.object({
  type: DeviceTypeSchema,
  operating_system: DeviceOperatingSystemSchema,
  id: z.number().int(),
  user_id: z.number().int(),
  name: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type UserDevice = z.infer<typeof UserDeviceSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// FEDERATED ACCOUNT
//------------------------------------------------------

export const FederatedAccountIncludeSchema: z.ZodType<Prisma.FederatedAccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const FederatedAccountArgsSchema: z.ZodType<Prisma.FederatedAccountDefaultArgs> = z.object({
  select: z.lazy(() => FederatedAccountSelectSchema).optional(),
  include: z.lazy(() => FederatedAccountIncludeSchema).optional(),
}).strict();

export const FederatedAccountSelectSchema: z.ZodType<Prisma.FederatedAccountSelect> = z.object({
  id: z.boolean().optional(),
  provider: z.boolean().optional(),
  provider_identifier: z.boolean().optional(),
  email: z.boolean().optional(),
  user_id: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

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
  student_username_format: z.boolean().optional(),
  password_format: z.boolean().optional(),
  domain_name: z.boolean().optional(),
  school_id: z.boolean().optional(),
  school: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
}).strict()

// LOGIN ACTIVITY
//------------------------------------------------------

export const LoginActivityIncludeSchema: z.ZodType<Prisma.LoginActivityInclude> = z.object({
  device: z.union([z.boolean(),z.lazy(() => UserDeviceArgsSchema)]).optional(),
}).strict()

export const LoginActivityArgsSchema: z.ZodType<Prisma.LoginActivityDefaultArgs> = z.object({
  select: z.lazy(() => LoginActivitySelectSchema).optional(),
  include: z.lazy(() => LoginActivityIncludeSchema).optional(),
}).strict();

export const LoginActivitySelectSchema: z.ZodType<Prisma.LoginActivitySelect> = z.object({
  id: z.boolean().optional(),
  device_id: z.boolean().optional(),
  ip_address: z.boolean().optional(),
  login_time: z.boolean().optional(),
  success: z.boolean().optional(),
  device: z.union([z.boolean(),z.lazy(() => UserDeviceArgsSchema)]).optional(),
}).strict()

// SYSTEM CONFIGURATION UPDATES
//------------------------------------------------------

export const SystemConfigurationUpdatesSelectSchema: z.ZodType<Prisma.SystemConfigurationUpdatesSelect> = z.object({
  id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  service_status: z.boolean().optional(),
  contract_start_date: z.boolean().optional(),
  contract_end_date: z.boolean().optional(),
}).strict()

// STUDENT MEMBER
//------------------------------------------------------

export const StudentMemberIncludeSchema: z.ZodType<Prisma.StudentMemberInclude> = z.object({
  school_attended: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const StudentMemberArgsSchema: z.ZodType<Prisma.StudentMemberDefaultArgs> = z.object({
  select: z.lazy(() => StudentMemberSelectSchema).optional(),
  include: z.lazy(() => StudentMemberIncludeSchema).optional(),
}).strict();

export const StudentMemberSelectSchema: z.ZodType<Prisma.StudentMemberSelect> = z.object({
  id: z.boolean().optional(),
  school_attended_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  nickname: z.boolean().optional(),
  student_id_hash: z.boolean().optional(),
  password_hash: z.boolean().optional(),
  created_at: z.boolean().optional(),
  activated_at: z.boolean().optional(),
  expired_at: z.boolean().optional(),
  school_attended: z.union([z.boolean(),z.lazy(() => PartnerSchoolArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PARTNER SCHOOL
//------------------------------------------------------

export const PartnerSchoolIncludeSchema: z.ZodType<Prisma.PartnerSchoolInclude> = z.object({
  google_account_config: z.union([z.boolean(),z.lazy(() => SchoolAccountConfigArgsSchema)]).optional(),
  students: z.union([z.boolean(),z.lazy(() => StudentMemberFindManyArgsSchema)]).optional(),
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
}).strict();

export const PartnerSchoolSelectSchema: z.ZodType<Prisma.PartnerSchoolSelect> = z.object({
  id: z.boolean().optional(),
  short_name: z.boolean().optional(),
  full_name: z.boolean().optional(),
  google_account_config: z.union([z.boolean(),z.lazy(() => SchoolAccountConfigArgsSchema)]).optional(),
  students: z.union([z.boolean(),z.lazy(() => StudentMemberFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PartnerSchoolCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  federated_accounts: z.union([z.boolean(),z.lazy(() => FederatedAccountFindManyArgsSchema)]).optional(),
  devices: z.union([z.boolean(),z.lazy(() => UserDeviceFindManyArgsSchema)]).optional(),
  member: z.union([z.boolean(),z.lazy(() => StudentMemberArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  federated_accounts: z.boolean().optional(),
  devices: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  primary_email: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  federated_accounts: z.union([z.boolean(),z.lazy(() => FederatedAccountFindManyArgsSchema)]).optional(),
  devices: z.union([z.boolean(),z.lazy(() => UserDeviceFindManyArgsSchema)]).optional(),
  member: z.union([z.boolean(),z.lazy(() => StudentMemberArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER DEVICE
//------------------------------------------------------

export const UserDeviceIncludeSchema: z.ZodType<Prisma.UserDeviceInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  login_activities: z.union([z.boolean(),z.lazy(() => LoginActivityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserDeviceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserDeviceArgsSchema: z.ZodType<Prisma.UserDeviceDefaultArgs> = z.object({
  select: z.lazy(() => UserDeviceSelectSchema).optional(),
  include: z.lazy(() => UserDeviceIncludeSchema).optional(),
}).strict();

export const UserDeviceCountOutputTypeArgsSchema: z.ZodType<Prisma.UserDeviceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserDeviceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserDeviceCountOutputTypeSelectSchema: z.ZodType<Prisma.UserDeviceCountOutputTypeSelect> = z.object({
  login_activities: z.boolean().optional(),
}).strict();

export const UserDeviceSelectSchema: z.ZodType<Prisma.UserDeviceSelect> = z.object({
  id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  operating_system: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  login_activities: z.union([z.boolean(),z.lazy(() => LoginActivityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserDeviceCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const FederatedAccountWhereInputSchema: z.ZodType<Prisma.FederatedAccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FederatedAccountWhereInputSchema),z.lazy(() => FederatedAccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FederatedAccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FederatedAccountWhereInputSchema),z.lazy(() => FederatedAccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumFederatedProviderFilterSchema),z.lazy(() => FederatedProviderSchema) ]).optional(),
  provider_identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const FederatedAccountOrderByWithRelationInputSchema: z.ZodType<Prisma.FederatedAccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  provider_identifier: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const FederatedAccountWhereUniqueInputSchema: z.ZodType<Prisma.FederatedAccountWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    unique_provider_identifier: z.lazy(() => FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema),
    unique_provider_user: z.lazy(() => FederatedAccountUnique_provider_userCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
    unique_provider_identifier: z.lazy(() => FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
    unique_provider_user: z.lazy(() => FederatedAccountUnique_provider_userCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    unique_provider_identifier: z.lazy(() => FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema),
    unique_provider_user: z.lazy(() => FederatedAccountUnique_provider_userCompoundUniqueInputSchema),
  }),
  z.object({
    unique_provider_identifier: z.lazy(() => FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema),
  }),
  z.object({
    unique_provider_user: z.lazy(() => FederatedAccountUnique_provider_userCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  unique_provider_identifier: z.lazy(() => FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema).optional(),
  unique_provider_user: z.lazy(() => FederatedAccountUnique_provider_userCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FederatedAccountWhereInputSchema),z.lazy(() => FederatedAccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FederatedAccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FederatedAccountWhereInputSchema),z.lazy(() => FederatedAccountWhereInputSchema).array() ]).optional(),
  provider: z.union([ z.lazy(() => EnumFederatedProviderFilterSchema),z.lazy(() => FederatedProviderSchema) ]).optional(),
  provider_identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const FederatedAccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.FederatedAccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  provider_identifier: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FederatedAccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FederatedAccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FederatedAccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FederatedAccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FederatedAccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const FederatedAccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FederatedAccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FederatedAccountScalarWhereWithAggregatesInputSchema),z.lazy(() => FederatedAccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FederatedAccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FederatedAccountScalarWhereWithAggregatesInputSchema),z.lazy(() => FederatedAccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumFederatedProviderWithAggregatesFilterSchema),z.lazy(() => FederatedProviderSchema) ]).optional(),
  provider_identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const SchoolAccountConfigWhereInputSchema: z.ZodType<Prisma.SchoolAccountConfigWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SchoolAccountConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SchoolAccountConfigWhereInputSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema).array() ]).optional(),
  username_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  student_username_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigOrderByWithRelationInputSchema: z.ZodType<Prisma.SchoolAccountConfigOrderByWithRelationInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  student_username_format: z.lazy(() => SortOrderSchema).optional(),
  password_format: z.lazy(() => SortOrderSchema).optional(),
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
  student_username_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
}).strict());

export const SchoolAccountConfigOrderByWithAggregationInputSchema: z.ZodType<Prisma.SchoolAccountConfigOrderByWithAggregationInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  student_username_format: z.lazy(() => SortOrderSchema).optional(),
  password_format: z.lazy(() => SortOrderSchema).optional(),
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
  student_username_format: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password_format: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  domain_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  school_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const LoginActivityWhereInputSchema: z.ZodType<Prisma.LoginActivityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LoginActivityWhereInputSchema),z.lazy(() => LoginActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LoginActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LoginActivityWhereInputSchema),z.lazy(() => LoginActivityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  device_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ip_address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  login_time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  device: z.union([ z.lazy(() => UserDeviceScalarRelationFilterSchema),z.lazy(() => UserDeviceWhereInputSchema) ]).optional(),
}).strict();

export const LoginActivityOrderByWithRelationInputSchema: z.ZodType<Prisma.LoginActivityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional(),
  ip_address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  login_time: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  device: z.lazy(() => UserDeviceOrderByWithRelationInputSchema).optional()
}).strict();

export const LoginActivityWhereUniqueInputSchema: z.ZodType<Prisma.LoginActivityWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LoginActivityWhereInputSchema),z.lazy(() => LoginActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LoginActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LoginActivityWhereInputSchema),z.lazy(() => LoginActivityWhereInputSchema).array() ]).optional(),
  device_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  ip_address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  login_time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  device: z.union([ z.lazy(() => UserDeviceScalarRelationFilterSchema),z.lazy(() => UserDeviceWhereInputSchema) ]).optional(),
}).strict());

export const LoginActivityOrderByWithAggregationInputSchema: z.ZodType<Prisma.LoginActivityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional(),
  ip_address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  login_time: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LoginActivityCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LoginActivityAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LoginActivityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LoginActivityMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LoginActivitySumOrderByAggregateInputSchema).optional()
}).strict();

export const LoginActivityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LoginActivityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LoginActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => LoginActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LoginActivityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LoginActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => LoginActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  device_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  ip_address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  login_time: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  success: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const SystemConfigurationUpdatesWhereInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SystemConfigurationUpdatesWhereInputSchema),z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SystemConfigurationUpdatesWhereInputSchema),z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  service_status: z.union([ z.lazy(() => EnumSystemServiceStatusFilterSchema),z.lazy(() => SystemServiceStatusSchema) ]).optional(),
  contract_start_date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contract_end_date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SystemConfigurationUpdatesOrderByWithRelationInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  service_status: z.lazy(() => SortOrderSchema).optional(),
  contract_start_date: z.lazy(() => SortOrderSchema).optional(),
  contract_end_date: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SystemConfigurationUpdatesWhereUniqueInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesWhereUniqueInput> = z.object({
  id: z.number()
})
.and(z.object({
  id: z.number().optional(),
  AND: z.union([ z.lazy(() => SystemConfigurationUpdatesWhereInputSchema),z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SystemConfigurationUpdatesWhereInputSchema),z.lazy(() => SystemConfigurationUpdatesWhereInputSchema).array() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  service_status: z.union([ z.lazy(() => EnumSystemServiceStatusFilterSchema),z.lazy(() => SystemServiceStatusSchema) ]).optional(),
  contract_start_date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contract_end_date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const SystemConfigurationUpdatesOrderByWithAggregationInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  service_status: z.lazy(() => SortOrderSchema).optional(),
  contract_start_date: z.lazy(() => SortOrderSchema).optional(),
  contract_end_date: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SystemConfigurationUpdatesCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SystemConfigurationUpdatesAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SystemConfigurationUpdatesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SystemConfigurationUpdatesMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SystemConfigurationUpdatesSumOrderByAggregateInputSchema).optional()
}).strict();

export const SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema),z.lazy(() => SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema),z.lazy(() => SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  service_status: z.union([ z.lazy(() => EnumSystemServiceStatusWithAggregatesFilterSchema),z.lazy(() => SystemServiceStatusSchema) ]).optional(),
  contract_start_date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  contract_end_date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const StudentMemberWhereInputSchema: z.ZodType<Prisma.StudentMemberWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  student_id_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expired_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  school_attended: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const StudentMemberOrderByWithRelationInputSchema: z.ZodType<Prisma.StudentMemberOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  student_id_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expired_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  school_attended: z.lazy(() => PartnerSchoolOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const StudentMemberWhereUniqueInputSchema: z.ZodType<Prisma.StudentMemberWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    user_id: z.number().int()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    user_id: z.number().int(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  user_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StudentMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StudentMemberWhereInputSchema),z.lazy(() => StudentMemberWhereInputSchema).array() ]).optional(),
  school_attended_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  student_id_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expired_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  school_attended: z.union([ z.lazy(() => PartnerSchoolScalarRelationFilterSchema),z.lazy(() => PartnerSchoolWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const StudentMemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.StudentMemberOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  student_id_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password_hash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expired_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  user_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  nickname: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  student_id_hash: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  expired_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const PartnerSchoolWhereInputSchema: z.ZodType<Prisma.PartnerSchoolWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  short_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  full_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  google_account_config: z.union([ z.lazy(() => SchoolAccountConfigNullableScalarRelationFilterSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional().nullable(),
  students: z.lazy(() => StudentMemberListRelationFilterSchema).optional()
}).strict();

export const PartnerSchoolOrderByWithRelationInputSchema: z.ZodType<Prisma.PartnerSchoolOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigOrderByWithRelationInputSchema).optional(),
  students: z.lazy(() => StudentMemberOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PartnerSchoolWhereUniqueInputSchema: z.ZodType<Prisma.PartnerSchoolWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    short_name: z.string(),
    full_name: z.string()
  }),
  z.object({
    id: z.number().int(),
    short_name: z.string(),
  }),
  z.object({
    id: z.number().int(),
    full_name: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    short_name: z.string(),
    full_name: z.string(),
  }),
  z.object({
    short_name: z.string(),
  }),
  z.object({
    full_name: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  short_name: z.string().optional(),
  full_name: z.string().optional(),
  AND: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartnerSchoolWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartnerSchoolWhereInputSchema),z.lazy(() => PartnerSchoolWhereInputSchema).array() ]).optional(),
  google_account_config: z.union([ z.lazy(() => SchoolAccountConfigNullableScalarRelationFilterSchema),z.lazy(() => SchoolAccountConfigWhereInputSchema) ]).optional().nullable(),
  students: z.lazy(() => StudentMemberListRelationFilterSchema).optional()
}).strict());

export const PartnerSchoolOrderByWithAggregationInputSchema: z.ZodType<Prisma.PartnerSchoolOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional(),
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
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  primary_email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountListRelationFilterSchema).optional(),
  devices: z.lazy(() => UserDeviceListRelationFilterSchema).optional(),
  member: z.union([ z.lazy(() => StudentMemberNullableScalarRelationFilterSchema),z.lazy(() => StudentMemberWhereInputSchema) ]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  primary_email: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  federated_accounts: z.lazy(() => FederatedAccountOrderByRelationAggregateInputSchema).optional(),
  devices: z.lazy(() => UserDeviceOrderByRelationAggregateInputSchema).optional(),
  member: z.lazy(() => StudentMemberOrderByWithRelationInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    primary_email: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    primary_email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  primary_email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountListRelationFilterSchema).optional(),
  devices: z.lazy(() => UserDeviceListRelationFilterSchema).optional(),
  member: z.union([ z.lazy(() => StudentMemberNullableScalarRelationFilterSchema),z.lazy(() => StudentMemberWhereInputSchema) ]).optional().nullable(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  primary_email: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  primary_email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserDeviceWhereInputSchema: z.ZodType<Prisma.UserDeviceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserDeviceWhereInputSchema),z.lazy(() => UserDeviceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserDeviceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserDeviceWhereInputSchema),z.lazy(() => UserDeviceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDeviceTypeFilterSchema),z.lazy(() => DeviceTypeSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => EnumDeviceOperatingSystemFilterSchema),z.lazy(() => DeviceOperatingSystemSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  login_activities: z.lazy(() => LoginActivityListRelationFilterSchema).optional()
}).strict();

export const UserDeviceOrderByWithRelationInputSchema: z.ZodType<Prisma.UserDeviceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  operating_system: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  login_activities: z.lazy(() => LoginActivityOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserDeviceWhereUniqueInputSchema: z.ZodType<Prisma.UserDeviceWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => UserDeviceWhereInputSchema),z.lazy(() => UserDeviceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserDeviceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserDeviceWhereInputSchema),z.lazy(() => UserDeviceWhereInputSchema).array() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDeviceTypeFilterSchema),z.lazy(() => DeviceTypeSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => EnumDeviceOperatingSystemFilterSchema),z.lazy(() => DeviceOperatingSystemSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  login_activities: z.lazy(() => LoginActivityListRelationFilterSchema).optional()
}).strict());

export const UserDeviceOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserDeviceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  operating_system: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserDeviceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserDeviceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserDeviceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserDeviceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserDeviceSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserDeviceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserDeviceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserDeviceScalarWhereWithAggregatesInputSchema),z.lazy(() => UserDeviceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserDeviceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserDeviceScalarWhereWithAggregatesInputSchema),z.lazy(() => UserDeviceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  user_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDeviceTypeWithAggregatesFilterSchema),z.lazy(() => DeviceTypeSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => EnumDeviceOperatingSystemWithAggregatesFilterSchema),z.lazy(() => DeviceOperatingSystemSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FederatedAccountCreateInputSchema: z.ZodType<Prisma.FederatedAccountCreateInput> = z.object({
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutFederated_accountsInputSchema)
}).strict();

export const FederatedAccountUncheckedCreateInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string(),
  user_id: z.number().int()
}).strict();

export const FederatedAccountUpdateInputSchema: z.ZodType<Prisma.FederatedAccountUpdateInput> = z.object({
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFederated_accountsNestedInputSchema).optional()
}).strict();

export const FederatedAccountUncheckedUpdateInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FederatedAccountCreateManyInputSchema: z.ZodType<Prisma.FederatedAccountCreateManyInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string(),
  user_id: z.number().int()
}).strict();

export const FederatedAccountUpdateManyMutationInputSchema: z.ZodType<Prisma.FederatedAccountUpdateManyMutationInput> = z.object({
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FederatedAccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigCreateInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateInput> = z.object({
  username_format: z.string(),
  student_username_format: z.string(),
  password_format: z.string(),
  domain_name: z.string(),
  school: z.lazy(() => PartnerSchoolCreateNestedOneWithoutGoogle_account_configInputSchema)
}).strict();

export const SchoolAccountConfigUncheckedCreateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedCreateInput> = z.object({
  username_format: z.string(),
  student_username_format: z.string(),
  password_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int()
}).strict();

export const SchoolAccountConfigUpdateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInputSchema).optional()
}).strict();

export const SchoolAccountConfigUncheckedUpdateInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigCreateManyInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateManyInput> = z.object({
  username_format: z.string(),
  student_username_format: z.string(),
  password_format: z.string(),
  domain_name: z.string(),
  school_id: z.number().int()
}).strict();

export const SchoolAccountConfigUpdateManyMutationInputSchema: z.ZodType<Prisma.SchoolAccountConfigUpdateManyMutationInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateManyInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityCreateInputSchema: z.ZodType<Prisma.LoginActivityCreateInput> = z.object({
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean(),
  device: z.lazy(() => UserDeviceCreateNestedOneWithoutLogin_activitiesInputSchema)
}).strict();

export const LoginActivityUncheckedCreateInputSchema: z.ZodType<Prisma.LoginActivityUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  device_id: z.number().int(),
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean()
}).strict();

export const LoginActivityUpdateInputSchema: z.ZodType<Prisma.LoginActivityUpdateInput> = z.object({
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  device: z.lazy(() => UserDeviceUpdateOneRequiredWithoutLogin_activitiesNestedInputSchema).optional()
}).strict();

export const LoginActivityUncheckedUpdateInputSchema: z.ZodType<Prisma.LoginActivityUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  device_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityCreateManyInputSchema: z.ZodType<Prisma.LoginActivityCreateManyInput> = z.object({
  id: z.number().int().optional(),
  device_id: z.number().int(),
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean()
}).strict();

export const LoginActivityUpdateManyMutationInputSchema: z.ZodType<Prisma.LoginActivityUpdateManyMutationInput> = z.object({
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LoginActivityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  device_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SystemConfigurationUpdatesCreateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCreateInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  service_status: z.lazy(() => SystemServiceStatusSchema),
  contract_start_date: z.coerce.date(),
  contract_end_date: z.coerce.date()
}).strict();

export const SystemConfigurationUpdatesUncheckedCreateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUncheckedCreateInput> = z.object({
  id: z.number().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  service_status: z.lazy(() => SystemServiceStatusSchema),
  contract_start_date: z.coerce.date(),
  contract_end_date: z.coerce.date()
}).strict();

export const SystemConfigurationUpdatesUpdateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUpdateInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  service_status: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => EnumSystemServiceStatusFieldUpdateOperationsInputSchema) ]).optional(),
  contract_start_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contract_end_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SystemConfigurationUpdatesUncheckedUpdateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUncheckedUpdateInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  service_status: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => EnumSystemServiceStatusFieldUpdateOperationsInputSchema) ]).optional(),
  contract_start_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contract_end_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SystemConfigurationUpdatesCreateManyInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCreateManyInput> = z.object({
  id: z.number().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  service_status: z.lazy(() => SystemServiceStatusSchema),
  contract_start_date: z.coerce.date(),
  contract_end_date: z.coerce.date()
}).strict();

export const SystemConfigurationUpdatesUpdateManyMutationInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUpdateManyMutationInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  service_status: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => EnumSystemServiceStatusFieldUpdateOperationsInputSchema) ]).optional(),
  contract_start_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contract_end_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SystemConfigurationUpdatesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  service_status: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => EnumSystemServiceStatusFieldUpdateOperationsInputSchema) ]).optional(),
  contract_start_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contract_end_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StudentMemberCreateInputSchema: z.ZodType<Prisma.StudentMemberCreateInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolCreateNestedOneWithoutStudentsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutMemberInputSchema)
}).strict();

export const StudentMemberUncheckedCreateInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  user_id: z.number().int(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable()
}).strict();

export const StudentMemberUpdateInputSchema: z.ZodType<Prisma.StudentMemberUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StudentMemberCreateManyInputSchema: z.ZodType<Prisma.StudentMemberCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  user_id: z.number().int(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable()
}).strict();

export const StudentMemberUpdateManyMutationInputSchema: z.ZodType<Prisma.StudentMemberUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StudentMemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PartnerSchoolCreateInputSchema: z.ZodType<Prisma.PartnerSchoolCreateInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  google_account_config: z.lazy(() => SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema).optional(),
  students: z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const PartnerSchoolCreateManyInputSchema: z.ZodType<Prisma.PartnerSchoolCreateManyInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string()
}).strict();

export const PartnerSchoolUpdateManyMutationInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateManyMutationInput> = z.object({
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountCreateNestedManyWithoutUserInputSchema).optional(),
  devices: z.lazy(() => UserDeviceCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUpdateManyWithoutUserNestedInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserDeviceCreateInputSchema: z.ZodType<Prisma.UserDeviceCreateInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDevicesInputSchema),
  login_activities: z.lazy(() => LoginActivityCreateNestedManyWithoutDeviceInputSchema).optional()
}).strict();

export const UserDeviceUncheckedCreateInputSchema: z.ZodType<Prisma.UserDeviceUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int(),
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  login_activities: z.lazy(() => LoginActivityUncheckedCreateNestedManyWithoutDeviceInputSchema).optional()
}).strict();

export const UserDeviceUpdateInputSchema: z.ZodType<Prisma.UserDeviceUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDevicesNestedInputSchema).optional(),
  login_activities: z.lazy(() => LoginActivityUpdateManyWithoutDeviceNestedInputSchema).optional()
}).strict();

export const UserDeviceUncheckedUpdateInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  login_activities: z.lazy(() => LoginActivityUncheckedUpdateManyWithoutDeviceNestedInputSchema).optional()
}).strict();

export const UserDeviceCreateManyInputSchema: z.ZodType<Prisma.UserDeviceCreateManyInput> = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int(),
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();

export const UserDeviceUpdateManyMutationInputSchema: z.ZodType<Prisma.UserDeviceUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserDeviceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const EnumFederatedProviderFilterSchema: z.ZodType<Prisma.EnumFederatedProviderFilter> = z.object({
  equals: z.lazy(() => FederatedProviderSchema).optional(),
  in: z.lazy(() => FederatedProviderSchema).array().optional(),
  notIn: z.lazy(() => FederatedProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => NestedEnumFederatedProviderFilterSchema) ]).optional(),
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

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const FederatedAccountUnique_provider_identifierCompoundUniqueInputSchema: z.ZodType<Prisma.FederatedAccountUnique_provider_identifierCompoundUniqueInput> = z.object({
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string()
}).strict();

export const FederatedAccountUnique_provider_userCompoundUniqueInputSchema: z.ZodType<Prisma.FederatedAccountUnique_provider_userCompoundUniqueInput> = z.object({
  provider: z.lazy(() => FederatedProviderSchema),
  user_id: z.number()
}).strict();

export const FederatedAccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.FederatedAccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  provider_identifier: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FederatedAccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FederatedAccountAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FederatedAccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FederatedAccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  provider_identifier: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FederatedAccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.FederatedAccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  provider_identifier: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FederatedAccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.FederatedAccountSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
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

export const EnumFederatedProviderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumFederatedProviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FederatedProviderSchema).optional(),
  in: z.lazy(() => FederatedProviderSchema).array().optional(),
  notIn: z.lazy(() => FederatedProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => NestedEnumFederatedProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFederatedProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFederatedProviderFilterSchema).optional()
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

export const PartnerSchoolScalarRelationFilterSchema: z.ZodType<Prisma.PartnerSchoolScalarRelationFilter> = z.object({
  is: z.lazy(() => PartnerSchoolWhereInputSchema).optional(),
  isNot: z.lazy(() => PartnerSchoolWhereInputSchema).optional()
}).strict();

export const SchoolAccountConfigCountOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigCountOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  student_username_format: z.lazy(() => SortOrderSchema).optional(),
  password_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigAvgOrderByAggregateInput> = z.object({
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigMaxOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  student_username_format: z.lazy(() => SortOrderSchema).optional(),
  password_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigMinOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigMinOrderByAggregateInput> = z.object({
  username_format: z.lazy(() => SortOrderSchema).optional(),
  student_username_format: z.lazy(() => SortOrderSchema).optional(),
  password_format: z.lazy(() => SortOrderSchema).optional(),
  domain_name: z.lazy(() => SortOrderSchema).optional(),
  school_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SchoolAccountConfigSumOrderByAggregateInputSchema: z.ZodType<Prisma.SchoolAccountConfigSumOrderByAggregateInput> = z.object({
  school_id: z.lazy(() => SortOrderSchema).optional()
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

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const UserDeviceScalarRelationFilterSchema: z.ZodType<Prisma.UserDeviceScalarRelationFilter> = z.object({
  is: z.lazy(() => UserDeviceWhereInputSchema).optional(),
  isNot: z.lazy(() => UserDeviceWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const LoginActivityCountOrderByAggregateInputSchema: z.ZodType<Prisma.LoginActivityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional(),
  ip_address: z.lazy(() => SortOrderSchema).optional(),
  login_time: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LoginActivityAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LoginActivityAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LoginActivityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LoginActivityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional(),
  ip_address: z.lazy(() => SortOrderSchema).optional(),
  login_time: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LoginActivityMinOrderByAggregateInputSchema: z.ZodType<Prisma.LoginActivityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional(),
  ip_address: z.lazy(() => SortOrderSchema).optional(),
  login_time: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LoginActivitySumOrderByAggregateInputSchema: z.ZodType<Prisma.LoginActivitySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  device_id: z.lazy(() => SortOrderSchema).optional()
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

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const EnumSystemServiceStatusFilterSchema: z.ZodType<Prisma.EnumSystemServiceStatusFilter> = z.object({
  equals: z.lazy(() => SystemServiceStatusSchema).optional(),
  in: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  notIn: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => NestedEnumSystemServiceStatusFilterSchema) ]).optional(),
}).strict();

export const SystemConfigurationUpdatesCountOrderByAggregateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  service_status: z.lazy(() => SortOrderSchema).optional(),
  contract_start_date: z.lazy(() => SortOrderSchema).optional(),
  contract_end_date: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SystemConfigurationUpdatesAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SystemConfigurationUpdatesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  service_status: z.lazy(() => SortOrderSchema).optional(),
  contract_start_date: z.lazy(() => SortOrderSchema).optional(),
  contract_end_date: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SystemConfigurationUpdatesMinOrderByAggregateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  service_status: z.lazy(() => SortOrderSchema).optional(),
  contract_start_date: z.lazy(() => SortOrderSchema).optional(),
  contract_end_date: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SystemConfigurationUpdatesSumOrderByAggregateInputSchema: z.ZodType<Prisma.SystemConfigurationUpdatesSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSystemServiceStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSystemServiceStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SystemServiceStatusSchema).optional(),
  in: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  notIn: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => NestedEnumSystemServiceStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSystemServiceStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSystemServiceStatusFilterSchema).optional()
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

export const StudentMemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  student_id_hash: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  expired_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberAvgOrderByAggregateInput> = z.object({
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  student_id_hash: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  expired_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  student_id_hash: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  activated_at: z.lazy(() => SortOrderSchema).optional(),
  expired_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StudentMemberSumOrderByAggregateInputSchema: z.ZodType<Prisma.StudentMemberSumOrderByAggregateInput> = z.object({
  school_attended_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
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

export const SchoolAccountConfigNullableScalarRelationFilterSchema: z.ZodType<Prisma.SchoolAccountConfigNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SchoolAccountConfigWhereInputSchema).optional().nullable()
}).strict();

export const StudentMemberListRelationFilterSchema: z.ZodType<Prisma.StudentMemberListRelationFilter> = z.object({
  every: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  some: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  none: z.lazy(() => StudentMemberWhereInputSchema).optional()
}).strict();

export const StudentMemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StudentMemberOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolCountOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolMinOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  short_name: z.lazy(() => SortOrderSchema).optional(),
  full_name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartnerSchoolSumOrderByAggregateInputSchema: z.ZodType<Prisma.PartnerSchoolSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FederatedAccountListRelationFilterSchema: z.ZodType<Prisma.FederatedAccountListRelationFilter> = z.object({
  every: z.lazy(() => FederatedAccountWhereInputSchema).optional(),
  some: z.lazy(() => FederatedAccountWhereInputSchema).optional(),
  none: z.lazy(() => FederatedAccountWhereInputSchema).optional()
}).strict();

export const UserDeviceListRelationFilterSchema: z.ZodType<Prisma.UserDeviceListRelationFilter> = z.object({
  every: z.lazy(() => UserDeviceWhereInputSchema).optional(),
  some: z.lazy(() => UserDeviceWhereInputSchema).optional(),
  none: z.lazy(() => UserDeviceWhereInputSchema).optional()
}).strict();

export const StudentMemberNullableScalarRelationFilterSchema: z.ZodType<Prisma.StudentMemberNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => StudentMemberWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StudentMemberWhereInputSchema).optional().nullable()
}).strict();

export const FederatedAccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FederatedAccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserDeviceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  primary_email: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  primary_email: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  primary_email: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDeviceTypeFilterSchema: z.ZodType<Prisma.EnumDeviceTypeFilter> = z.object({
  equals: z.lazy(() => DeviceTypeSchema).optional(),
  in: z.lazy(() => DeviceTypeSchema).array().optional(),
  notIn: z.lazy(() => DeviceTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => NestedEnumDeviceTypeFilterSchema) ]).optional(),
}).strict();

export const EnumDeviceOperatingSystemFilterSchema: z.ZodType<Prisma.EnumDeviceOperatingSystemFilter> = z.object({
  equals: z.lazy(() => DeviceOperatingSystemSchema).optional(),
  in: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  notIn: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema) ]).optional(),
}).strict();

export const LoginActivityListRelationFilterSchema: z.ZodType<Prisma.LoginActivityListRelationFilter> = z.object({
  every: z.lazy(() => LoginActivityWhereInputSchema).optional(),
  some: z.lazy(() => LoginActivityWhereInputSchema).optional(),
  none: z.lazy(() => LoginActivityWhereInputSchema).optional()
}).strict();

export const LoginActivityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LoginActivityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserDeviceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  operating_system: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserDeviceAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserDeviceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  operating_system: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserDeviceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  operating_system: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserDeviceSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserDeviceSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDeviceTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDeviceTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DeviceTypeSchema).optional(),
  in: z.lazy(() => DeviceTypeSchema).array().optional(),
  notIn: z.lazy(() => DeviceTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => NestedEnumDeviceTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeviceTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeviceTypeFilterSchema).optional()
}).strict();

export const EnumDeviceOperatingSystemWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDeviceOperatingSystemWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DeviceOperatingSystemSchema).optional(),
  in: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  notIn: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => NestedEnumDeviceOperatingSystemWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFederated_accountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFederated_accountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFederated_accountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumFederatedProviderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumFederatedProviderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => FederatedProviderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const UserUpdateOneRequiredWithoutFederated_accountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFederated_accountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFederated_accountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFederated_accountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFederated_accountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFederated_accountsInputSchema),z.lazy(() => UserUpdateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFederated_accountsInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const PartnerSchoolCreateNestedOneWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolCreateNestedOneWithoutGoogle_account_configInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutGoogle_account_configInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional()
}).strict();

export const PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInputSchema: z.ZodType<Prisma.PartnerSchoolUpdateOneRequiredWithoutGoogle_account_configNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutGoogle_account_configInputSchema).optional(),
  upsert: z.lazy(() => PartnerSchoolUpsertWithoutGoogle_account_configInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PartnerSchoolUpdateToOneWithWhereWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUpdateWithoutGoogle_account_configInputSchema),z.lazy(() => PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema) ]).optional(),
}).strict();

export const UserDeviceCreateNestedOneWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceCreateNestedOneWithoutLogin_activitiesInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutLogin_activitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserDeviceCreateOrConnectWithoutLogin_activitiesInputSchema).optional(),
  connect: z.lazy(() => UserDeviceWhereUniqueInputSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const UserDeviceUpdateOneRequiredWithoutLogin_activitiesNestedInputSchema: z.ZodType<Prisma.UserDeviceUpdateOneRequiredWithoutLogin_activitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutLogin_activitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserDeviceCreateOrConnectWithoutLogin_activitiesInputSchema).optional(),
  upsert: z.lazy(() => UserDeviceUpsertWithoutLogin_activitiesInputSchema).optional(),
  connect: z.lazy(() => UserDeviceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserDeviceUpdateToOneWithWhereWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUpdateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedUpdateWithoutLogin_activitiesInputSchema) ]).optional(),
}).strict();

export const EnumSystemServiceStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSystemServiceStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SystemServiceStatusSchema).optional()
}).strict();

export const PartnerSchoolCreateNestedOneWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateNestedOneWithoutStudentsInput> = z.object({
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PartnerSchoolCreateOrConnectWithoutStudentsInputSchema).optional(),
  connect: z.lazy(() => PartnerSchoolWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutMemberInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMemberInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
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

export const UserUpdateOneRequiredWithoutMemberNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMemberNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMemberInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMemberInputSchema),z.lazy(() => UserUpdateWithoutMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMemberInputSchema) ]).optional(),
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

export const FederatedAccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateWithoutUserInputSchema).array(),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FederatedAccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserDeviceCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceCreateWithoutUserInputSchema).array(),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserDeviceCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StudentMemberCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional()
}).strict();

export const FederatedAccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateWithoutUserInputSchema).array(),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FederatedAccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserDeviceUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceCreateWithoutUserInputSchema).array(),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserDeviceCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StudentMemberUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional()
}).strict();

export const FederatedAccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FederatedAccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateWithoutUserInputSchema).array(),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FederatedAccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FederatedAccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FederatedAccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FederatedAccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FederatedAccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FederatedAccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FederatedAccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FederatedAccountScalarWhereInputSchema),z.lazy(() => FederatedAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserDeviceUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserDeviceUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceCreateWithoutUserInputSchema).array(),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserDeviceUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserDeviceUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserDeviceCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserDeviceUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserDeviceUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserDeviceUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserDeviceUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserDeviceScalarWhereInputSchema),z.lazy(() => UserDeviceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StudentMemberUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.StudentMemberUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => StudentMemberUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StudentMemberUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => StudentMemberUpdateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const FederatedAccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateWithoutUserInputSchema).array(),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => FederatedAccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FederatedAccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FederatedAccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FederatedAccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FederatedAccountWhereUniqueInputSchema),z.lazy(() => FederatedAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FederatedAccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FederatedAccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FederatedAccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FederatedAccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FederatedAccountScalarWhereInputSchema),z.lazy(() => FederatedAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserDeviceUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceCreateWithoutUserInputSchema).array(),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserDeviceCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserDeviceUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserDeviceUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserDeviceCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserDeviceWhereUniqueInputSchema),z.lazy(() => UserDeviceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserDeviceUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserDeviceUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserDeviceUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserDeviceUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserDeviceScalarWhereInputSchema),z.lazy(() => UserDeviceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StudentMemberUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StudentMemberCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => StudentMemberUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StudentMemberWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StudentMemberWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StudentMemberUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => StudentMemberUpdateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutDevicesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDevicesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedCreateWithoutDevicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDevicesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const LoginActivityCreateNestedManyWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityCreateNestedManyWithoutDeviceInput> = z.object({
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema).array(),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LoginActivityCreateManyDeviceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LoginActivityUncheckedCreateNestedManyWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUncheckedCreateNestedManyWithoutDeviceInput> = z.object({
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema).array(),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LoginActivityCreateManyDeviceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumDeviceTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDeviceTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DeviceTypeSchema).optional()
}).strict();

export const EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDeviceOperatingSystemFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DeviceOperatingSystemSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutDevicesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDevicesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedCreateWithoutDevicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDevicesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDevicesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDevicesInputSchema),z.lazy(() => UserUpdateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDevicesInputSchema) ]).optional(),
}).strict();

export const LoginActivityUpdateManyWithoutDeviceNestedInputSchema: z.ZodType<Prisma.LoginActivityUpdateManyWithoutDeviceNestedInput> = z.object({
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema).array(),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LoginActivityUpsertWithWhereUniqueWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpsertWithWhereUniqueWithoutDeviceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LoginActivityCreateManyDeviceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LoginActivityUpdateWithWhereUniqueWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpdateWithWhereUniqueWithoutDeviceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LoginActivityUpdateManyWithWhereWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpdateManyWithWhereWithoutDeviceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LoginActivityScalarWhereInputSchema),z.lazy(() => LoginActivityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LoginActivityUncheckedUpdateManyWithoutDeviceNestedInputSchema: z.ZodType<Prisma.LoginActivityUncheckedUpdateManyWithoutDeviceNestedInput> = z.object({
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema).array(),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema),z.lazy(() => LoginActivityCreateOrConnectWithoutDeviceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LoginActivityUpsertWithWhereUniqueWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpsertWithWhereUniqueWithoutDeviceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LoginActivityCreateManyDeviceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LoginActivityWhereUniqueInputSchema),z.lazy(() => LoginActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LoginActivityUpdateWithWhereUniqueWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpdateWithWhereUniqueWithoutDeviceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LoginActivityUpdateManyWithWhereWithoutDeviceInputSchema),z.lazy(() => LoginActivityUpdateManyWithWhereWithoutDeviceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LoginActivityScalarWhereInputSchema),z.lazy(() => LoginActivityScalarWhereInputSchema).array() ]).optional(),
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

export const NestedEnumFederatedProviderFilterSchema: z.ZodType<Prisma.NestedEnumFederatedProviderFilter> = z.object({
  equals: z.lazy(() => FederatedProviderSchema).optional(),
  in: z.lazy(() => FederatedProviderSchema).array().optional(),
  notIn: z.lazy(() => FederatedProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => NestedEnumFederatedProviderFilterSchema) ]).optional(),
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

export const NestedEnumFederatedProviderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumFederatedProviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FederatedProviderSchema).optional(),
  in: z.lazy(() => FederatedProviderSchema).array().optional(),
  notIn: z.lazy(() => FederatedProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => NestedEnumFederatedProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFederatedProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFederatedProviderFilterSchema).optional()
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

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
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

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumSystemServiceStatusFilterSchema: z.ZodType<Prisma.NestedEnumSystemServiceStatusFilter> = z.object({
  equals: z.lazy(() => SystemServiceStatusSchema).optional(),
  in: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  notIn: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => NestedEnumSystemServiceStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSystemServiceStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSystemServiceStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SystemServiceStatusSchema).optional(),
  in: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  notIn: z.lazy(() => SystemServiceStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SystemServiceStatusSchema),z.lazy(() => NestedEnumSystemServiceStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSystemServiceStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSystemServiceStatusFilterSchema).optional()
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

export const NestedEnumDeviceTypeFilterSchema: z.ZodType<Prisma.NestedEnumDeviceTypeFilter> = z.object({
  equals: z.lazy(() => DeviceTypeSchema).optional(),
  in: z.lazy(() => DeviceTypeSchema).array().optional(),
  notIn: z.lazy(() => DeviceTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => NestedEnumDeviceTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDeviceOperatingSystemFilterSchema: z.ZodType<Prisma.NestedEnumDeviceOperatingSystemFilter> = z.object({
  equals: z.lazy(() => DeviceOperatingSystemSchema).optional(),
  in: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  notIn: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDeviceTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDeviceTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DeviceTypeSchema).optional(),
  in: z.lazy(() => DeviceTypeSchema).array().optional(),
  notIn: z.lazy(() => DeviceTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => NestedEnumDeviceTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeviceTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeviceTypeFilterSchema).optional()
}).strict();

export const NestedEnumDeviceOperatingSystemWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDeviceOperatingSystemWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DeviceOperatingSystemSchema).optional(),
  in: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  notIn: z.lazy(() => DeviceOperatingSystemSchema).array().optional(),
  not: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => NestedEnumDeviceOperatingSystemWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeviceOperatingSystemFilterSchema).optional()
}).strict();

export const UserCreateWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserCreateWithoutFederated_accountsInput> = z.object({
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  devices: z.lazy(() => UserDeviceCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFederated_accountsInput> = z.object({
  id: z.number().int().optional(),
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  devices: z.lazy(() => UserDeviceUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFederated_accountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFederated_accountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutFederated_accountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFederated_accountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFederated_accountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFederated_accountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFederated_accountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFederated_accountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutFederated_accountsInput> = z.object({
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  devices: z.lazy(() => UserDeviceUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFederated_accountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFederated_accountsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  devices: z.lazy(() => UserDeviceUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const PartnerSchoolCreateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolCreateWithoutGoogle_account_configInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  students: z.lazy(() => StudentMemberCreateNestedManyWithoutSchool_attendedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateWithoutGoogle_account_configInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  students: z.lazy(() => StudentMemberUncheckedCreateNestedManyWithoutSchool_attendedInputSchema).optional()
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
  students: z.lazy(() => StudentMemberUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateWithoutGoogle_account_configInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  students: z.lazy(() => StudentMemberUncheckedUpdateManyWithoutSchool_attendedNestedInputSchema).optional()
}).strict();

export const UserDeviceCreateWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceCreateWithoutLogin_activitiesInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDevicesInputSchema)
}).strict();

export const UserDeviceUncheckedCreateWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceUncheckedCreateWithoutLogin_activitiesInput> = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int(),
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();

export const UserDeviceCreateOrConnectWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceCreateOrConnectWithoutLogin_activitiesInput> = z.object({
  where: z.lazy(() => UserDeviceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutLogin_activitiesInputSchema) ]),
}).strict();

export const UserDeviceUpsertWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceUpsertWithoutLogin_activitiesInput> = z.object({
  update: z.union([ z.lazy(() => UserDeviceUpdateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedUpdateWithoutLogin_activitiesInputSchema) ]),
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutLogin_activitiesInputSchema) ]),
  where: z.lazy(() => UserDeviceWhereInputSchema).optional()
}).strict();

export const UserDeviceUpdateToOneWithWhereWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceUpdateToOneWithWhereWithoutLogin_activitiesInput> = z.object({
  where: z.lazy(() => UserDeviceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserDeviceUpdateWithoutLogin_activitiesInputSchema),z.lazy(() => UserDeviceUncheckedUpdateWithoutLogin_activitiesInputSchema) ]),
}).strict();

export const UserDeviceUpdateWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceUpdateWithoutLogin_activitiesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDevicesNestedInputSchema).optional()
}).strict();

export const UserDeviceUncheckedUpdateWithoutLogin_activitiesInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateWithoutLogin_activitiesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartnerSchoolCreateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateWithoutStudentsInput> = z.object({
  short_name: z.string(),
  full_name: z.string(),
  google_account_config: z.lazy(() => SchoolAccountConfigCreateNestedOneWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedCreateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedCreateWithoutStudentsInput> = z.object({
  id: z.number().int().optional(),
  short_name: z.string(),
  full_name: z.string(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedCreateNestedOneWithoutSchoolInputSchema).optional()
}).strict();

export const PartnerSchoolCreateOrConnectWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolCreateOrConnectWithoutStudentsInput> = z.object({
  where: z.lazy(() => PartnerSchoolWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartnerSchoolCreateWithoutStudentsInputSchema),z.lazy(() => PartnerSchoolUncheckedCreateWithoutStudentsInputSchema) ]),
}).strict();

export const UserCreateWithoutMemberInputSchema: z.ZodType<Prisma.UserCreateWithoutMemberInput> = z.object({
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountCreateNestedManyWithoutUserInputSchema).optional(),
  devices: z.lazy(() => UserDeviceCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMemberInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMemberInput> = z.object({
  id: z.number().int().optional(),
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMemberInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMemberInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutMemberInputSchema) ]),
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
  google_account_config: z.lazy(() => SchoolAccountConfigUpdateOneWithoutSchoolNestedInputSchema).optional()
}).strict();

export const PartnerSchoolUncheckedUpdateWithoutStudentsInputSchema: z.ZodType<Prisma.PartnerSchoolUncheckedUpdateWithoutStudentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  short_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  full_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  google_account_config: z.lazy(() => SchoolAccountConfigUncheckedUpdateOneWithoutSchoolNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutMemberInputSchema: z.ZodType<Prisma.UserUpsertWithoutMemberInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMemberInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutMemberInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMemberInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMemberInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMemberInputSchema) ]),
}).strict();

export const UserUpdateWithoutMemberInputSchema: z.ZodType<Prisma.UserUpdateWithoutMemberInput> = z.object({
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUpdateManyWithoutUserNestedInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMemberInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMemberInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  devices: z.lazy(() => UserDeviceUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const SchoolAccountConfigCreateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateWithoutSchoolInput> = z.object({
  username_format: z.string(),
  student_username_format: z.string(),
  password_format: z.string(),
  domain_name: z.string()
}).strict();

export const SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedCreateWithoutSchoolInput> = z.object({
  username_format: z.string(),
  student_username_format: z.string(),
  password_format: z.string(),
  domain_name: z.string()
}).strict();

export const SchoolAccountConfigCreateOrConnectWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigCreateOrConnectWithoutSchoolInput> = z.object({
  where: z.lazy(() => SchoolAccountConfigWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SchoolAccountConfigCreateWithoutSchoolInputSchema),z.lazy(() => SchoolAccountConfigUncheckedCreateWithoutSchoolInputSchema) ]),
}).strict();

export const StudentMemberCreateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateWithoutSchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutMemberInputSchema)
}).strict();

export const StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateWithoutSchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  user_id: z.number().int(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable()
}).strict();

export const StudentMemberCreateOrConnectWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateOrConnectWithoutSchool_attendedInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutSchool_attendedInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutSchool_attendedInputSchema) ]),
}).strict();

export const StudentMemberCreateManySchool_attendedInputEnvelopeSchema: z.ZodType<Prisma.StudentMemberCreateManySchool_attendedInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StudentMemberCreateManySchool_attendedInputSchema),z.lazy(() => StudentMemberCreateManySchool_attendedInputSchema).array() ]),
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
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SchoolAccountConfigUncheckedUpdateWithoutSchoolInputSchema: z.ZodType<Prisma.SchoolAccountConfigUncheckedUpdateWithoutSchoolInput> = z.object({
  username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  student_username_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  nickname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  student_id_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password_hash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  activated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  expired_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const FederatedAccountCreateWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountCreateWithoutUserInput> = z.object({
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string()
}).strict();

export const FederatedAccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string()
}).strict();

export const FederatedAccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => FederatedAccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FederatedAccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FederatedAccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FederatedAccountCreateManyUserInputSchema),z.lazy(() => FederatedAccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserDeviceCreateWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceCreateWithoutUserInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  login_activities: z.lazy(() => LoginActivityCreateNestedManyWithoutDeviceInputSchema).optional()
}).strict();

export const UserDeviceUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  login_activities: z.lazy(() => LoginActivityUncheckedCreateNestedManyWithoutDeviceInputSchema).optional()
}).strict();

export const UserDeviceCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserDeviceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserDeviceCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserDeviceCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserDeviceCreateManyUserInputSchema),z.lazy(() => UserDeviceCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const StudentMemberCreateWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolCreateNestedOneWithoutStudentsInputSchema)
}).strict();

export const StudentMemberUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  school_attended_id: z.number().int(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable()
}).strict();

export const StudentMemberCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => StudentMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FederatedAccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FederatedAccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FederatedAccountUpdateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FederatedAccountCreateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FederatedAccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FederatedAccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FederatedAccountUpdateWithoutUserInputSchema),z.lazy(() => FederatedAccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const FederatedAccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => FederatedAccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FederatedAccountUpdateManyMutationInputSchema),z.lazy(() => FederatedAccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const FederatedAccountScalarWhereInputSchema: z.ZodType<Prisma.FederatedAccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FederatedAccountScalarWhereInputSchema),z.lazy(() => FederatedAccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FederatedAccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FederatedAccountScalarWhereInputSchema),z.lazy(() => FederatedAccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumFederatedProviderFilterSchema),z.lazy(() => FederatedProviderSchema) ]).optional(),
  provider_identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const UserDeviceUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserDeviceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserDeviceUpdateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserDeviceCreateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserDeviceUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserDeviceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserDeviceUpdateWithoutUserInputSchema),z.lazy(() => UserDeviceUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserDeviceUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserDeviceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserDeviceUpdateManyMutationInputSchema),z.lazy(() => UserDeviceUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserDeviceScalarWhereInputSchema: z.ZodType<Prisma.UserDeviceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserDeviceScalarWhereInputSchema),z.lazy(() => UserDeviceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserDeviceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserDeviceScalarWhereInputSchema),z.lazy(() => UserDeviceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDeviceTypeFilterSchema),z.lazy(() => DeviceTypeSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => EnumDeviceOperatingSystemFilterSchema),z.lazy(() => DeviceOperatingSystemSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const StudentMemberUpsertWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => StudentMemberUpdateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => StudentMemberCreateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => StudentMemberWhereInputSchema).optional()
}).strict();

export const StudentMemberUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => StudentMemberWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StudentMemberUpdateWithoutUserInputSchema),z.lazy(() => StudentMemberUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const StudentMemberUpdateWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  school_attended: z.lazy(() => PartnerSchoolUpdateOneRequiredWithoutStudentsNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  school_attended_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserCreateWithoutDevicesInputSchema: z.ZodType<Prisma.UserCreateWithoutDevicesInput> = z.object({
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDevicesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDevicesInput> = z.object({
  id: z.number().int().optional(),
  primary_email: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDevicesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDevicesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedCreateWithoutDevicesInputSchema) ]),
}).strict();

export const LoginActivityCreateWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityCreateWithoutDeviceInput> = z.object({
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean()
}).strict();

export const LoginActivityUncheckedCreateWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUncheckedCreateWithoutDeviceInput> = z.object({
  id: z.number().int().optional(),
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean()
}).strict();

export const LoginActivityCreateOrConnectWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityCreateOrConnectWithoutDeviceInput> = z.object({
  where: z.lazy(() => LoginActivityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema) ]),
}).strict();

export const LoginActivityCreateManyDeviceInputEnvelopeSchema: z.ZodType<Prisma.LoginActivityCreateManyDeviceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LoginActivityCreateManyDeviceInputSchema),z.lazy(() => LoginActivityCreateManyDeviceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutDevicesInputSchema: z.ZodType<Prisma.UserUpsertWithoutDevicesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDevicesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedCreateWithoutDevicesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDevicesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDevicesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDevicesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDevicesInputSchema) ]),
}).strict();

export const UserUpdateWithoutDevicesInputSchema: z.ZodType<Prisma.UserUpdateWithoutDevicesInput> = z.object({
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDevicesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDevicesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primary_email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  federated_accounts: z.lazy(() => FederatedAccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  member: z.lazy(() => StudentMemberUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const LoginActivityUpsertWithWhereUniqueWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUpsertWithWhereUniqueWithoutDeviceInput> = z.object({
  where: z.lazy(() => LoginActivityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LoginActivityUpdateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedUpdateWithoutDeviceInputSchema) ]),
  create: z.union([ z.lazy(() => LoginActivityCreateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedCreateWithoutDeviceInputSchema) ]),
}).strict();

export const LoginActivityUpdateWithWhereUniqueWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUpdateWithWhereUniqueWithoutDeviceInput> = z.object({
  where: z.lazy(() => LoginActivityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LoginActivityUpdateWithoutDeviceInputSchema),z.lazy(() => LoginActivityUncheckedUpdateWithoutDeviceInputSchema) ]),
}).strict();

export const LoginActivityUpdateManyWithWhereWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUpdateManyWithWhereWithoutDeviceInput> = z.object({
  where: z.lazy(() => LoginActivityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LoginActivityUpdateManyMutationInputSchema),z.lazy(() => LoginActivityUncheckedUpdateManyWithoutDeviceInputSchema) ]),
}).strict();

export const LoginActivityScalarWhereInputSchema: z.ZodType<Prisma.LoginActivityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LoginActivityScalarWhereInputSchema),z.lazy(() => LoginActivityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LoginActivityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LoginActivityScalarWhereInputSchema),z.lazy(() => LoginActivityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  device_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ip_address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  login_time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const StudentMemberCreateManySchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberCreateManySchool_attendedInput> = z.object({
  id: z.string().cuid().optional(),
  user_id: z.number().int(),
  nickname: z.string().optional().nullable(),
  student_id_hash: z.string().optional().nullable(),
  password_hash: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  activated_at: z.coerce.date().optional().nullable(),
  expired_at: z.coerce.date().optional().nullable()
}).strict();

export const StudentMemberUpdateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUpdateWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMemberNestedInputSchema).optional()
}).strict();

export const StudentMemberUncheckedUpdateWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StudentMemberUncheckedUpdateManyWithoutSchool_attendedInputSchema: z.ZodType<Prisma.StudentMemberUncheckedUpdateManyWithoutSchool_attendedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  student_id_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password_hash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expired_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FederatedAccountCreateManyUserInputSchema: z.ZodType<Prisma.FederatedAccountCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => FederatedProviderSchema),
  provider_identifier: z.string(),
  email: z.string()
}).strict();

export const UserDeviceCreateManyUserInputSchema: z.ZodType<Prisma.UserDeviceCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DeviceTypeSchema),
  operating_system: z.lazy(() => DeviceOperatingSystemSchema),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();

export const FederatedAccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUpdateWithoutUserInput> = z.object({
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FederatedAccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FederatedAccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FederatedAccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => FederatedProviderSchema),z.lazy(() => EnumFederatedProviderFieldUpdateOperationsInputSchema) ]).optional(),
  provider_identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserDeviceUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUpdateWithoutUserInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  login_activities: z.lazy(() => LoginActivityUpdateManyWithoutDeviceNestedInputSchema).optional()
}).strict();

export const UserDeviceUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  login_activities: z.lazy(() => LoginActivityUncheckedUpdateManyWithoutDeviceNestedInputSchema).optional()
}).strict();

export const UserDeviceUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserDeviceUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DeviceTypeSchema),z.lazy(() => EnumDeviceTypeFieldUpdateOperationsInputSchema) ]).optional(),
  operating_system: z.union([ z.lazy(() => DeviceOperatingSystemSchema),z.lazy(() => EnumDeviceOperatingSystemFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityCreateManyDeviceInputSchema: z.ZodType<Prisma.LoginActivityCreateManyDeviceInput> = z.object({
  id: z.number().int().optional(),
  ip_address: z.string().optional().nullable(),
  login_time: z.coerce.date().optional(),
  success: z.boolean()
}).strict();

export const LoginActivityUpdateWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUpdateWithoutDeviceInput> = z.object({
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityUncheckedUpdateWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUncheckedUpdateWithoutDeviceInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LoginActivityUncheckedUpdateManyWithoutDeviceInputSchema: z.ZodType<Prisma.LoginActivityUncheckedUpdateManyWithoutDeviceInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ip_address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  login_time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const FederatedAccountFindFirstArgsSchema: z.ZodType<Prisma.FederatedAccountFindFirstArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereInputSchema.optional(),
  orderBy: z.union([ FederatedAccountOrderByWithRelationInputSchema.array(),FederatedAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: FederatedAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FederatedAccountScalarFieldEnumSchema,FederatedAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FederatedAccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FederatedAccountFindFirstOrThrowArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereInputSchema.optional(),
  orderBy: z.union([ FederatedAccountOrderByWithRelationInputSchema.array(),FederatedAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: FederatedAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FederatedAccountScalarFieldEnumSchema,FederatedAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FederatedAccountFindManyArgsSchema: z.ZodType<Prisma.FederatedAccountFindManyArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereInputSchema.optional(),
  orderBy: z.union([ FederatedAccountOrderByWithRelationInputSchema.array(),FederatedAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: FederatedAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FederatedAccountScalarFieldEnumSchema,FederatedAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FederatedAccountAggregateArgsSchema: z.ZodType<Prisma.FederatedAccountAggregateArgs> = z.object({
  where: FederatedAccountWhereInputSchema.optional(),
  orderBy: z.union([ FederatedAccountOrderByWithRelationInputSchema.array(),FederatedAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: FederatedAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FederatedAccountGroupByArgsSchema: z.ZodType<Prisma.FederatedAccountGroupByArgs> = z.object({
  where: FederatedAccountWhereInputSchema.optional(),
  orderBy: z.union([ FederatedAccountOrderByWithAggregationInputSchema.array(),FederatedAccountOrderByWithAggregationInputSchema ]).optional(),
  by: FederatedAccountScalarFieldEnumSchema.array(),
  having: FederatedAccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FederatedAccountFindUniqueArgsSchema: z.ZodType<Prisma.FederatedAccountFindUniqueArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereUniqueInputSchema,
}).strict() ;

export const FederatedAccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FederatedAccountFindUniqueOrThrowArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereUniqueInputSchema,
}).strict() ;

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

export const LoginActivityFindFirstArgsSchema: z.ZodType<Prisma.LoginActivityFindFirstArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereInputSchema.optional(),
  orderBy: z.union([ LoginActivityOrderByWithRelationInputSchema.array(),LoginActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: LoginActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LoginActivityScalarFieldEnumSchema,LoginActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LoginActivityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LoginActivityFindFirstOrThrowArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereInputSchema.optional(),
  orderBy: z.union([ LoginActivityOrderByWithRelationInputSchema.array(),LoginActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: LoginActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LoginActivityScalarFieldEnumSchema,LoginActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LoginActivityFindManyArgsSchema: z.ZodType<Prisma.LoginActivityFindManyArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereInputSchema.optional(),
  orderBy: z.union([ LoginActivityOrderByWithRelationInputSchema.array(),LoginActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: LoginActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LoginActivityScalarFieldEnumSchema,LoginActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LoginActivityAggregateArgsSchema: z.ZodType<Prisma.LoginActivityAggregateArgs> = z.object({
  where: LoginActivityWhereInputSchema.optional(),
  orderBy: z.union([ LoginActivityOrderByWithRelationInputSchema.array(),LoginActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: LoginActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LoginActivityGroupByArgsSchema: z.ZodType<Prisma.LoginActivityGroupByArgs> = z.object({
  where: LoginActivityWhereInputSchema.optional(),
  orderBy: z.union([ LoginActivityOrderByWithAggregationInputSchema.array(),LoginActivityOrderByWithAggregationInputSchema ]).optional(),
  by: LoginActivityScalarFieldEnumSchema.array(),
  having: LoginActivityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LoginActivityFindUniqueArgsSchema: z.ZodType<Prisma.LoginActivityFindUniqueArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereUniqueInputSchema,
}).strict() ;

export const LoginActivityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LoginActivityFindUniqueOrThrowArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereUniqueInputSchema,
}).strict() ;

export const SystemConfigurationUpdatesFindFirstArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesFindFirstArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
  orderBy: z.union([ SystemConfigurationUpdatesOrderByWithRelationInputSchema.array(),SystemConfigurationUpdatesOrderByWithRelationInputSchema ]).optional(),
  cursor: SystemConfigurationUpdatesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SystemConfigurationUpdatesScalarFieldEnumSchema,SystemConfigurationUpdatesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SystemConfigurationUpdatesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesFindFirstOrThrowArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
  orderBy: z.union([ SystemConfigurationUpdatesOrderByWithRelationInputSchema.array(),SystemConfigurationUpdatesOrderByWithRelationInputSchema ]).optional(),
  cursor: SystemConfigurationUpdatesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SystemConfigurationUpdatesScalarFieldEnumSchema,SystemConfigurationUpdatesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SystemConfigurationUpdatesFindManyArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesFindManyArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
  orderBy: z.union([ SystemConfigurationUpdatesOrderByWithRelationInputSchema.array(),SystemConfigurationUpdatesOrderByWithRelationInputSchema ]).optional(),
  cursor: SystemConfigurationUpdatesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SystemConfigurationUpdatesScalarFieldEnumSchema,SystemConfigurationUpdatesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SystemConfigurationUpdatesAggregateArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesAggregateArgs> = z.object({
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
  orderBy: z.union([ SystemConfigurationUpdatesOrderByWithRelationInputSchema.array(),SystemConfigurationUpdatesOrderByWithRelationInputSchema ]).optional(),
  cursor: SystemConfigurationUpdatesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SystemConfigurationUpdatesGroupByArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesGroupByArgs> = z.object({
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
  orderBy: z.union([ SystemConfigurationUpdatesOrderByWithAggregationInputSchema.array(),SystemConfigurationUpdatesOrderByWithAggregationInputSchema ]).optional(),
  by: SystemConfigurationUpdatesScalarFieldEnumSchema.array(),
  having: SystemConfigurationUpdatesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SystemConfigurationUpdatesFindUniqueArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesFindUniqueArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereUniqueInputSchema,
}).strict() ;

export const SystemConfigurationUpdatesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesFindUniqueOrThrowArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereUniqueInputSchema,
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

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserDeviceFindFirstArgsSchema: z.ZodType<Prisma.UserDeviceFindFirstArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereInputSchema.optional(),
  orderBy: z.union([ UserDeviceOrderByWithRelationInputSchema.array(),UserDeviceOrderByWithRelationInputSchema ]).optional(),
  cursor: UserDeviceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserDeviceScalarFieldEnumSchema,UserDeviceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserDeviceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserDeviceFindFirstOrThrowArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereInputSchema.optional(),
  orderBy: z.union([ UserDeviceOrderByWithRelationInputSchema.array(),UserDeviceOrderByWithRelationInputSchema ]).optional(),
  cursor: UserDeviceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserDeviceScalarFieldEnumSchema,UserDeviceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserDeviceFindManyArgsSchema: z.ZodType<Prisma.UserDeviceFindManyArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereInputSchema.optional(),
  orderBy: z.union([ UserDeviceOrderByWithRelationInputSchema.array(),UserDeviceOrderByWithRelationInputSchema ]).optional(),
  cursor: UserDeviceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserDeviceScalarFieldEnumSchema,UserDeviceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserDeviceAggregateArgsSchema: z.ZodType<Prisma.UserDeviceAggregateArgs> = z.object({
  where: UserDeviceWhereInputSchema.optional(),
  orderBy: z.union([ UserDeviceOrderByWithRelationInputSchema.array(),UserDeviceOrderByWithRelationInputSchema ]).optional(),
  cursor: UserDeviceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserDeviceGroupByArgsSchema: z.ZodType<Prisma.UserDeviceGroupByArgs> = z.object({
  where: UserDeviceWhereInputSchema.optional(),
  orderBy: z.union([ UserDeviceOrderByWithAggregationInputSchema.array(),UserDeviceOrderByWithAggregationInputSchema ]).optional(),
  by: UserDeviceScalarFieldEnumSchema.array(),
  having: UserDeviceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserDeviceFindUniqueArgsSchema: z.ZodType<Prisma.UserDeviceFindUniqueArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereUniqueInputSchema,
}).strict() ;

export const UserDeviceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserDeviceFindUniqueOrThrowArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereUniqueInputSchema,
}).strict() ;

export const FederatedAccountCreateArgsSchema: z.ZodType<Prisma.FederatedAccountCreateArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  data: z.union([ FederatedAccountCreateInputSchema,FederatedAccountUncheckedCreateInputSchema ]),
}).strict() ;

export const FederatedAccountUpsertArgsSchema: z.ZodType<Prisma.FederatedAccountUpsertArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereUniqueInputSchema,
  create: z.union([ FederatedAccountCreateInputSchema,FederatedAccountUncheckedCreateInputSchema ]),
  update: z.union([ FederatedAccountUpdateInputSchema,FederatedAccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const FederatedAccountCreateManyArgsSchema: z.ZodType<Prisma.FederatedAccountCreateManyArgs> = z.object({
  data: z.union([ FederatedAccountCreateManyInputSchema,FederatedAccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FederatedAccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FederatedAccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ FederatedAccountCreateManyInputSchema,FederatedAccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FederatedAccountDeleteArgsSchema: z.ZodType<Prisma.FederatedAccountDeleteArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  where: FederatedAccountWhereUniqueInputSchema,
}).strict() ;

export const FederatedAccountUpdateArgsSchema: z.ZodType<Prisma.FederatedAccountUpdateArgs> = z.object({
  select: FederatedAccountSelectSchema.optional(),
  include: FederatedAccountIncludeSchema.optional(),
  data: z.union([ FederatedAccountUpdateInputSchema,FederatedAccountUncheckedUpdateInputSchema ]),
  where: FederatedAccountWhereUniqueInputSchema,
}).strict() ;

export const FederatedAccountUpdateManyArgsSchema: z.ZodType<Prisma.FederatedAccountUpdateManyArgs> = z.object({
  data: z.union([ FederatedAccountUpdateManyMutationInputSchema,FederatedAccountUncheckedUpdateManyInputSchema ]),
  where: FederatedAccountWhereInputSchema.optional(),
}).strict() ;

export const updateManyFederatedAccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyFederatedAccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ FederatedAccountUpdateManyMutationInputSchema,FederatedAccountUncheckedUpdateManyInputSchema ]),
  where: FederatedAccountWhereInputSchema.optional(),
}).strict() ;

export const FederatedAccountDeleteManyArgsSchema: z.ZodType<Prisma.FederatedAccountDeleteManyArgs> = z.object({
  where: FederatedAccountWhereInputSchema.optional(),
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

export const updateManySchoolAccountConfigCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManySchoolAccountConfigCreateManyAndReturnArgs> = z.object({
  data: z.union([ SchoolAccountConfigUpdateManyMutationInputSchema,SchoolAccountConfigUncheckedUpdateManyInputSchema ]),
  where: SchoolAccountConfigWhereInputSchema.optional(),
}).strict() ;

export const SchoolAccountConfigDeleteManyArgsSchema: z.ZodType<Prisma.SchoolAccountConfigDeleteManyArgs> = z.object({
  where: SchoolAccountConfigWhereInputSchema.optional(),
}).strict() ;

export const LoginActivityCreateArgsSchema: z.ZodType<Prisma.LoginActivityCreateArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  data: z.union([ LoginActivityCreateInputSchema,LoginActivityUncheckedCreateInputSchema ]),
}).strict() ;

export const LoginActivityUpsertArgsSchema: z.ZodType<Prisma.LoginActivityUpsertArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereUniqueInputSchema,
  create: z.union([ LoginActivityCreateInputSchema,LoginActivityUncheckedCreateInputSchema ]),
  update: z.union([ LoginActivityUpdateInputSchema,LoginActivityUncheckedUpdateInputSchema ]),
}).strict() ;

export const LoginActivityCreateManyArgsSchema: z.ZodType<Prisma.LoginActivityCreateManyArgs> = z.object({
  data: z.union([ LoginActivityCreateManyInputSchema,LoginActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LoginActivityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LoginActivityCreateManyAndReturnArgs> = z.object({
  data: z.union([ LoginActivityCreateManyInputSchema,LoginActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LoginActivityDeleteArgsSchema: z.ZodType<Prisma.LoginActivityDeleteArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  where: LoginActivityWhereUniqueInputSchema,
}).strict() ;

export const LoginActivityUpdateArgsSchema: z.ZodType<Prisma.LoginActivityUpdateArgs> = z.object({
  select: LoginActivitySelectSchema.optional(),
  include: LoginActivityIncludeSchema.optional(),
  data: z.union([ LoginActivityUpdateInputSchema,LoginActivityUncheckedUpdateInputSchema ]),
  where: LoginActivityWhereUniqueInputSchema,
}).strict() ;

export const LoginActivityUpdateManyArgsSchema: z.ZodType<Prisma.LoginActivityUpdateManyArgs> = z.object({
  data: z.union([ LoginActivityUpdateManyMutationInputSchema,LoginActivityUncheckedUpdateManyInputSchema ]),
  where: LoginActivityWhereInputSchema.optional(),
}).strict() ;

export const updateManyLoginActivityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyLoginActivityCreateManyAndReturnArgs> = z.object({
  data: z.union([ LoginActivityUpdateManyMutationInputSchema,LoginActivityUncheckedUpdateManyInputSchema ]),
  where: LoginActivityWhereInputSchema.optional(),
}).strict() ;

export const LoginActivityDeleteManyArgsSchema: z.ZodType<Prisma.LoginActivityDeleteManyArgs> = z.object({
  where: LoginActivityWhereInputSchema.optional(),
}).strict() ;

export const SystemConfigurationUpdatesCreateArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCreateArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  data: z.union([ SystemConfigurationUpdatesCreateInputSchema,SystemConfigurationUpdatesUncheckedCreateInputSchema ]),
}).strict() ;

export const SystemConfigurationUpdatesUpsertArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUpsertArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereUniqueInputSchema,
  create: z.union([ SystemConfigurationUpdatesCreateInputSchema,SystemConfigurationUpdatesUncheckedCreateInputSchema ]),
  update: z.union([ SystemConfigurationUpdatesUpdateInputSchema,SystemConfigurationUpdatesUncheckedUpdateInputSchema ]),
}).strict() ;

export const SystemConfigurationUpdatesCreateManyArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCreateManyArgs> = z.object({
  data: z.union([ SystemConfigurationUpdatesCreateManyInputSchema,SystemConfigurationUpdatesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SystemConfigurationUpdatesCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesCreateManyAndReturnArgs> = z.object({
  data: z.union([ SystemConfigurationUpdatesCreateManyInputSchema,SystemConfigurationUpdatesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SystemConfigurationUpdatesDeleteArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesDeleteArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  where: SystemConfigurationUpdatesWhereUniqueInputSchema,
}).strict() ;

export const SystemConfigurationUpdatesUpdateArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUpdateArgs> = z.object({
  select: SystemConfigurationUpdatesSelectSchema.optional(),
  data: z.union([ SystemConfigurationUpdatesUpdateInputSchema,SystemConfigurationUpdatesUncheckedUpdateInputSchema ]),
  where: SystemConfigurationUpdatesWhereUniqueInputSchema,
}).strict() ;

export const SystemConfigurationUpdatesUpdateManyArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesUpdateManyArgs> = z.object({
  data: z.union([ SystemConfigurationUpdatesUpdateManyMutationInputSchema,SystemConfigurationUpdatesUncheckedUpdateManyInputSchema ]),
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
}).strict() ;

export const updateManySystemConfigurationUpdatesCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManySystemConfigurationUpdatesCreateManyAndReturnArgs> = z.object({
  data: z.union([ SystemConfigurationUpdatesUpdateManyMutationInputSchema,SystemConfigurationUpdatesUncheckedUpdateManyInputSchema ]),
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
}).strict() ;

export const SystemConfigurationUpdatesDeleteManyArgsSchema: z.ZodType<Prisma.SystemConfigurationUpdatesDeleteManyArgs> = z.object({
  where: SystemConfigurationUpdatesWhereInputSchema.optional(),
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

export const updateManyStudentMemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyStudentMemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ StudentMemberUpdateManyMutationInputSchema,StudentMemberUncheckedUpdateManyInputSchema ]),
  where: StudentMemberWhereInputSchema.optional(),
}).strict() ;

export const StudentMemberDeleteManyArgsSchema: z.ZodType<Prisma.StudentMemberDeleteManyArgs> = z.object({
  where: StudentMemberWhereInputSchema.optional(),
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

export const updateManyPartnerSchoolCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyPartnerSchoolCreateManyAndReturnArgs> = z.object({
  data: z.union([ PartnerSchoolUpdateManyMutationInputSchema,PartnerSchoolUncheckedUpdateManyInputSchema ]),
  where: PartnerSchoolWhereInputSchema.optional(),
}).strict() ;

export const PartnerSchoolDeleteManyArgsSchema: z.ZodType<Prisma.PartnerSchoolDeleteManyArgs> = z.object({
  where: PartnerSchoolWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const updateManyUserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyUserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeviceCreateArgsSchema: z.ZodType<Prisma.UserDeviceCreateArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  data: z.union([ UserDeviceCreateInputSchema,UserDeviceUncheckedCreateInputSchema ]),
}).strict() ;

export const UserDeviceUpsertArgsSchema: z.ZodType<Prisma.UserDeviceUpsertArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereUniqueInputSchema,
  create: z.union([ UserDeviceCreateInputSchema,UserDeviceUncheckedCreateInputSchema ]),
  update: z.union([ UserDeviceUpdateInputSchema,UserDeviceUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserDeviceCreateManyArgsSchema: z.ZodType<Prisma.UserDeviceCreateManyArgs> = z.object({
  data: z.union([ UserDeviceCreateManyInputSchema,UserDeviceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeviceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserDeviceCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserDeviceCreateManyInputSchema,UserDeviceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeviceDeleteArgsSchema: z.ZodType<Prisma.UserDeviceDeleteArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  where: UserDeviceWhereUniqueInputSchema,
}).strict() ;

export const UserDeviceUpdateArgsSchema: z.ZodType<Prisma.UserDeviceUpdateArgs> = z.object({
  select: UserDeviceSelectSchema.optional(),
  include: UserDeviceIncludeSchema.optional(),
  data: z.union([ UserDeviceUpdateInputSchema,UserDeviceUncheckedUpdateInputSchema ]),
  where: UserDeviceWhereUniqueInputSchema,
}).strict() ;

export const UserDeviceUpdateManyArgsSchema: z.ZodType<Prisma.UserDeviceUpdateManyArgs> = z.object({
  data: z.union([ UserDeviceUpdateManyMutationInputSchema,UserDeviceUncheckedUpdateManyInputSchema ]),
  where: UserDeviceWhereInputSchema.optional(),
}).strict() ;

export const updateManyUserDeviceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyUserDeviceCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserDeviceUpdateManyMutationInputSchema,UserDeviceUncheckedUpdateManyInputSchema ]),
  where: UserDeviceWhereInputSchema.optional(),
}).strict() ;

export const UserDeviceDeleteManyArgsSchema: z.ZodType<Prisma.UserDeviceDeleteManyArgs> = z.object({
  where: UserDeviceWhereInputSchema.optional(),
}).strict() ;