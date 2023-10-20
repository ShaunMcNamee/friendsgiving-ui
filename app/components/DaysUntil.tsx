'use client'

import { Text, Heading, Stack } from '@chakra-ui/react'
import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { addHours, differenceInDays, format } from 'date-fns'

const GET_DATES = gql`
  query GetDates {
    friendsgivingDates {
      id
      date
      active
    }
  }
`;

type FriendsgivingDate = {
  id: number
  date: string
  active: boolean
}

export default function DaysUntil() {
  const { loading, error, data } = useQuery<{friendsgivingDates: Array<FriendsgivingDate>}>(GET_DATES)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const date = data.friendsgivingDates.find((fDate:FriendsgivingDate) => fDate.active);
  // To account for time zone differences
  const actualDate = addHours(new Date(date?.date || ''), 6)
  const today = new Date();

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">When is Friendsgiving?</Heading>
      <Text>Friendsgiving is on {format(actualDate, 'MMM dd, yyyy')}, which is {differenceInDays(actualDate, today)} days from now.</Text>
    </Stack>
  )
}