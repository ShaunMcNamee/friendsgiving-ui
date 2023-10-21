'use client'

import { Text, Heading, Stack, Select, Input, Button } from '@chakra-ui/react'
import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_POLLING = gql`
  query GetPolling {
    polling {
      arePolling
    }
  }
`;

type Polling = {
  arePolling: boolean
}

export default function Polling() {
  const { loading, error, data } = useQuery<{polling: Polling}>(GET_POLLING)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const isPolling = data.polling.arePolling;

  if (!isPolling) {
    return null
  }

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">Food Time Poll</Heading>
      <Text>Please choose the time that is best for you to eat, and put in your name. Don&apos;t worry if you think you have already voted, we&apos;ll make sure you are only counted once.</Text>
      <Poll/>
    </Stack>
  )
}

const GET_POLL_OPTIONS = gql`
  query GetPollOptions {
    pollOptions {
      option
      active
    }
  }
`;

const ADD_POLL_INPUT = gql`
mutation pollInputs($option: String!, $name: String!) {
    createPollInput(input: {data: {option: $option, name: $name}}) {
      pollInput {
        id
      }
    }
  }
`;

type PollOption = {
  option: string
  active: boolean
}

type PollInput = {
  option: string
  name: string
}

function Poll() {
  const { loading, error, data } = useQuery<{pollOptions: Array<PollOption>}>(GET_POLL_OPTIONS)
  const [optionChosen, setOptionChosen] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [addPollInput, mutationData] = useMutation<PollInput>(ADD_POLL_INPUT);

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  if (mutationData.loading) {
    return <Text>Submitting . . . . </Text>
  }

  if (mutationData.error !== undefined) {
    return <Text>There was an error . . . . </Text>
  }

  if (mutationData.data !== undefined) {
    return <Text>Thanks for your input!</Text>
  }

  const filteredPollOptions = data.pollOptions.filter((option) => option.active)

  return <form
      onSubmit={async (e) => {
      e.preventDefault();
      await addPollInput({ variables: { option: optionChosen, name } });
      setOptionChosen('')
      setName('')
    }}>
    <Stack direction={['column', 'row']}>
      <Select placeholder='Select option' variant="filled" value={optionChosen} onChange={(e) => setOptionChosen(e.target.value)}>
        {filteredPollOptions.map(option => (
          <option key={option.option} value={option.option}>{option.option}</option>
        ))}
      </Select>
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}