'use client'

import { Text, Heading, Stack, Input, Button, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot } from '@chakra-ui/react'
import React, { useEffect, useState} from 'react'

export default function RSVP({db}: {db: any}) {
  const [reload, setReload] = useState<boolean>(true)
  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">RSVP</Heading>
      <Text fontWeight="bold">Please RSVP for the number of adults and children. Check the bottom of the chart of guest totals so you know how much to make/bring.</Text>
      <Form db={db} setReload={setReload}/>
      <RSVPTable db={db} reload={reload} setReload={setReload}/>
    </Stack>
  )
}

function RSVPTable({db, reload, setReload}: {db: any, reload: boolean, setReload: any}) {
  const [rsvps, setRSVPs] = useState([]);
  async function getRSVPs() {
    let { data: rsvps } = await db
      .from('rsvps')
      .select('*')
    setRSVPs(rsvps)
    setReload(false)
  }

  useEffect(() => {
    getRSVPs();
  }, [reload]);

  const totalAdults = rsvps.map(rsvp => Number.parseInt(rsvp.adults)).reduce((acc, next) => acc+next, 0)
  const totalChildren = rsvps.map(rsvp => Number.parseInt(rsvp.children)).reduce((acc, next) => acc+next, 0)

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th color="brand.orangeRyb">Adults</Th>
            <Th color="brand.orangeRyb">Children</Th>
            <Th color="brand.orangeRyb">Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rsvps.map((input,index) => <Tr key={index} bgColor="brand.sinopia">
            <Td>{input.adults}</Td>
            <Td>{input.children}</Td>
            <Td>{input.name}</Td>
          </Tr>)}
        </Tbody>
        <Tfoot>
          <Tr bgColor="brand.sinopia">
            <Th color="brand.orangeRyb" fontSize="lg">{totalAdults}</Th>
            <Th color="brand.orangeRyb" fontSize="lg">{totalChildren}</Th>
            <Th color="brand.orangeRyb" fontSize="lg">TOTAL</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  )
}

function Form({db, setReload}: {db: any, setReload: any}) {
  const [adults, setAdults] = useState<string>('')
  const [children, setChildren] = useState<string>('')
  const [name, setName] = useState<string>('')

  return <form
    onSubmit={async (e) => {
      e.preventDefault()
      await db
        .from('rsvps')
        .insert([
          { adults: Number.isNaN(Number.parseInt(adults)) ? 0 : Number.parseInt(adults), children: Number.isNaN(Number.parseInt(children)) ? 0 : Number.parseInt(children), name },
        ])
        .select()
      setAdults('')
      setChildren('')
      setName('')
      setReload(true)
    }}>
    <Stack direction={['column', 'row']}>
      <Input placeholder="Adults" variant="filled" value={adults} onChange={(e) => setAdults(e.target.value)}/>
      <Input placeholder="Children" variant="filled" value={children} onChange={(e) => setChildren(e.target.value)}/>
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}