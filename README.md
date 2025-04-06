# ChekOut

ChekOut is a command-line tool that provides automated swapping of tokens via Uniswap on the Base network. It allows users to buy and sell tokens easily by interacting with the Uniswap decentralized exchange (DEX).

## Features

- **Token Swapping**: Buy and sell tokens using Uniswap V2 and V3.
- **User-Friendly Interface**: Interactive prompts guide users through the process.
- **Support for Multiple DEXs**: Choose between Uniswap V2 and V3 for token swaps.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benji042/chekout-web3.git
   cd chekout-web3
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Install globally for CLI usage:
   ```bash
   npm link
   ```

4. Build the dist directory:
   ```bash
   npm run build
   ```

## Usage

To run the application, use the following command in your terminal:

```bash
chekout
```

## Issues

If you come across permission issues on Moc or Linux, run the following command in your terminal:

```bash
chmod +x ./dist/index.js
```

if you come across permission issues on Windows, run the following command in powershell(as admin):

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Steps to Swap Tokens

1. **Choose an Action**: When prompted, select whether you want to buy or sell a token.
2. **Select a DEX**: Choose between Uniswap V2 or V3 for the token swap.
3. **Enter Token Address**: Provide the address of the token you wish to buy or sell.
4. **Enter Amount**: Specify the amount of ETH or tokens you want to swap.
5. **For Uniswap V3**: If you selected Uniswap V3, you will also need to enter the fee of the pool you wish to trade in.

## Example

```bash
$ chekout
Welcome to ChekOut
Choose an action:
  1. Buying
  2. Selling
Choose the DEX to use when swapping your tokens:
  1. Uniswap V2
  2. Uniswap V3
Enter the address of the token you'll like to buy?
Enter the amount of ETH you'll like to swap?
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Uniswap](https://uniswap.org/) for providing the DEX functionality.
- [Chalk](https://github.com/chalk/chalk) for colorful terminal output.
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) for interactive command-line prompts.