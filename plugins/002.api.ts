import PocketBase from 'pocketbase'
import { createAdminsApi } from '~/services/api/admins'
import { createAuthApi } from '~/services/api/auth'
import { createDisplaysApi } from '~/services/api/displays'
import { createPlansApi } from '~/services/api/plans'
import { createProfileApi } from '~/services/api/profile'
import { createRolesApi } from '~/services/api/roles'
import { createTenantsApi } from '~/services/api/tenants'
import type { Api } from '~/types/api'

export default defineNuxtPlugin(() => {
  const pb = useNuxtApp().$pb as PocketBase

  const api: Api = {
    auth: createAuthApi(pb),
    tenants: createTenantsApi(pb),
    roles: createRolesApi(pb),
    admins: createAdminsApi(pb),
    plans: createPlansApi(pb),
    profile: createProfileApi(pb),
    displays: createDisplaysApi(pb),
  }
  
  return {
    provide: {
      api
    }
  }
}) 