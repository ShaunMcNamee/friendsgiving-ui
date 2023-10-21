import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const filled = definePartsStyle({
  control: defineStyle({
    backgroundColor: "brand.sinopia",
    color: "brand.orangeRyb",
    borderRadius: 0,
    border: 0,
  }),
  label: defineStyle({
    color:"brand.orangeRyb",
    fontWeight:"bold"
  }),
  icon: defineStyle({
    backgroundColor: "brand.sinopia",
    color: "brand.orangeRyb",
    borderRadius: 0,
    border: 0,
  })
})

export const checkboxTheme = defineMultiStyleConfig({
  variants: { filled },
})