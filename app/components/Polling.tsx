'use client'

import {
  Text,
  Heading,
  Stack,
  Checkbox,
  Input,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
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
      <Text fontWeight="bold">Please choose the times that are best for you and your gang to have our meal - we will triangulate the best time for all and report back later this week.</Text>
      <Poll/>
      <PollTable/>
    </Stack>
  )
}

const GET_POLL_INPUTS = gql`
  query GetPollInputs {
    pollInputs {
      option
      name
    }
  }
`;

function PollTable() {
  const { loading, error, data } = useQuery<{pollInputs: Array<PollInput>}>(GET_POLL_INPUTS)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th color="brand.orangeRyb">Time</Th>
            <Th color="brand.orangeRyb">Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pollInputs.map((input,index) => <Tr key={index} bgColor="brand.sinopia">
            <Td>{input.option}</Td>
            <Td>{input.name}</Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
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
  const [optionsChosen, setOptionsChosen] = useState<Array<string>>([])
  const [name, setName] = useState<string>('')
  const [addPollInput, mutationData] = useMutation<PollInput>(ADD_POLL_INPUT, { refetchQueries: [GET_POLL_INPUTS] });

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  if (mutationData.loading) {
    return <Text>Submitting . . . . </Text>
  }

  if (mutationData.error !== undefined) {
    return <Text>There was an error . . . . </Text>
  }

  const filteredPollOptions = data.pollOptions.filter((option) => option.active)

  return <form
      onSubmit={async (e) => {
      e.preventDefault();
      await addPollInput({ variables: { option: optionsChosen.join(','), name } });
      setOptionsChosen([])
      setName('')
    }}>
    <Stack direction={['column', 'row']}>
      {filteredPollOptions.map(option => (
        <Checkbox key={option.option} variant="filled" onChange={(e) => {
          if (e.target.checked) {
            if (!optionsChosen.includes(option.option)) {
              setOptionsChosen([...optionsChosen, option.option])
            }
          } else {
            setOptionsChosen(optionsChosen.filter(optionChosen => optionChosen !== option.option))
          }
        }}>{option.option}</Checkbox>
      ))}
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}