import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

export default async function handler(req, res) {
    // reads the api key from .env.local and starts Moralis SDK
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const address = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

    // Promise.all() for receiving data async from two endpoints
    const [nativeBalance, tokenBalances] = await Promise.all([
        Moralis.EvmApi.balance.getNativeBalance({
            chain: EvmChain.ETHEREUM,
            address,
        }),
        Moralis.EvmApi.token.getWalletTokenBalances({
            chain: EvmChain.ETHEREUM,
            address,
        }),
    ]);
    res.status(200).json({
        // formatting the output
        nativeBalance: nativeBalance.result.balance.ether,
        tokenBalances: tokenBalances.result.map((token) => token.display()),
    });
}