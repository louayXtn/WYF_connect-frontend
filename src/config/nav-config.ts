import { NavGroup } from '@/types';

/**
 * Navigation configuration with RBAC support
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 * Items are organized into groups, each rendered with a SidebarGroupLabel.
 *
 * RBAC Access Control:
 * Each navigation item can have an `access` property that controls visibility
 * based on permissions, plans, features, roles, and organization context.
 *
 * Examples:
 *
 * 1. Require organization:
 *    access: { requireOrg: true }
 *
 * 2. Require specific permission:
 *    access: { requireOrg: true, permission: 'org:teams:manage' }
 *
 * 3. Require specific plan:
 *    access: { plan: 'pro' }
 *
 * 4. Require specific feature:
 *    access: { feature: 'premium_access' }
 *
 * 5. Require specific role:
 *    access: { role: 'admin' }
 *
 * 6. Multiple conditions (all must be true):
 *    access: { requireOrg: true, permission: 'org:teams:manage', plan: 'pro' }
 *
 * Note: The `visible` function is deprecated but still supported for backward compatibility.
 * Use the `access` property for new items.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Platform',
    items: [
      {
        title: 'Main Stats',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Projects Feed',
        url: '/dashboard/projects',
        icon: 'product',
        isActive: false,
        items: [
          {
            title: 'Browse Public Pitches',
            url: '/dashboard/projects',
            icon: 'product'
          },
          {
            title: 'Elevator Pitches',
            url: '/dashboard/projects?view=elevator',
            icon: 'sparkles'
          }
        ]
      },
     {
  title: 'Investor Opportunities',
  url: '/dashboard/opportunities',
  icon: 'billing',
  isActive: false,
  items: [
    { title: 'My Opportunities', url: '/dashboard/my-opportunities', icon: 'billing', access: { role: 'investor' } },
    { title: 'Browse Opportunities', url: '/dashboard/opportunities', icon: 'billing' },
    { title: 'Post an Opportunity', url: '/dashboard/post-opportunity', icon: 'forms', access: { role: 'investor' } }
  ]
},
      {
        title: 'NDA Requests',
        url: '/dashboard/nda-requests',
        icon: 'lock',
        isActive: false,
        items: []
      },
      {
        title: 'Submit Project',
        url: '/dashboard/submit-project',
        icon: 'forms',
        isActive: false,
        items: []
      },
      {
  title: 'My Projects',
  url: '/dashboard/my-projects',
  icon: 'product',
  isActive: false,
  items: []
}
    ]
  },
  {
  label: 'Account',
  items: [
    {
      title: 'Profile',
      url: '/dashboard/profile',
      icon: 'profile',
      isActive: false,
      items: []
    },
    { title: 'My Applications', url: '/dashboard/my-applications', icon: 'product', access: { role: 'youth' } },
    {
      title: 'Verify Identity',
      url: '/dashboard/verify-identity',
      icon: 'lock',
      isActive: false,
      items: []
    },
    {
      title: 'Notifications',
      url: '/dashboard/notifications',
      icon: 'notification',
      isActive: false,
      items: []
    },
    {
      title: 'Admin',
      url: '/dashboard/admin',
      icon: 'lock',
      isActive: false,
      items: [],
      access: { role: 'admin' }
    },
    { title: 'All Content', url: '/dashboard/admin-content', icon: 'lock', access: { role: 'admin' } }
  ]
}
];
