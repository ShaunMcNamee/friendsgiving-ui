'use client'

import {
  Text,
  Heading,
  Stack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_FOODS = gql`
  query GetFoods {
    foods {
      dish
      name
    }
  }
`;

type Foods = {
  dish: string
  name: string
}

export default function Foods() {
  const { loading, error, data } = useQuery<{foods: Array<Foods>}>(GET_FOODS)

  if (loading || error !== undefined || data === undefined) {
    return null
  }

  const foods = data.foods;

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">Foods</Heading>
      <Text fontWeight="bold">Please add any foods you are going to bring.</Text>
      <Form/>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th color="brand.orangeRyb">Dish</Th>
              <Th color="brand.orangeRyb">Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {foods.map((food,index) => <Tr key={index} bgColor="brand.sinopia">
              <Td>{food.dish}</Td>
              <Td>{food.name}</Td>
            </Tr>)}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

const ADD_FOOD = gql`
mutation foods($dish: String!, $name: String!) {
    createFood(input: {data: {dish: $dish, name: $name}}) {
      food {
        id
      }
    }
  }
`;

type FoodInput = {
  dish: string
  name: string
}

function Form() {
  const [dish, setDish] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [addFood, mutationData] = useMutation<FoodInput>(ADD_FOOD, {refetchQueries: [
      GET_FOODS,
    ]});

  if (mutationData.loading) {
    return <Text>Submitting . . . . </Text>
  }

  if (mutationData.error !== undefined) {
    return <Text>There was an error . . . . </Text>
  }

  return <form
    onSubmit={async (e) => {
      e.preventDefault();
      await addFood({ variables: { dish, name } });
      setDish('')
      setName('')
    }}>
    <Stack direction={['column', 'row']}>
      <Input placeholder="Dish" variant="filled" value={dish} onChange={(e) => setDish(e.target.value)}/>
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}