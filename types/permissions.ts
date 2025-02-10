// constants
export const PERMISSIONS = [
    "role.create",
    "role.read",
    "role.delete",

    "tenant.role.create",
    "tenant.role.read",
    "tenant.role.delete",

    "user.create",
    "user.read",
    "user.delete",
    
    "tenant.create",
    "tenant.read",
    "tenant.delete"
];

export type Permission = typeof PERMISSIONS[number];

export type PermissionType = {
    [key in Permission]: boolean;
};

