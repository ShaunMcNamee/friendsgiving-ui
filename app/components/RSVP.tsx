'use client'

import { Text, Heading, Stack, Input, Button } from '@chakra-ui/react'
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
      <Text fontWeight="bold">Please RSVP for the number of adults and children. Don&apos;t worry if you think you have already RSVP&apos;d, we&apos;ll make sure you are only counted once.</Text>
      <Form/>
    </Stack>
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
  const [addRsvp, mutationData] = useMutation<RSVPInput>(ADD_RSVP);

  if (mutationData.loading) {
    return <Text>Submitting . . . . </Text>
  }

  if (mutationData.error !== undefined) {
    return <Text>There was an error . . . . </Text>
  }

  if (mutationData.data !== undefined) {
    return <Text>Thanks for your input!</Text>
  }

  return <form
    onSubmit={async (e) => {
      e.preventDefault();
      await addRsvp({ variables: { adults, children, name } });
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