import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  } from '@/components/ui/card'
import React from 'react'

const AppView = () => {
  return (
    <>
        <Badge>Unsere Apps</Badge>
        <h1>Modern solutions. Timeless design.</h1>
        <h2>Residential, commercial, and urban planning. Transform spaces into experiences with our comprehensive architectural solutions.</h2>
        <div className='grid'>

        </div>
    </>
  )
}

export default AppView


export function Boxes(){
    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>
                
            </CardFooter>
            
        </Card>
    )
}