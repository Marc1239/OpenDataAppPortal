import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Hero45 } from '@/components/hero45'
import { Gallery6 } from '@/components/gallery6'


const Dashboard = () => {
  return (
    <>
      <Hero45 
        heading='Open Data App Portal'
      />
      <Gallery6 />
    </>
  )
}

export default Dashboard