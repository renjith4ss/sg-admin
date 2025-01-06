// Organizations Collection
export const OrganizationsSchema = {
  name: "organizations",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "subscriptionPlan",
      type: "select",
      options: {
        values: ["free", "basic", "pro"]
      },
      required: true,
    },
    {
      name: "displaySlots",
      type: "number",
      required: true,
    },
    {
      name: "additionalDisplays",
      type: "number",
      default: 0,
    },
    {
      name: "customRoles",
      type: "json",
    },
    {
      name: "settings",
      type: "json",
    },
    {
      name: "billingEmail",
      type: "email",
    },
    {
      name: "status",
      type: "select",
      options: {
        values: ["active", "suspended", "cancelled"]
      },
      required: true,
      default: "active"
    }
  ]
}

// Users Collection (extends PocketBase auth)
export const UsersSchema = {
  name: "users",
  type: "auth",
  schema: [
    {
      name: "organizationMemberships",
      type: "json",
      required: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      options: {
        values: ["admin", "editor", "viewer"]
      },
      required: true,
    },
    {
      name: "lastActive",
      type: "date",
    },
    {
      name: "preferences",
      type: "json",
    }
  ]
}

// Displays Collection
export const DisplaysSchema = {
  name: "displays",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "organization",
      type: "relation",
      required: true,
      options: {
        collectionId: "organizations",
        cascadeDelete: true,
      }
    },
    {
      name: "status",
      type: "select",
      options: {
        values: ["active", "inactive", "maintenance"]
      },
      required: true,
      default: "active"
    },
    {
      name: "content",
      type: "json",
      required: true,
    },
    {
      name: "schedule",
      type: "json",
    },
    {
      name: "settings",
      type: "json",
    },
    {
      name: "lastPing",
      type: "date",
    },
    {
      name: "version",
      type: "text",
    }
  ]
}

// Content Templates Collection
export const ContentTemplatesSchema = {
  name: "content_templates",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "organization",
      type: "relation",
      required: true,
      options: {
        collectionId: "organizations",
        cascadeDelete: true,
      }
    },
    {
      name: "content",
      type: "json",
      required: true,
    },
    {
      name: "category",
      type: "text",
    },
    {
      name: "isPublic",
      type: "bool",
      default: false,
    }
  ]
}

// Analytics Collection
export const AnalyticsSchema = {
  name: "analytics",
  type: "base",
  schema: [
    {
      name: "display",
      type: "relation",
      required: true,
      options: {
        collectionId: "displays",
        cascadeDelete: true,
      }
    },
    {
      name: "organization",
      type: "relation",
      required: true,
      options: {
        collectionId: "organizations",
        cascadeDelete: true,
      }
    },
    {
      name: "type",
      type: "select",
      options: {
        values: ["view", "interaction", "error"]
      },
      required: true,
    },
    {
      name: "data",
      type: "json",
      required: true,
    },
    {
      name: "timestamp",
      type: "date",
      required: true,
    }
  ]
}

// Audit Logs Collection
export const AuditLogsSchema = {
  name: "audit_logs",
  type: "base",
  schema: [
    {
      name: "user",
      type: "relation",
      options: {
        collectionId: "users",
      }
    },
    {
      name: "organization",
      type: "relation",
      required: true,
      options: {
        collectionId: "organizations",
        cascadeDelete: true,
      }
    },
    {
      name: "action",
      type: "text",
      required: true,
    },
    {
      name: "details",
      type: "json",
      required: true,
    },
    {
      name: "ip",
      type: "text",
    },
    {
      name: "userAgent",
      type: "text",
    }
  ]
}

export const Schemas = [
  OrganizationsSchema,
  UsersSchema,
  DisplaysSchema,
  ContentTemplatesSchema,
  AnalyticsSchema,
  AuditLogsSchema
] 