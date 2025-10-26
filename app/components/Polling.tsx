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
import React, { useEffect, useState} from 'react'

export default function Polling({db}: {db: any}) {
  const [reload, setReload] = useState<boolean>(true)
  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">Food Time Poll</Heading>
      <Text fontWeight="bold">Please choose the times that are best for you and your gang to have our meal - we will triangulate the best time for all and report back later this week.</Text>
      <Poll db={db} setReload={setReload}/>
      <PollTable db={db} reload={reload} setReload={setReload}/>
    </Stack>
  )
}

function PollTable({db, reload, setReload}: {db: any, reload: boolean, setReload: any}) {
  const [polls, setPolls] = useState([]);
  const [pollOptions, setPollOptions] = useState([])
  async function getPolls() {
    let { data: polls } = await db
      .from('polls')
      .select('*')
    setPolls(polls)
    setReload(false)
  }

  async function getPollOptions() {
    let { data: pollOptions } = await db
      .from('poll_options')
      .select('*')
    setPollOptions(pollOptions)
  }

  useEffect(() => {
    getPolls();
  }, [reload]);

  useEffect(() => {
    getPollOptions();
  }, []);

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
          {polls.map((input,index) => <Tr key={index} bgColor="brand.sinopia">
            <Td>{pollOptions.find(option => option.id === input.poll_option)?.option || ''}</Td>
            <Td>{input.name}</Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

function Poll({db, setReload}: {db: any, setReload: any}) {
  const [optionsChosen, setOptionsChosen] = useState<Array<string>>([])
  const [name, setName] = useState<string>('')
  const [pollOptions, setPollOptions] = useState([])
  async function getPollOptions() {
    let { data: pollOptions } = await db
      .from('poll_options')
      .select('*')
    setPollOptions(pollOptions)
  }

  useEffect(() => {
    getPollOptions();
  }, []);

  return <form
      onSubmit={async (e) => {
      e.preventDefault();
        await db
          .from('polls')
          .insert(optionsChosen.map(option => ({poll_option: option, name: name})))
          .select()
      setOptionsChosen([])
      setName('')
      setReload(true)
    }}>
    <Stack direction={['column', 'row']}>
      {pollOptions.map(option => (
        <Checkbox key={option.id} variant="filled" onChange={(e) => {
          if (e.target.checked) {
            if (!optionsChosen.includes(option.id)) {
              setOptionsChosen([...optionsChosen, option.id])
            }
          } else {
            setOptionsChosen(optionsChosen.filter(optionChosen => optionChosen !== option.id))
          }
        }}>{option.option}</Checkbox>
      ))}
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}