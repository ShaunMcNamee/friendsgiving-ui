'use client'

import { Text, Heading, Stack } from '@chakra-ui/react'
import React from 'react'
import { gql, useQuery } from '@apollo/client';

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
      <Heading color="brand.orangeRyb">A poll on when food should be served</Heading>
      <Text>Poll Here</Text>
    </Stack>
  )
}