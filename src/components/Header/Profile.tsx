import { Box, Flex, Text, Avatar } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center" >
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Thiago Rovetta</Text>
          <Text color="gray.300" fontSize="small">
            thiagovini2@hotmail.com
          </Text>
        </Box>
      )}

      <Avatar size="md" name="Thiago Rovetta" src="https://github.com/thiagorovetta.png" />
    </Flex>
  )
}