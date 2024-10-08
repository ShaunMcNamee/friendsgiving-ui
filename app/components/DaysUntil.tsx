'use client'

import { Text, Heading, Stack } from '@chakra-ui/react'
import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { addHours, format } from 'date-fns'

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
  const actualDate = addHours(new Date(date?.date || ''), 19)

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">When is Friendsgiving 2024?</Heading>
      <Text fontWeight="bold">We will celebrate at the McAmor&apos;s home on {format(actualDate, 'EEEE MMMM do')}. Everyone is welcome anytime after noon - we will have fall lunch/snacks for pre-meal noshing (Maggie is in her pumpkin era, all pumpkin/fall snacks encouraged). See below for settling on a time for the meal.</Text>
    </Stack>
  )
}