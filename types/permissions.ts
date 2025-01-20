// constants
export const PERMISSIONS = [
    'tenant.read',
    'tenant.delete',
    'tenant.create',
    'tenant.update',

    'plan.read',
    'plan.delete',
    'plan.create',
    'plan.update',

    'display.read',
    'display.delete',
    'display.create',
    'display.update',

    'user.read',
    'user.delete',
    'user.create',
    'user.update',

    'role.read',
    'role.delete',
    'role.create',
    'role.update',

    'invoice.read',
    'invoice.delete',
    'invoice.create',
    'invoice.update',

    'payment.read',
    'payment.delete',
    'payment.create',
    'payment.update',

    'subscription.read',
    'subscription.delete',
    'subscription.create',
    'subscription.update',

    // Tenant Admin Permissions
    'tenant.user.read',
    'tenant.user.delete',
    'tenant.user.create',
    'tenant.user.update',
    'tenant.user.role.read',
    'tenant.user.role.delete',
    'tenant.user.role.create',
    'tenant.user.role.update',

    'tenant.subscription.read',
    'tenant.subscription.delete',
    'tenant.subscription.create',
    'tenant.subscription.update',

    'tenant.invoice.read',

    'tenant.payment.read',
    'tenant.payment.delete',
    'tenant.payment.create',
    'tenant.payment.update',

    'tenant.content.read',
    'tenant.content.delete',
    'tenant.content.create',
    'tenant.content.update',

    'tenant.display.read',
    'tenant.display.delete',
    'tenant.display.create',
    'tenant.display.update',

    'tenant.schedule.read',
    'tenant.schedule.delete',
    'tenant.schedule.create',
    'tenant.schedule.update',

    'tenant.display.schedule.read',
    'tenant.display.schedule.delete',
    'tenant.display.schedule.create',
    'tenant.display.schedule.update'
];

export type Permission = typeof PERMISSIONS[number];

export type PermissionType = {
    [key in Permission]: boolean;
};

