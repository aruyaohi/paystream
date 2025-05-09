// import type { NextConfig } from "next";
// import { createCivicAuthPlugin } from "@civic/auth/nextjs"

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// const withCivicAuth = createCivicAuthPlugin({
//   clientId: "b9b288a8-8e48-47bd-9a6b-abc49bdd09c1"
// });


// export default withCivicAuth(nextConfig);

import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "b9b288a8-8e48-47bd-9a6b-abc49bdd09c1"
});

export default withCivicAuth(nextConfig)