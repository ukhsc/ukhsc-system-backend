import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UnionStaffScalarFieldEnumSchema = z.enum(['user_id','role','permissions','real_name','department','job_title','created_at','updated_at']);

export const FederatedAccountScalarFieldEnumSchema = z.enum(['id','provider','provider_identifier','email','user_id']);

export const LoginActivityScalarFieldEnumSchema = z.enum(['id','device_id','ip_address','login_time','success']);

export const SystemConfigurationUpdatesScalarFieldEnumSchema = z.enum(['id','created_at','updated_at','service_status','contract_start_date','contract_end_date']);

export const StudentMemberScalarFieldEnumSchema = z.enum(['id','school_attended_id','user_id','student_id_hash','password_hash','created_at','activated_at','expired_at']);

export const MemberSettingsScalarFieldEnumSchema = z.enum(['member_id','nickname','e_invoice_barcode','updated_at']);

export const PartnerSchoolScalarFieldEnumSchema = z.enum(['id','short_name','full_name','enable_eligibility_check','eligible_student_ids']);

export const SchoolAccountConfigScalarFieldEnumSchema = z.enum(['username_format','student_username_format','password_format','domain_name','school_id']);

export const SchoolRepresentativeScalarFieldEnumSchema = z.enum(['user_id','school_id','job_title','created_at','updated_at']);

export const UserScalarFieldEnumSchema = z.enum(['id','primary_email','created_at','updated_at']);

export const UserDeviceScalarFieldEnumSchema = z.enum(['id','user_id','name','type','operating_system','created_at','updated_at']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UnionStaffRoleSchema = z.enum(['President','TechnicalDirector','Staff']);

export type UnionStaffRoleType = `${z.infer<typeof UnionStaffRoleSchema>}`

export const StaffPermissionSchema = z.enum(['MembershipEligibility']);

export type StaffPermissionType = `${z.infer<typeof StaffPermissionSchema>}`

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
// UNION STAFF SCHEMA
/////////////////////////////////////////

export const UnionStaffSchema = z.object({
  role: UnionStaffRoleSchema,
  permissions: StaffPermissionSchema.array(),
  user_id: z.number().int(),
  real_name: z.string(),
  department: z.string().nullable(),
  job_title: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type UnionStaff = z.infer<typeof UnionStaffSchema>

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
  student_id_hash: z.string().nullable(),
  password_hash: z.string().nullable(),
  created_at: z.coerce.date(),
  activated_at: z.coerce.date().nullable(),
  expired_at: z.coerce.date().nullable(),
})

export type StudentMember = z.infer<typeof StudentMemberSchema>

/////////////////////////////////////////
// MEMBER SETTINGS SCHEMA
/////////////////////////////////////////

export const MemberSettingsSchema = z.object({
  member_id: z.string(),
  nickname: z.string().nullable(),
  /**
   * The E-Invoice carrier barcode registered with Taiwan's Ministry of Finance
   * Format follows official barcode specifications for electronic invoices
   * For technical details, refer to: https://www.einvoice.nat.gov.tw/download/ptl003w/AC20000002
   */
  e_invoice_barcode: z.string().nullable(),
  updated_at: z.coerce.date(),
})

export type MemberSettings = z.infer<typeof MemberSettingsSchema>

/////////////////////////////////////////
// PARTNER SCHOOL SCHEMA
/////////////////////////////////////////

export const PartnerSchoolSchema = z.object({
  id: z.number().int(),
  short_name: z.string(),
  full_name: z.string(),
  enable_eligibility_check: z.boolean(),
  eligible_student_ids: z.string().array(),
})

export type PartnerSchool = z.infer<typeof PartnerSchoolSchema>

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
// SCHOOL REPRESENTATIVE SCHEMA
/////////////////////////////////////////

export const SchoolRepresentativeSchema = z.object({
  user_id: z.number().int(),
  school_id: z.number().int(),
  job_title: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type SchoolRepresentative = z.infer<typeof SchoolRepresentativeSchema>

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
