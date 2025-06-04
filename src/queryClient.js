// queryClient.js
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  10 * 1000,      // wait 10 sec
      cacheTime: 10  * 1000,      // wait 10 sec
      refetchOnWindowFocus: true,
    },
  },
});
