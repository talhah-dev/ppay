import AppSidebar from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

interface UserWrapper {
    children: React.ReactNode
    className?: string
}

const UserWrapper = ({ children, className }: UserWrapper) => {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <main className={` w-full ${className}`}>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}

export default UserWrapper