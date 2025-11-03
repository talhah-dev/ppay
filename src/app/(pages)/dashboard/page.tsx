"use client"
import UserWrapper from '@/app/wrapper/UserWrapper'
import DashboardMetrics from '@/components/DashboardMetrics'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'

interface Project {
  title: string,
  amount: number,
  deadline: string,
  status: string,
  framework: string,
  author?: string,
  isActive: boolean,
  time: string,
  _id: string,
  isPaid: boolean,
}

const Dashboard = () => {

  const { data, isLoading, isError } = useQuery({
    //     After a “Create Project” mutation, you might want to:
    //       Invalidate only unpaid: invalidateQueries({ queryKey: ['projects', { isPaid: false }] })
    // Keep paid cache warm(fast tab switch).
    // With a single['projects'] key, you can only invalidate everything—causing unnecessary refetches.

    queryKey: ['projects', { ispaid: false }],
    // queryKey: ['projects', 'unpaid'],
    queryFn: () => getProjects(false),
  });

  const { isLoading: metricsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })

  if (isLoading || metricsLoading) {
    return <div className='flex items-center justify-center h-screen'>
      <Spinner />
    </div>
  }

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
                {
                  data.projects.map((project: Project, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{project.title}</TableCell>
                      <TableCell><Badge>{project.framework}</Badge></TableCell>
                      <TableCell>{new Date(project.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                        &nbsp;-&nbsp; {project.time.split(':').slice(0, 2).join(':')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === "progress" || project.status === "pending"
                              ? "outline"
                              : project.status === "completed"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>

                      <TableCell>Rs {project.amount}</TableCell>
                      <TableCell><Badge variant="default">{project.isPaid ? "Paid" : "Unpaid"}
                      </Badge></TableCell>
                    </TableRow>
                  ))
                }


              </TableBody>
            </Table>

          </div>
        </div>
      </div>


    </UserWrapper>
  )
}

export default Dashboard