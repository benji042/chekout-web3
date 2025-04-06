#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import ora from "ora";
import { Dex, tools } from "./Web3/Web3.js";
import { ethers } from "ethers";

const program = new Command();

console.log(
  chalk.yellow(figlet.textSync("Welcome to ChekOut", { horizontalLayout: "full" }))
);

program.version("1.0.0").description("Chekout provides automated swaping of tokens via Uniswap on the Base network");

program.action(() => {
  inquirer.prompt([
    {
      type: "select",
      choices: [
        {
          name: "Buying",
          value: "buy"
        },
        {
          name: "Selling",
          value: "sell"
        }
      ],
      name: "action",
      message: "Choose an action:",
    },
    {
      type: "select",
      choices: [
        {
          name: "Uniswap V2",
          value: Dex.V2
        },
        {
          name: "Uniswap V3",
          value: Dex.V3
        }
      ],
      name: "dex",
      message: "Choose the DEX to use when swapping your tokens:",
    },
  ]).then(async ({ action, dex }) => {
    inquirer.prompt([
      {
        type: "input",
        name: "token",
        message: action === "buy" ? "Enter the address of the token you'll like to buy?" : "Enter the address of the token you'll like to sell?",
      },
    ]).then(async ({ token }) => {
      if(dex === Dex.V2) {
        const pair = await tools.getPair(tools.provider(), token);
        if(pair !== ethers.ZeroAddress) {
          console.log(chalk.greenBright(`The pair address is ${pair}.`));

          inquirer.prompt([
            {
              type: "input",
              name: "amount",
              message: action === "buy" ? "Enter the amount of ETH you'll like to swap?" : "Enter the amount of tokens you'll like to swap?",
            },
          ]).then(async ({ amount }) => {

          });
        }
      } else {
        inquirer.prompt([
          {
            type: "input",
            name: "fee",
            message: "Enter the fee of the pool you'll like to trade in ie: 300, 500 etc?",
          },
        ]).then(async ({ fee }) => {
          const pool = await tools.getPool(tools.provider(), token, Number(fee));
          if(pool !== ethers.ZeroAddress) {
            console.log(chalk.greenBright(`The pool address is ${pool}.`));

            inquirer.prompt([
              {
                type: "input",
                name: "amount",
                message: action === "buy" ? "Enter the amount of ETH you'll like to swap?" : "Enter the amount of tokens you'll like to swap?",
              },
            ]).then(async ({ amount }) => {

            });
          }
        });
      }
    });
  });
});

program.parse(process.argv);