// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";

// export function ReactQueryProvider({ children }) {
//   // useState so each browser session gets its own QueryClient
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             // Data is fresh for 5 min — no refetch during this window
//             staleTime: 5 * 60 * 1000,
//             // Keep cached data for 15 min even after component unmounts
//             gcTime: 15 * 60 * 1000,
//             // Auto refetch every 10 min (proxy cache is 10 min)
//             refetchInterval: 10 * 60 * 1000,
//             // Refetch when user comes back to the tab
//             refetchOnWindowFocus: true,
//             // Retry 3x with exponential backoff — fixes Render free tier sleep
//             retry: 3,
//             retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
//           },
//         },
//       }),
//   );

//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 15 * 60 * 1000,
            refetchInterval: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
