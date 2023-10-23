'use client'

import { Text, Heading, Stack, Input, Button, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot } from '@chakra-ui/react'
import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TAKING_RSVP = gql`
  query GetTakingRsvp {
    takingRsvp {
      areTakingRsvp
    }
  }
`;

type TakingRsvp = {
  areTakingRsvp: boolean
}

export default function RSVP() {
  const { loading, error, data } = useQuery<{takingRsvp: TakingRsvp}>(GET_TAKING_RSVP)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const isTakingRsvp = data.takingRsvp.areTakingRsvp;

  if (!isTakingRsvp) {
    return null
  }

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">RSVP</Heading>
      <Text fontWeight="bold">Please RSVP for the number of adults and children. Check the bottom of the chart of guest totals so you know how much to make/bring.</Text>
      <Form/>
      <RSVPTable/>
    </Stack>
  )
}

const GET_RSVPS = gql`
  query GetRsvps {
    rsvps {
      adults
      children
      name
    }
  }
`;

function RSVPTable() {
  const { loading, error, data } = useQuery<{rsvps: Array<RSVPInput>}>(GET_RSVPS)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const {rsvps} = data;

  const totalAdults = rsvps.map(rsvp => Number.parseInt(rsvp.adults)).reduce((acc, next) => acc+next)
  const totalChildren = rsvps.map(rsvp => Number.parseInt(rsvp.children)).reduce((acc, next) => acc+next)

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

const ADD_RSVP = gql`
mutation rsvps($adults: String!, $children: String!, $name: String!) {
    createRsvp(input: {data: {adults: $adults, children: $children, name: $name}}) {
      rsvp {
        id
      }
    }
  }
`;

type RSVPInput = {
  adults: string
  children: string
  name: string
}

function Form() {
  const [adults, setAdults] = useState<string>('')
  const [children, setChildren] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [addRsvp, mutationData] = useMutation<RSVPInput>(ADD_RSVP, {refetchQueries: [GET_RSVPS]});

  if (mutationData.loading) {
    return <Text>Submitting . . . . </Text>
  }

  if (mutationData.error !== undefined) {
    return <Text>There was an error . . . . </Text>
  }

  return <form
    onSubmit={async (e) => {
      e.preventDefault();
      await addRsvp({ variables: { adults, children: children === '' ? 0 : children, name } });
      setAdults('')
      setChildren('')
      setName('')
    }}>
    <Stack direction={['column', 'row']}>
      <Input placeholder="Adults" variant="filled" value={adults} onChange={(e) => setAdults(e.target.value)}/>
      <Input placeholder="Children" variant="filled" value={children} onChange={(e) => setChildren(e.target.value)}/>
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}