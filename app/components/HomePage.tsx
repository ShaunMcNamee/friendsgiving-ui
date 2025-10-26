'use client'

import { ChakraProvider, Box, Stack } from '@chakra-ui/react'
import React from 'react'
import theme from '../../theme'
import { createClient } from '@supabase/supabase-js'
import DaysUntil from './DaysUntil'
import Polling from './Polling'
import RSVP from './RSVP'
import Foods from './Foods'
import backgroundImage from "../../public/background.jpeg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {

  return (
    <ChakraProvider theme={theme}>
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
            <DaysUntil  db={supabase}/>
            <Polling  db={supabase}/>
            <RSVP db={supabase}/>
            <Foods db={supabase}/>
          </Stack>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
