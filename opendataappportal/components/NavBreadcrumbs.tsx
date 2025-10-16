'use client'

import { Fragment } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const segmentTitles: Record<string, string> = {
  dashboard: 'Übersicht',
  appview: 'Apps',
}

function getLabel(seg: string) {
  return segmentTitles[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function NavBreadcrumbs() {
  const segments = useSelectedLayoutSegments()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1
          const path = '/dashboard/' + segments.slice(0, idx + 1).join('/')
          const label = getLabel(segment)

          return (
            <Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
