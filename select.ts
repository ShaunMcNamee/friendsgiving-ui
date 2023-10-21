import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const {
  definePartsStyle,
  defineMultiStyleConfig
} = createMultiStyleConfigHelpers(selectAnatomy.keys);

const filled = definePartsStyle({
  field: {
    background: "brand.sinopia",
    _focus: {
      background: "brand.sinopia",
    },
    _hover: {
      background: "brand.orangeRyb",
    },
  },
  icon: {
    color: 'black',
  }
});

export const selectTheme = defineMultiStyleConfig({
  variants: { filled }
});