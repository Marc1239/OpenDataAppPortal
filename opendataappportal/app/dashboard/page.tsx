'use client'

import React, { useEffect, useState } from 'react'
import { Hero45 } from '@/components/hero45'
import { Gallery6, GalleryItem } from '@/components/gallery6'

interface AppEntry {
  title: string
  city: string
  category: string
  barrierFree: boolean
  isLatest: boolean
  description: string
  image: string
}

export default function Dashboard() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then((data: Record<string, AppEntry>) => {
        const latest: GalleryItem[] = Object.entries(data)
          .filter(([, app]) => app.isLatest)
          .map(([key, app]) => ({
            id: key,
            title: app.title,
            summary: app.description.slice(0, 100) + '...',
            url: `/dashboard/appview/${encodeURIComponent(key)}`,
            image: app.image,
          }))
        setItems(latest)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero45 />

      {loading ? (
        <p className="text-center py-16">Lade neuste Veröffentlichungen…</p>
      ) : (
        <Gallery6
          heading="Neuste Veröffentlichungen"
          demoUrl="/dashboard/appview"
          items={items}
        />
      )}
    </>
  )
}
