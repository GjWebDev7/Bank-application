'use strict'; // Enforces strict mode for better error handling and to prevent using undeclared variables

// Define account1 object with account details
const account1 = {
  owner: 'Gaurav Jaiswal', // Owner's name
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300], // List of movements (transactions)
  interestRate: 1.2, // Interest rate
  pin: 1111, // PIN code for authentication

  movementsDates: [
    // List of movement dates corresponding to transactions
    '2019-11-19T03:01:17.178Z',
    '2019-12-23T13:12:02.383Z',
    '2020-01-28T14:45:04.904Z',
    '2020-04-01T15:47:24.185Z',
    '2020-05-08T19:41:59.604Z',
    '2020-05-27T22:31:17.194Z',
    '2020-07-12T05:06:17.929Z',
    '2020-07-12T16:21:36.790Z',
  ],
};

// Define account2 object with account details
const account2 = {
  owner: 'Souman Paul', // Owner's name
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30], // List of movements (transactions)
  interestRate: 1.5, // Interest rate
  pin: 2222, // PIN code for authentication

  movementsDates: [
    // List of movement dates corresponding to transactions
    '2019-11-01T18:45:33.035Z',
    '2019-11-30T15:18:16.867Z',
    '2019-12-25T11:34:23.907Z',
    '2020-01-25T19:48:46.235Z',
    '2020-02-05T22:03:06.386Z',
    '2020-04-10T20:13:26.374Z',
    '2020-06-25T00:19:59.371Z',
    '2020-07-26T17:31:20.894Z',
  ],
};

// List of all accounts
const accounts = [account1, account2];

// Select DOM elements for manipulating the UI
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnSort = document.querySelector('.btn--sort');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Function to display the movements (transactions) on the UI
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // Clear the container

  // Sort movements if required
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Iterate through movements and create HTML for each transaction
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; // Determine the type of transaction

    const date = new Date(acc.movementsDates[i]); // Convert date string to Date object
    const day = `${date.getDate()}`.padStart(2, 0); // Get day
    const month = `${date.getMonth() + 1}`.padStart(2, 0); // Get month (zero-based)
    const year = date.getFullYear(); // Get year
    const displayDate = `${day}/${month}/${year}`; // Format date

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
          </div>
          <div class="movements__date">
          ${displayDate}
          </div>
          <div class="movements__value">
          ${mov + '₹'}
          </div>
    </div>`;

    // Insert the transaction into the container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Function to calculate and display the account balance
const calcDisplayBalance = function (acc) {
  // Calculate the balance by summing all movements
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // Display the balance on the UI
  labelBalance.textContent = `${acc.balance}₹`;
};

// Function to calculate and display the summary of incomes, outcomes, and interest
const calcDisplaySummary = function (acc) {
  // Calculate total income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Calculate total outcome
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Calculate total interest earned
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      return interest >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);

  // Display the summary on the UI
  labelSumIn.textContent = `${incomes}₹`;
  labelSumOut.textContent = `${Math.abs(outcomes)}₹`;
  labelSumInterest.textContent = `${interest}₹`;
};

// Function to create usernames for each account (based on owner's initials)
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // Take the first letter of each name
      .join(''); // Join them together to form the username
  });
};
createUsernames(accounts); // Create usernames for all accounts

// Function to update the UI with the current account's data
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Function to start a logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0); // Get minutes
    const sec = String(time % 60).padStart(2, 0); // Get seconds

    labelTimer.textContent = `${min}:${sec}`; // Display timer

    if (time === 0) {
      // If time is up
      clearInterval(timer); // Clear the interval
      labelWelcome.textContent = 'Log in to get started'; // Reset welcome message
      containerApp.style.opacity = 0; // Hide the app
    }

    time--; // Decrease time
  };

  let time = 120; // Set initial time to 2 minutes

  tick(); // Call tick function immediately
  const timer = setInterval(tick, 1000); // Call tick every second

  return timer; // Return the timer
};

// Event handler for login
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission

  // Find the account with the entered username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Check if the PIN is correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and show UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0); // Get day
    const month = `${now.getMonth() + 1}`.padStart(2, 0); // Get month (zero-based)
    const year = now.getFullYear(); // Get year
    const hour = `${now.getHours()}`.padStart(2, 0); // Get hours
    const min = `${now.getMinutes()}`.padStart(2, 0); // Get minutes
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; // Display date and time

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // Remove focus from the pin input

    if (timer) clearInterval(timer); // Clear previous timer if any

    timer = startLogOutTimer(); // Start a new logout timer

    // Update the UI with current account data
    updateUI(currentAccount);
  }
});

// Event handler for money transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission

  // Get the transfer amount and recipient account
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  // Check if transfer conditions are met
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Execute the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update the UI with current account data
    updateUI(currentAccount);
  }
});

// Event handler for loan request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission

  const amount = Number(inputLoanAmount.value); // Get loan amount

  // Check if loan conditions are met
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Simulate loan approval delay
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = ''; // Clear input field
});

// Event handler for closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission

  // Check if the entered username and pin match the current account
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Find index of the current account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// Variable to track sorting state
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission
  // Display sorted or unsorted movements based on current state
  displayMovements(currentAccount, !sorted);
  sorted = !sorted; // Toggle sorting state
});
