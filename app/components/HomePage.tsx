'use client'

import { ChakraProvider, Box, Text } from '@chakra-ui/react'
import React from 'react'
import theme from '../../theme'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import DaysUntil from './DaysUntil'

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_CMS_URL,
  cache: new InMemoryCache(),
});

export default function HomePage() {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <Box
          margin="0 !important"
          as="main"
          flex="1"
          overflow="scroll"
          bg="brand.metallicSeaweed"
          h="100vh"
        >
          <Box m="0 auto" maxW="1200" py="16" px="6">
            <DaysUntil/>
            <Text color="brand.orangeRyb">Here is some text in the first color.</Text>
            <Text color="brand.tennesseeOrange">Does this second color perhaps look better?</Text>
            <Text color="brand.sinopia">How is the third color?</Text>
          </Box>
        </Box>
      </ApolloProvider>
    </ChakraProvider>
  )
}
