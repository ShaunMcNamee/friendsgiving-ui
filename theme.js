import { extendTheme } from '@chakra-ui/react'
import { selectTheme } from './select'
import { inputTheme } from './input'
import { checkboxTheme } from './checkbox'

const theme = extendTheme({
  colors: {
    brand: {
      metallicSeaweed: '#03738C',
      blueMunsell: '#0396A6',
      orangeRyb: '#F29F05',
      tennesseeOrange: '#F27405',
      sinopia: '#D93D04',
    },
  },
  components: { Select: selectTheme, Input: inputTheme, Checkbox: checkboxTheme },
})

export default theme
