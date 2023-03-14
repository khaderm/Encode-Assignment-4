export default async () => ({
  privKey: process.env.PRIVATE_KEY,
  alchemyKey: process.env.ALCHEMY_API_KEY,
  tokenAddress: process.env.MY_TKN_ADDRESS,
  network: process.env.NETWORK,
});
