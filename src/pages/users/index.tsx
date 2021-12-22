import { Box, Flex, Heading, Button, Icon, Table, Thead, Tr, Th, Checkbox, Tbody, Td, Text, useBreakpointValue, Spinner, Link } from '@chakra-ui/react'
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import NextLink from 'next/link'
import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Pagination} from '../../components/Pagination';
import { useUsers } from '../../services/hooks/useUsers';
import { queryClient } from '../../services/queryClient.ts';
import { api } from '../../services/api';

export default function Userlist() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useUsers(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  async function handlePrefetchUser(userId: number) {
    await queryClient.prefetchQuery(['users', userId], async () => {
      const response = await api.get(`users/${userId}`)

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutes
    })
  }
  
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

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
              >
                Criar novo
              </Button>
            </NextLink>
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
                      {data.users.map(user => (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td px={["4", "4", "6"]}>
                            <Box>
                              <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                <Text fontWeight="bold">{user.name}</Text>
                              </Link>
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

                  <Pagination 
                    totalCountOfRegisters={data.totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </>
            )
          }
        </Box>
      </Flex>
    </Box>
  );
}