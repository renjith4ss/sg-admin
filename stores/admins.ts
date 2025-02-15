import { defineStore } from 'pinia'
import type { AdminUser, AdminsState } from '~/types/admins'
import type { Api } from '~/types/api'

export const useAdminsStore = defineStore('admins', {
  state: (): AdminsState => ({
    admins: [],
    currentAdmin: null
  }),

  getters: {
    getAdminById(state: AdminsState) {
      return (id: string): AdminUser | undefined => state.admins.find((a: AdminUser) => a.id === id)
    }
  },

  actions: {
    async fetchAdmins() {
      try {
        const $api = useNuxtApp().$api as Api
        const admins = await $api.admins.getAll()
        this.admins = admins
        return admins
      } catch (err: any) {
        throw err
      }
    },

    async createAdmin(adminData: Omit<AdminUser, 'id'>) {
      try {
        const $api = useNuxtApp().$api as Api
        const admin = await $api.admins.create(adminData)
        if (admin) {
          this.admins.push(admin)
        }
        return admin
      } catch (err: any) {
        throw err
      }
    },

    async updateAdmin(id: string, adminData: Partial<Omit<AdminUser, 'id'>>) {
      try {
        const $api = useNuxtApp().$api as Api
        const admin = await $api.admins.update(id, adminData)
        if (admin) {
          const index = this.admins.findIndex((a: AdminUser) => a.id === id)
          if (index !== -1) {
            this.admins[index] = admin
          }
        }
        return admin
      } catch (err: any) {
        throw err
      }
    },

    async deleteAdmin(id: string) {
      try {
        const $api = useNuxtApp().$api as Api
        const admin = await $api.admins.deleteOne(id)
        if (admin) {
          const index = this.admins.findIndex((a: AdminUser) => a.id === id)
          if (index !== -1) {
            this.admins.splice(index, 1)
          }
        }
        return admin
      } catch (err: any) {
        throw err
      }
    }
  }
}) 