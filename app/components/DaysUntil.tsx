'use client'

import { Text, Heading, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { addHours, format } from 'date-fns'

export default function DaysUntil({db}: {db: any}) {
  const [date, setDate] = useState('')
  async function getDate() {
    let { data: date } = await db
      .from('date')
      .select('*')
    setDate(date[0].date)
  }

  useEffect(() => {
    getDate();
  }, []);

  // To account for time zone differences
  const actualDate = addHours(new Date(date || ''), 19)
  const displayDate = date !== '' ? format(actualDate, 'EEEE MMMM do') : ''

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">When is Friendsgiving 2025?</Heading>
      <Text fontWeight="bold">We will celebrate at the McAmor&apos;s home on {displayDate}. Everyone is welcome anytime after noon - we will have fall lunch/snacks for pre-meal noshing. See below for settling on a time for the meal.</Text>
    </Stack>
  )
}