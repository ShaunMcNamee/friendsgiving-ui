import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const filled = definePartsStyle({
  field: {
    backgroundColor: 'brand.sinopia',
    color: 'black',
    _focus: {
      background: "brand.sinopia",
    },
    _hover: {
      background: "brand.orangeRyb",
    },
    _placeholder: {
      color: 'black',
    }
  },
})

export const inputTheme = defineMultiStyleConfig({ variants: { filled } })