'use client'

import { ChakraProvider, Box, Stack } from '@chakra-ui/react'
import React from 'react'
import theme from '../../theme'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import DaysUntil from './DaysUntil'
import Polling from './Polling'
import backgroundImage from "../../public/background.jpeg";

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
          backgroundImage={`url(${backgroundImage.src})`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
        >
          <Box m="0 auto" maxW="1200" py={{ base: '350px', md: '550px' }} px="6">
            <Stack spacing="36px">
              <DaysUntil/>
              <Polling />
            </Stack>
          </Box>
        </Box>
      </ApolloProvider>
    </ChakraProvider>
  )
}
