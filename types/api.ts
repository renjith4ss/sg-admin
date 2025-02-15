import type { AdminsApi } from "~/services/api/admins"
import type { AuthApi } from "~/services/api/auth"
import type { DisplaysApi } from "~/services/api/displays"
import type { PlansApi } from "~/services/api/plans"
import type { ProfileApi } from "~/services/api/profile"
import type { RolesApi } from "~/services/api/roles"
import type { TenantsApi } from "~/services/api/tenants"

export type Api = {
  auth: AuthApi,
  tenants: TenantsApi,
  roles: RolesApi,
  admins: AdminsApi,
  plans: PlansApi,
  profile: ProfileApi,
  displays: DisplaysApi
}
