import { Box, Flex, Heading, Button, Icon, Table, Thead, Tr, Th, Checkbox, Tbody, Td, Text, useBreakpointValue, Spinner } from '@chakra-ui/react'
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import Link from 'next/link'
import { useQuery } from 'react-query'
import { useEffect } from 'react';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Pagination} from '../../components/Pagination';
import { api } from '../../services/api';

export default function Userlist() {
  const { data, isLoading, error, isFetching } = useQuery('users', async () => {
    const { data } = await api.get('/users')

    const users = data.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
    }));

    return users;
  }, {
    staleTime: 1000 * 5, // 5 seconds
  })

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
    .then((response) => response.json())
    .then(data => console.log(data));
  }, [])

  return (
    <Box>
      <Header />

      <Flex
        w="100%"
        my="6"
        maxWidth={1480}
        mx="auto"
        px="6"
      >
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários

              {!isLoading && isFetching && <Spinner size='sm' color='gray.500' ml='4'/>}
            </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>
          {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados de usuários</Text>
              </Flex>
            ) : (
                <>
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="8">
                          <Checkbox colorScheme="pink" />
                        </Th>
                        <Th px={["4", "4", "6"]}>Usuário</Th>
                        { isWideVersion && <Th>Data de cadastro</Th>}
                        <Th width="8"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map(user => (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td px={["4", "4", "6"]}>
                            <Box>
                              <Text fontWeight="bold">{user.name}</Text>
                              <Text fontWeight="sm" color="gray.300">{user.email}</Text>
                            </Box>
                          </Td>
                          { isWideVersion && <Td>{user.createdAt}</Td>}
                          { isWideVersion && (
                            <Td>
                                <Button
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="purple"
                                  leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                                >
                                  { isWideVersion ? 'Editar' : '' }
                                </Button>
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Pagination />
                </>
            )
          }
        </Box>
      </Flex>
    </Box>
  );
}