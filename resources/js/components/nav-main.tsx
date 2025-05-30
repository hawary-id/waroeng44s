import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [], isCollapsed = false }: { items: NavItem[]; isCollapsed?: boolean }) {
    const page = usePage();
    const [openItem, setOpenItem] = useState<string | null>(null);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;

                    const parentHref = item.href || '';

                    const isChildActive = hasChildren ? item.children!.some((child) => page.url.startsWith(child.href || '')) : false;

                    const isActive = hasChildren ? isChildActive : parentHref ? page.url.startsWith(parentHref) : false;

                    return (
                        <SidebarMenuItem key={item.title}>
                            {hasChildren ? (
                                <>
                                    <SidebarMenuButton
                                        onClick={() => setOpenItem(openItem === item.title ? null : item.title)}
                                        isActive={isActive}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span className="flex-1">{item.title}</span>
                                        {openItem === item.title ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </SidebarMenuButton>

                                    {openItem === item.title && (
                                        <div className="mt-1 space-y-1">
                                            {item.children?.map((child) => {
                                                const childIsActive = page.url.startsWith(child.href || '');
                                                return (
                                                    <SidebarMenuButton
                                                        key={child.title}
                                                        asChild
                                                        isActive={childIsActive}
                                                        tooltip={{ children: child.title }}
                                                    >
                                                        <Link href={child.href!} prefetch className="flex items-center gap-2 text-sm">
                                                            <Circle className="h-3 w-3" />
                                                            <span>{child.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                                    <Link href={item.href!} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
