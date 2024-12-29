"use strict";

// Data: Account details with movements (transactions), interest rates, and PINs
const account1 = {
  owner: "Gaurav Jaiswal", // Account owner's name
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300], // Array of transactions
  interestRate: 3, // Interest rate in percentage
  pin: 1111, // PIN for login
};

const account2 = {
  owner: "Souman Paul",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 2,
  pin: 2222,
};

// Store all accounts in a single array
const accounts = [account1, account2];

// DOM Elements: Store references to UI elements for interaction and display
const labelWelcome = document.querySelector(".welcome"); // Welcome message
const inputLoginUsername = document.querySelector(".login__input--user"); // Username input field
const inputLoginPin = document.querySelector(".login__input--pin"); // PIN input field
const btnLogin = document.querySelector(".login__btn"); // Login button

const containerApp = document.querySelector(".app"); // App container
const labelBalance = document.querySelector(".balance__value"); // Balance display

const containerMovements = document.querySelector(".movements"); // Movements (transactions) container
const labelSumIn = document.querySelector(".summary__value--in"); // Income summary
const labelSumOut = document.querySelector(".summary__value--out"); // Outgoing summary
const labelSumInterest = document.querySelector(".summary__value--interest"); // Interest summary

const inputTransferTo = document.querySelector(".form__input--to"); // Transfer to input field
const inputTransferAmount = document.querySelector(".form__input--amount"); // Transfer amount field
const btnTransfer = document.querySelector(".form__btn--transfer"); // Transfer button

const inputLoanAmount = document.querySelector(".form__input--loan-amount"); // Loan amount field
const btnLoan = document.querySelector(".form__btn--loan"); // Loan request button

const inputCloseUsername = document.querySelector(".form__input--user"); // Close account username field
const inputClosePin = document.querySelector(".form__input--pin"); // Close account PIN field
const btnClose = document.querySelector(".form__btn--close"); // Close account button

const btnSort = document.querySelector(".btn--sort"); // Sort transactions button

/*-----------------------------------------------------------------------*/

// Function to create usernames for accounts
const createUserNames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase() // Convert name to lowercase
      .split(" ") // Split full name into words
      .map((user) => user[0]) // Extract first letter of each word
      .join(""); // Combine letters to form username
  });
};

// Generate usernames for all accounts
createUserNames(accounts);

/*-----------------------------------------------------------------------*/

// Event Listener: Login
let currentAccount; // Store the currently logged-in account
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from reloading the page

  // Match entered username with an account
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // Validate PIN and allow login
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1; // Show application UI
    inputLoginUsername.value = inputLoginPin.value = ""; // Clear login fields
    inputLoginPin.blur(); // Remove focus from PIN input
    updateUI(currentAccount); // Update UI with account data
  }
});

/*-----------------------------------------------------------------------*/

// Function to calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0); // Calculate balance
  labelBalance.textContent = `${acc.balance} ₹`; // Display balance
};

/*-----------------------------------------------------------------------*/

// Function to display movements (transactions)
const displayMovements = function (movements) {
  containerMovements.innerHTML = ""; // Clear previous transactions

  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal"; // Determine type
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov} ₹</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html); // Add transaction to UI
  });
};

/*-----------------------------------------------------------------------*/

// Function to calculate and display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${incomes} ₹`; // Display total deposits

  const expenses = acc.movements
    .filter((mov) => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses)} ₹`; // Display total withdrawals

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1) // Only include interest ≥ 1 ₹
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest} ₹`; // Display interest
};

/*-----------------------------------------------------------------------*/

// Function to update the UI with account data
function updateUI(acc) {
  displayMovements(acc.movements); // Display transactions
  calcDisplayBalance(acc); // Display balance
  calcDisplaySummary(acc); // Display summary
}

/*-----------------------------------------------------------------------*/

// Event Listener: Sort Transactions
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  const sortedMovements = sorted
    ? currentAccount.movements // Original order
    : currentAccount.movements.slice().sort((a, b) => a - b); // Ascending sort
  displayMovements(sortedMovements); // Update UI
  sorted = !sorted; // Toggle sort state
});

/*-----------------------------------------------------------------------*/

// Event Listener: Money Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Perform transfer if conditions are met
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount); // Deduct from sender
    receiverAccount.movements.push(amount); // Add to receiver
    updateUI(currentAccount); // Update sender's UI
  }
  inputTransferAmount.value = inputTransferTo.value = ""; // Clear input fields
});

/*-----------------------------------------------------------------------*/

// Event Listener: Request Loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount); // Add loan to account
    updateUI(currentAccount); // Update UI
  }
  inputLoanAmount.value = ""; // Clear input
});

/*-----------------------------------------------------------------------*/

// Event Listener: Close Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1); // Remove account
    containerApp.style.opacity = 0; // Hide UI
  }
  inputCloseUsername.value = inputClosePin.value = ""; // Clear input fields
});
