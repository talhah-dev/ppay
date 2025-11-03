"use client"
import UserWrapper from '@/app/wrapper/UserWrapper'
import DashboardMetrics from '@/components/DashboardMetrics'
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProjects, markProjectAsPaid } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Check, CheckCircle2 } from 'lucide-react'

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

  const [ids, setIds] = useState<string[]>([]);

  const toggleOne = (id: string) =>
    setIds((prev) => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ));



  const { data, isLoading, isError } = useQuery({
    //     After a “Create Project” mutation, you might want to:
    //       Invalidate only unpaid: invalidateQueries({ queryKey: ['projects', { isPaid: false }] })
    // Keep paid cache warm(fast tab switch).
    // With a single['projects'] key, you can only invalidate everything—causing unnecessary refetches.

    queryKey: ['projects', { ispaid: false }],
    // queryKey: ['projects', 'unpaid'],
    queryFn: () => getProjects(false),
  });

  const allIds: string[] = data?.projects?.map((p: Project) => p._id) ?? [];

  const allSelected = ids.length > 0 && ids.length === allIds.length;

  const toggleAll = () =>
    setIds(allSelected ? [] : allIds);

  const { isLoading: metricsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (ids: string[]) => markProjectAsPaid(ids),
    onSuccess: async () => {
      setIds([]);
      queryClient.invalidateQueries({ queryKey: ["projects", { isPaid: false }] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

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
          <div className="flex items-center justify-between">
            <h2 className='md:text-3xl text-2xl font-semibold mb-5 mt-5'>Recent Projects</h2>
            <Button disabled={isPending}
              onClick={() => mutateAsync(ids)}> <CheckCircle2 /> {isPending ? "Marking…" : `Mark as paid ${ids.length > 0 ? `(${ids.length})` : ""}`}</Button>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Checkbox checked={allSelected}
                    onCheckedChange={toggleAll} /></TableHead>
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
                  data.projects.map((project: Project, index: number) => {
                    const checked = ids.includes(project._id);
                    return (
                      <TableRow key={index}>
                        <TableCell><Checkbox checked={checked}
                          onCheckedChange={() => toggleOne(project._id)} /></TableCell>
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
                    )
                  })
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