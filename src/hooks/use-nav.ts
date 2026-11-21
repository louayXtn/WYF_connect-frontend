
// 'use client';

// import { useMemo } from 'react';
// import type { NavItem, NavGroup } from '@/types';
// import { getCurrentUser } from '@/lib/auth';

// function isItemVisible(item: NavItem) {
//   const access = (item as any).access;
//   if (!access) return true;

//   if (access.role) {
//     const currentUser = getCurrentUser();
//     if (currentUser?.role !== access.role) return false;
//   }

//   return true;
// }

// function filterItem(item: NavItem): NavItem | null {
//   if (!isItemVisible(item)) return null;

//   if (item.items && item.items.length > 0) {
//     const filteredSubItems = item.items.filter(isItemVisible);
//     return { ...item, items: filteredSubItems };
//   }

//   return item;
// }

// /**
//  * Hook to filter navigation items based on RBAC (fully client-side)
//  */
// export function useFilteredNavItems(items: NavItem[]) {
//   return useMemo(() => items.map(filterItem).filter((i): i is NavItem => i !== null), [items]);
// }

// /**
//  * Hook to filter navigation groups based on RBAC (fully client-side)
//  */
// export function useFilteredNavGroups(groups: NavGroup[]) {
//   return useMemo(() => {
//     return groups
//       .map((group) => ({
//         ...group,
//         items: group.items.map(filterItem).filter((i): i is NavItem => i !== null)
//       }))
//       .filter((group) => group.items.length > 0);
//   }, [groups]);
// }




'use client';

import { useEffect, useMemo, useState } from 'react';
import type { NavItem, NavGroup } from '@/types';
import { getCurrentUser } from '@/lib/auth';

function isItemVisible(item: NavItem, role: string | null) {
  const access = (item as any).access;
  if (!access) return true;
  if (access.role) return role === access.role;
  return true;
}

function filterItem(item: NavItem, role: string | null): NavItem | null {
  if (!isItemVisible(item, role)) return null;

  if (item.items && item.items.length > 0) {
    return { ...item, items: item.items.filter((sub) => isItemVisible(sub, role)) };
  }

  return item;
}

function useRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getCurrentUser()?.role ?? null);
  }, []);

  return role;
}

export function useFilteredNavItems(items: NavItem[]) {
  const role = useRole();
  return useMemo(
    () => items.map((item) => filterItem(item, role)).filter((i): i is NavItem => i !== null),
    [items, role]
  );
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  const role = useRole();
  return useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.map((item) => filterItem(item, role)).filter((i): i is NavItem => i !== null)
        }))
        .filter((group) => group.items.length > 0),
    [groups, role]
  );
}