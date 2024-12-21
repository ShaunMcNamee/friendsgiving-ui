'use client'

import {
  Text,
  Heading,
  Stack,
  Input,
  Button,
} from '@chakra-ui/react'
import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { groupBy } from 'fp-ts/NonEmptyArray'

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

  const groupedFoods = groupBy((food: object) => food.name)(foods)

  console.log(groupedFoods)

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">Foods</Heading>
      <Text fontWeight="bold">Please add any foods you are going to bring.</Text>
      <Form/>
      <Heading color="brand.orangeRyb">Current committed foods</Heading>
      {
        Object.entries(groupedFoods).map(([key, value]) => (
          <>
          <Text fontWeight="bold">{key}:</Text>
            {value.map((food) => (<Text paddingLeft={12} fontWeight="bold">{food.dish}</Text>))}
          </>
        ))
      }
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