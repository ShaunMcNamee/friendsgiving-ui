'use client'

import {
  Text,
  Heading,
  Stack,
  Input,
  Button,
} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import { groupBy } from 'fp-ts/NonEmptyArray'

export default function Foods({db}: {db: any}) {
  const [reload, setReload] = useState<boolean>(true)
  const [foods, setFoods] = useState([]);
  async function getFoods() {
    let { data: foods } = await db
      .from('foods')
      .select('*')
    setFoods(foods)
    setReload(false)
  }

  useEffect(() => {
    getFoods();
  }, [reload]);

  const groupedFoods = groupBy((food: any) => food.name)(foods)

  return (
    <Stack spacing={4}>
      <Heading color="brand.orangeRyb">Foods</Heading>
      <Text fontWeight="bold">Please add any foods you are going to bring.</Text>
      <Form db={db} setReload={setReload}/>
      <Heading color="brand.orangeRyb">Current committed foods</Heading>
      {
        Object.entries(groupedFoods).map(([key, value]) => (
          <>
          <Text fontWeight="bold" key={key}>{key}:</Text>
            {value.map((food) => (<Text paddingLeft={12} fontWeight="bold" key={food.id}>{food.dish}</Text>))}
          </>
        ))
      }
    </Stack>
  )
}

function Form({db, setReload}: {db: any, setReload: any}) {
  const [dish, setDish] = useState<string>('')
  const [name, setName] = useState<string>('')

  return <form
    onSubmit={async (e) => {
      e.preventDefault()
      await db
        .from('foods')
        .insert([
          { dish, name },
        ])
        .select()
      setDish('')
      setName('')
      setReload(true)
    }}>
    <Stack direction={['column', 'row']}>
      <Input placeholder="Dish" variant="filled" value={dish} onChange={(e) => setDish(e.target.value)}/>
      <Input placeholder="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
      <Button bg="brand.sinopia" _hover={{background: 'brand.orangeRyb'}} px={6} type="submit">Submit</Button>
    </Stack>
  </form>
}