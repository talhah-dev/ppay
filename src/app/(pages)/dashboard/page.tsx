"use client"
import UserWrapper from '@/app/wrapper/UserWrapper'
import DashboardMetrics from '@/components/DashboardMetrics'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const Dashboard = () => {
  return (
    <UserWrapper>
      <div className="">
        <DashboardMetrics />
      </div>

      <div className="">
        <div className="w-full p-6">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Sport Website</TableCell>
                  <TableCell><Badge>React</Badge></TableCell>
                  <TableCell>12-01-2024</TableCell>
                  <TableCell><Badge variant="default">success</Badge></TableCell>
                  <TableCell>$150.00</TableCell>
                  <TableCell><Badge variant="default">Paid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>E-Commerce Platform</TableCell>
                  <TableCell><Badge>Next.js</Badge></TableCell>
                  <TableCell>01-15-2025</TableCell>
                  <TableCell><Badge variant="secondary">processing</Badge></TableCell>
                  <TableCell>$220.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Portfolio Site</TableCell>
                  <TableCell><Badge>Vue</Badge></TableCell>
                  <TableCell>03-08-2025</TableCell>
                  <TableCell><Badge variant="outline">pending</Badge></TableCell>
                  <TableCell>$95.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Blog System</TableCell>
                  <TableCell><Badge>Nuxt</Badge></TableCell>
                  <TableCell>02-20-2025</TableCell>
                  <TableCell><Badge variant="destructive">failed</Badge></TableCell>
                  <TableCell>$80.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Company Dashboard</TableCell>
                  <TableCell><Badge>Angular</Badge></TableCell>
                  <TableCell>04-10-2025</TableCell>
                  <TableCell><Badge variant="default">success</Badge></TableCell>
                  <TableCell>$300.00</TableCell>
                  <TableCell><Badge variant="default">Paid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Mobile Admin Panel</TableCell>
                  <TableCell><Badge>Svelte</Badge></TableCell>
                  <TableCell>05-02-2025</TableCell>
                  <TableCell><Badge variant="secondary">processing</Badge></TableCell>
                  <TableCell>$180.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Travel Booking App</TableCell>
                  <TableCell><Badge>React Native</Badge></TableCell>
                  <TableCell>06-22-2025</TableCell>
                  <TableCell><Badge variant="outline">pending</Badge></TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Learning Portal</TableCell>
                  <TableCell><Badge>Next.js</Badge></TableCell>
                  <TableCell>07-12-2025</TableCell>
                  <TableCell><Badge variant="destructive">failed</Badge></TableCell>
                  <TableCell>$120.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Chat Application</TableCell>
                  <TableCell><Badge>Vue</Badge></TableCell>
                  <TableCell>08-29-2025</TableCell>
                  <TableCell><Badge variant="default">success</Badge></TableCell>
                  <TableCell>$310.00</TableCell>
                  <TableCell><Badge variant="default">Paid</Badge></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Inventory System</TableCell>
                  <TableCell><Badge>Laravel</Badge></TableCell>
                  <TableCell>09-05-2025</TableCell>
                  <TableCell><Badge variant="secondary">processing</Badge></TableCell>
                  <TableCell>$210.00</TableCell>
                  <TableCell><Badge variant="outline">Unpaid</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </div>
        </div>
      </div>


    </UserWrapper>
  )
}

export default Dashboard