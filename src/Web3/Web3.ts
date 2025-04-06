import { ethers, HDNodeWallet, JsonRpcProvider } from "ethers";
import { CHAIN_ID, UNISWAP_FACTORY_V2, UNISWAP_FACTORY_V2_ABI, UNISWAP_FACTORY_V3, UNISWAP_PAIR_ERC20_V2_ABI, UNISWAP_QUOTER_V3, UNISWAP_ROUTER_V2, UNISWAP_ROUTER_V2_ABI, UNISWAP_ROUTER_V3, WETH } from "./config.js";
import UNISWAP_FACTORY_V3_ABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json" with { type: "json" };
import UNISWAP_POOL_V3_ABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"  with { type: "json" };
import UNISWAP_ROUTER_V3_ABI from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json"  with { type: "json" };
import UNISWAP_QUOTER_V3_ABI from "@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json"  with { type: "json" };
import { FeeAmount, Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";

export enum Dex {
    V2 = 'v2',
    V3 = 'v3'
}

export const tools = {
    provider() {
        return new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
    },

    validAmount(amount: number): boolean {
        const [x, y] = amount.toString().split('.');

        if(y.length > 18) {
            return false;
        }

        return true;
    },
    
    generateWallet(provider: JsonRpcProvider): HDNodeWallet {
        const wallet = ethers.Wallet.createRandom(provider);
        console.log(wallet);

        return wallet;
    },

    async getBlockTimestamp(provider: JsonRpcProvider): Promise<number> {
        try {
            const block = await provider.getBlock('latest');
            const timestamp = block!.timestamp;
            console.log(timestamp);

            return timestamp;
        } catch (error) {
            console.log(error);
            throw new Error('GET_TIMESTAMP_FAILED');
        }
    },

    async getTokenInfo(provider: JsonRpcProvider, address: string): Promise<Token> {
        try {
            const pair = new ethers.Contract(
                address,
                UNISWAP_PAIR_ERC20_V2_ABI.abi,
                provider
            );

            const [name, symbol, decimals] = await Promise.all([
                pair.name(),
                pair.symbol(),
                pair.decimals(),
            ]);
            
            const token = new Token(CHAIN_ID, address, Number(decimals), symbol, name);
            console.log(token);

            return token;
        } catch (error) {
            console.log(error);
            throw new Error('GET_TOKEN_INFO_FAILED');
        }
    },

    async getWalletBalance(provider: JsonRpcProvider, privateKey: string): Promise<number> {
        try {
            const wallet = new ethers.Wallet(privateKey, provider);
            const balance = await provider.getBalance(wallet.address);
            console.log(ethers.formatEther(balance));

            return Number(ethers.formatEther(balance));
        } catch (error) {
            console.log(error);
            throw new Error('GET_WALLET_BALANCE_FAILED');
        }
    },

    async getTokenBalance(provider: JsonRpcProvider, privateKey: string, token: string): Promise<number[]> {
        try {
            const wallet = new ethers.Wallet(privateKey, provider);
            const pair = new ethers.Contract(
                token,
                UNISWAP_PAIR_ERC20_V2_ABI.abi,
                provider
            );

            const [balance, decimals] = await Promise.all([
                pair.balanceOf(wallet.address),
                pair.decimals(),
            ]);
            console.log(ethers.formatUnits(balance, decimals), Number(decimals));

            return [Number(ethers.formatUnits(balance, decimals)), Number(decimals)];
        } catch (error) {
            console.log(error);
            throw new Error('GET_TOKEN_BALANCE_FAILED');
        }
    },

    async getPair(provider: JsonRpcProvider, token: string): Promise<string> {
        try {
            const factory = new ethers.Contract(
                UNISWAP_FACTORY_V2,
                UNISWAP_FACTORY_V2_ABI.abi,
                provider
            );

            const pair = await factory.getPair(token, WETH);
            console.log(pair);

            return pair;
        } catch (error) {
            console.log(error);
            throw new Error('GET_PAIR_FAILED');
        }
    },

    async getPool(provider: JsonRpcProvider, token: string, fee: number): Promise<string> {
        try {
            const factory = new ethers.Contract(
                UNISWAP_FACTORY_V3,
                UNISWAP_FACTORY_V3_ABI.abi,
                provider
            );

            const pool = await factory.getPool(token, WETH, fee);
            console.log(pool);

            return pool;
        } catch (error) {
            console.log(error);
            throw new Error('GET_POOL_FAILED');
        }
    },

    async getPoolData(provider: JsonRpcProvider, address: string): Promise<Pool> {
        try {
            const pool = new ethers.Contract(
                address,
                UNISWAP_POOL_V3_ABI.abi,
                provider
            );

            const [token0, token1, fee, liquidity, slot] = await Promise.all([
                pool.token0(),
                pool.token1(),
                pool.fee(),
                pool.liquidity(),
                pool.slot0(),
            ]);

            const _pool = new Pool(
                token0,
                token1,
                fee,
                slot[0].toString(),
                liquidity.toString(),
                slot[1]
            );
            console.log(_pool);

            return _pool;
        } catch (error) {
            console.log(error);
            throw new Error('GET_POOL_DATA_FAILED');
        }
    },

    async getPoolImmutables(provider: JsonRpcProvider, address: string): Promise<{ token0: number, token1: number, fee: number }> {
        try {
            const pool = new ethers.Contract(
                address,
                UNISWAP_POOL_V3_ABI.abi,
                provider
            );

            const [token0, token1, fee] = await Promise.all([
                pool.token0(),
                pool.token1(),
                pool.fee()
            ]);
            console.log({ token0, token1, fee });

            return { token0, token1, fee };
        } catch (error) {
            console.log(error);
            throw new Error('GET_POOL_IMMUTABLES_FAILED');
        }
    },

    async getPoolState(provider: JsonRpcProvider, address: string): Promise<{ liquidity: string, sqrtPriceX96: string, tick: number }> {
        try {
            const pool = new ethers.Contract(
                address,
                UNISWAP_POOL_V3_ABI.abi,
                provider
            );

            const [liquidity, slot] = await Promise.all([
                pool.liquidity(),
                pool.slot0()
            ]);
            console.log(liquidity, slot);

            return {
                liquidity: liquidity.toString(),
                sqrtPriceX96: slot[0].toString(),
                tick: Number(slot[1]),
            };
        } catch (error) {
            console.log(error);
            throw new Error('GET_POOL_STATE_FAILED');
        }
    },

    async getAmountsOut(provider: JsonRpcProvider, token: string, amount: number, state: 'buy' | 'sell', decimals?: number): Promise<number[]> {
        try {
            const router = new ethers.Contract(
                UNISWAP_ROUTER_V2,
                UNISWAP_ROUTER_V2_ABI.abi,
                provider
            );

            const path = state === 'buy' ? [WETH, token] : [token, WETH];
            const value = state === 'buy' ? ethers.parseEther(`${amount}`) : ethers.parseUnits(`${amount}`, decimals);

            const amountsOut = await router.getAmountsOut(value, path);
            console.log(amountsOut);

            return amountsOut;
        } catch (error) {
            console.log(error);
            throw new Error('GET_AMOUNTS_OUT_FAILED');
        }
    },

    async getQuote(provider: JsonRpcProvider, token: string, fee: number, amount: number, state: 'buy' | 'sell', decimals?: number): Promise<number> {
        try {
            const quoter: any = new ethers.Contract(
                UNISWAP_QUOTER_V3,
                UNISWAP_QUOTER_V3_ABI.abi,
                provider
            );

            const [tokenIn, tokenOut] = state === 'buy' ? [WETH, token] : [token, WETH];
            const value = state === 'buy' ? ethers.parseEther(`${amount}`) : ethers.parseUnits(`${amount}`, decimals);

            const amountOut = await quoter.callStatic.quoteExactInputSingle(
                tokenIn,
                tokenOut,
                fee,
                value,
                0
            );
            console.log(amountOut);

            return amountOut;
        } catch (error) {
            console.log(error);
            throw new Error('GET_QUOTE_FAILED');
        }
    },

    async transfer(provider: JsonRpcProvider, privateKey: string, reciepient: string, amount: number): Promise<void> {
        try {
            const signer = new ethers.Wallet(privateKey, provider);
            const to = new ethers.Wallet(reciepient, provider);

            const tx = await signer.sendTransaction({
                to: to.address,
                value: ethers.parseEther(`${amount}`)
            });
            
            console.log(`Transfer transaction sent successfully, Tx Hash: ${tx.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('TRANSFER_FAILED');
        }
    },

    async approve(provider: JsonRpcProvider, privateKey: string, token: string, dex: Dex): Promise<boolean> {
        try {
            const signer = new ethers.Wallet(privateKey, provider);
            const pair = new ethers.Contract(
                token,
                UNISWAP_PAIR_ERC20_V2_ABI.abi,
                signer
            );
            const router = dex === Dex.V2 ? UNISWAP_ROUTER_V2 : UNISWAP_ROUTER_V3;

            const [allowance, supply] = await Promise.all([
                pair.allowance(signer.address, router),
                pair.totalSupply()
            ]);
            console.log(allowance, supply);

            if(Number(allowance) === Number(supply)) {
                return true;
            }

            const tx = await pair.approve(router, supply, {
                gasPrice: ethers.parseUnits('1', 'gwei')
            });

            console.log(`Approve transaction sent successfully, Tx Hash: ${tx.hash}`);

            return true;
        } catch (error) {
            console.log(error);
            throw new Error('APPROVE_TOKENS_FAILED');
        }
    },

    async buyV2(provider: JsonRpcProvider, privateKey: string, token: string, amount: number): Promise<void> {
        try {
            const validAmount = this.validAmount(amount);
            amount = validAmount ? amount : Number(amount.toFixed(18));

            const timestamp = await this.getBlockTimestamp(provider);
            const signer = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(
                UNISWAP_ROUTER_V2,
                UNISWAP_ROUTER_V2_ABI.abi,
                signer
            );
            const [amount0, amount1] = await this.getAmountsOut(provider, token, amount, 'buy');

            const tx = await router.swapExactETHForTokens(
                amount1,
                [WETH, token],
                signer.address,
                timestamp + (60 * 10),
                {
                    value: ethers.parseEther(`${amount}`),
                    gasPrice: ethers.parseUnits('1', 'gwei')
                }
            );
            
            console.log(`Buy V2 transaction sent successfully, Tx Hash: ${tx.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('BUY_TOKENS_FAILED');
        }
    },

    async sellV2(provider: JsonRpcProvider, privateKey: string, token: string, amount: number, decimals: number): Promise<void> {
        try {
            const validAmount = this.validAmount(amount);
            amount = validAmount ? amount : Number(amount.toFixed(18));

            const timestamp = await this.getBlockTimestamp(provider);
            const signer = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(
                UNISWAP_ROUTER_V2,
                UNISWAP_ROUTER_V2_ABI.abi,
                signer
            );
            const [amount0, amount1] = await this.getAmountsOut(provider, token, amount, 'sell', decimals);

            const tx = await router.swapExactTokensForETH(
                ethers.parseUnits(`${amount}`, decimals),
                amount1,
                [token, WETH],
                signer.address,
                timestamp + (60 * 10),
                {
                    value: 0,
                    gasPrice: ethers.parseUnits('1', 'gwei')
                }
            );
            
            console.log(`Sell V2 transaction sent successfully, Tx Hash: ${tx.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('SELL_TOKENS_FAILED');
        }
    },

    async buyV3(provider: JsonRpcProvider, privateKey: string, pool: string, token: string, amount: number): Promise<void> {
        try {
            const validAmount = this.validAmount(amount);
            amount = validAmount ? amount : Number(amount.toFixed(18));

            const timestamp = await this.getBlockTimestamp(provider);
            const signer = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(
                UNISWAP_ROUTER_V3,
                UNISWAP_ROUTER_V3_ABI.abi,
                signer
            );
            const { fee } = await this.getPoolData(provider, pool);
            const amountOut = await this.getQuote(provider, token, fee, amount, 'buy');

            const params = {
                tokenIn: WETH,
                tokenOut: token,
                fee,
                recipient: signer.address,
                deadline: timestamp + (60 * 10),
                amountIn: ethers.parseEther(`${amount}`),
                amountOutMinimum: amountOut,
                sqrtPriceLimitX96: 0
            };

            const tx = await router.exactInputSingle(
                params,
                {
                    value: ethers.parseEther(`${amount}`),
                    gasPrice: ethers.parseUnits('1', 'gwei')
                }
            );
            
            console.log(`Buy V3 transaction sent successfully, Tx Hash: ${tx.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('BUY_TOKENS_FAILED');
        }
    },

    async sellV3(provider: JsonRpcProvider, privateKey: string, pool: string, token: string, amount: number, decimals: number): Promise<void> {
        try {
            const validAmount = this.validAmount(amount);
            amount = validAmount ? amount : Number(amount.toFixed(18));

            const timestamp = await this.getBlockTimestamp(provider);
            const signer = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(
                UNISWAP_ROUTER_V3,
                UNISWAP_ROUTER_V3_ABI.abi,
                signer
            );

            const { fee } = await this.getPoolData(provider, pool);
            const amountOut = await this.getQuote(provider, token, fee, amount, 'sell', decimals);

            const params = {
                tokenIn: token,
                tokenOut: WETH,
                fee,
                recipient: signer.address,
                deadline: timestamp + (60 * 10),
                amountIn: ethers.parseUnits(`${amount}`, decimals),
                amountOutMinimum: amountOut,
                sqrtPriceLimitX96: 0
            };

            const tx = await router.exactInputSingle(
                params,
                {
                    value: 0,
                    gasPrice: ethers.parseUnits('1', 'gwei')
                }
            );
            
            console.log(`Sell V3 transaction sent successfully, Tx Hash: ${tx.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('SELL_TOKENS_FAILED');
        }
    },
}