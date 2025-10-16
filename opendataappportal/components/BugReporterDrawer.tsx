'use client'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ComboboxBugCategory } from '@/components/comboboxBugCategory'
import { BugIcon } from 'lucide-react'

export default function BugReporterDrawer() {
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState('')
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="" aria-label="Fehler melden" title="Fehler melden"><BugIcon /></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Möchtest du einen Fehler melden?</DrawerTitle>
          <ComboboxBugCategory value={cat} onValueChange={setCat}/>
          <Textarea className="min-h-36" />
        </DrawerHeader>
        <DrawerFooter className='flex flex-row flex-nowrap gap-2 py-2'>
          <Button className='w-1/2' onClick={() => setOpen(false)}>Senden</Button>
          <Button variant="outline" className='w-1/2' onClick={() => { setOpen(false); setCat('') }}>Abbrechen</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
