import Factory from "./Factory.json"  with { type: "json" };
import Router from "./Router.json"  with { type: "json" };
import PairERC20 from "./PairERC20.json"  with { type: "json" };

// Uniswap V2 contracts
export const UNISWAP_ROUTER_V2 = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";
export const UNISWAP_FACTORY_V2 = "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6";

// Uniswap V3 contracts
export const UNISWAP_ROUTER_V3 = "0x2626664c2603336E57B271c5C0b26F421741e481";
export const UNISWAP_FACTORY_V3 = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";
export const UNISWAP_QUOTER_V3 = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";

// Wrapped ETH
export const WETH = "0x4200000000000000000000000000000000000006";

// Chain ID
export const CHAIN_ID = 8453;

// Uniswap V2 ABIs
export const UNISWAP_ROUTER_V2_ABI = Router;
export const UNISWAP_FACTORY_V2_ABI = Factory;
export const UNISWAP_PAIR_ERC20_V2_ABI = PairERC20;