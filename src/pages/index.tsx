/* eslint-disable no-shadow */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam } = null) => {
      const response = await api.get('/api/images', {
        params: { after: pageParam },
      });
      return response;
    },
    {
      getNextPageParam: response => {
        if (response.data.after) {
          return response;
        }
        return null;
      },
    }
  );

  const formattedData = useMemo(() => {
    const dataRes = data?.pages?.map(data => {
      return {
        data: data?.data,
      };
    });

    const dataFormattedArr = dataRes?.map(data => data?.data?.data);

    return dataFormattedArr?.flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN

  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="10" bg="orange.500" onClick={() => fetchNextPage()}>
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
