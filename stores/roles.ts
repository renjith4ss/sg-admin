import { defineStore } from 'pinia'
import type { Api } from '~/types/api'
import type { Role, RolesState } from '~/types/roles'

export const useRolesStore = defineStore('roles', {
  state: (): RolesState => ({
    roles: [],
    currentRole: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getRoleById(state: RolesState) {
      return (id: string): Role | undefined => state.roles.find((r: Role) => r.id === id)
    }
  },

  actions: {
    async fetchRoles() {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const roles = await $api.roles.getAll()
        this.roles = roles
        return roles
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch plans'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createRole(roleData: Omit<Role, 'id' | 'created' | 'updated'>) {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const role = await $api.roles.create(roleData)
        if (role) {
          this.roles.push(role)
        }
        return role
      } catch (err: any) {
        this.error = err.message || 'Failed to create role'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateRole(id: string, roleData: Partial<Omit<Role, 'id' | 'created' | 'updated'>>) {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const role = await $api.roles.update(id, roleData)
        if (role) {
          const index = this.roles.findIndex((r: Role) => r.id === id)
          if (index !== -1) {
            this.roles[index] = role
          }
        }
        return role
      } catch (err: any) {
        this.error = err.message || 'Failed to update plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteRole(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const role = await $api.roles.deleteOne(id)
        if (role) {
          const index = this.roles.findIndex((r: Role) => r.id === id)
          if (index !== -1) {
            this.roles.splice(index, 1)
          }
        }
        return role
      } catch (err: any) {
        this.error = err.message || 'Failed to delete role'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchRole(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const role = await $api.roles.getOne(id)
        if (role) {
          this.currentRole = role
          const index = this.roles.findIndex((r: Role) => r.id === id)
          if (index !== -1) {
            this.roles[index] = role
          } else {
            this.roles.push(role)
          }
        }
        return role
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch role'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 