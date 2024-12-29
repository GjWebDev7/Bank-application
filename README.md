# Bank Account Management System

This project is a simple bank account management system that allows users to log in, view their account details, perform transactions, request loans, and manage their account settings. The system features a user-friendly interface built with HTML, CSS, and JavaScript.

## Features

- **Login and Authentication:**
  - Users can log in using their username and PIN.
  - Usernames are generated automatically from the account owner's name.

- **Account Overview:**
  - Displays the user's current balance.
  - Displays recent transactions (deposits, withdrawals).
  - Provides a summary of total income, expenses, and earned interest.

- **Money Transfer:**
  - Users can transfer money between accounts.
  - Ensures that the sender has enough balance for the transfer.

- **Loan Requests:**
  - Users can request a loan if they have made a transaction equal to or greater than 10% of the loan amount.

- **Account Management:**
  - Users can close their account by providing the correct username and PIN.

- **Transaction Sorting:**
  - Users can sort their transactions in ascending order to view them more easily.

### JavaScript Functions

- `createUserNames`: Automatically generates usernames for each account.
- `calcDisplayBalance`: Calculates and displays the current balance of the account.
- `displayMovements`: Displays a list of the account’s transactions.
- `calcDisplaySummary`: Summarizes the account’s income, expenses, and interest earned.
- `updateUI`: Updates the user interface with the latest account details.
- `btnSort`: Sorts transactions in ascending order.
- `btnTransfer`: Handles money transfers between accounts.
- `btnLoan`: Handles loan requests from the user.
- `btnClose`: Closes the user's account after verification.

## How to Use

1. **Login:**
   - Enter your username and PIN to log in to your account.
   
2. **View Account:**
   - Once logged in, view your current balance, transaction history, and summary of income, expenses, and interest.

3. **Perform Transactions:**
   - Transfer money to other accounts by entering the recipient's username and the transfer amount.
   - Request a loan if eligible based on your previous transactions.

4. **Close Account:**
   - To close your account, enter your username and PIN.

5. **Sort Transactions:**
   - Click the "Sort" button to toggle between sorted and unsorted transactions.

## Testing Credentials:
   - User 1: Gaurav (Username: gj, PIN: 1111)
   - User 2: Souman (Username: sp, PIN: 2222)

## Deployment URL

You can access the live version of the Bank Account Management System at: https://gjwebdevbank.netlify.app/
