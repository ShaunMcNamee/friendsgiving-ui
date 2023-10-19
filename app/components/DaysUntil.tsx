'use client'

import { Text } from '@chakra-ui/react'
import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { differenceInDays, format } from 'date-fns'

const GET_DATES = gql`
  query GetDates {
    friendsgivingDates {
      id
      date
      active
    }
  }
`;

export default function DaysUntil() {
  const { loading, error, data } = useQuery(GET_DATES)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const date = data.friendsgivingDates.find((fDate ) => fDate.active);
  const actualDate = new Date(date.date)
  const today = new Date();

  return (
    <Text>Friendsgiving is on {format(actualDate, 'MMM dd, yyyy')}, which is {differenceInDays(actualDate, today)} days from now</Text>
  )
}