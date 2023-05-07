'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-04-04T14:11:59.604Z',
    '2023-04-05T17:01:17.194Z',
    '2023-04-06T23:36:17.929Z',
    '2023-04-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
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
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const formatMoveDate = function (date, locale) {
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago.`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display a clock on the DOM
let clock = document.createElement('p');
labelWelcome.after(clock);
setInterval(function () {
  const now = new Date();
  clock.innerHTML = `<p>${now}</p>`;
}, 1000);

const locale = navigator.language; // fetches the browser language

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMoveDate(date, locale);

    const formattedMov = formatCurrency(mov, locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(acc.balance, locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  // PREVIOUS SOLUTION
  // const formattedIncomes = new Intl.NumberFormat(locale, {
  //   style: 'currency',
  //   currency: acc.currency,
  // }).format(incomes);

  // const formattedOutcomes = new Intl.NumberFormat(locale, {
  //   style: 'currency',
  //   currency: acc.currency,
  // }).format(outcomes);

  // const formattedInterest = new Intl.NumberFormat(locale, {
  //   style: 'currency',
  //   currency: acc.currency,
  // }).format(interest);

  //CURRENT SOLUTION
  labelSumIn.textContent = formatCurrency(incomes, locale, acc.currency);
  labelSumOut.textContent = formatCurrency(outcomes, locale, acc.currency);
  labelSumInterest.textContent = formatCurrency(interest, locale, acc.currency);
};

// once only called function
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  // set timer to 100 seg
  let time = 30;

  const tick = function () {
    const min = `${Math.trunc(time / 60)
      .toString()
      .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

    // in each call, print the remining time to UI
    labelTimer.textContent = min;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started.';
      containerApp.style.opacity = 0;
    }

    // decrease 1 second
    time--;
  };

  // call the timer every second
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //creating current date and time (old way)
    // const rightNow = new Date();
    // const date = formatMoveDate(rightNow);
    // const hours = `${rightNow.getHours()}`.padStart(2, 0);
    // const minutes = `${rightNow.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}, ${hours}:${minutes}.`;

    // create date and time the right way
    const rightNow = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // or 'long' for month's name // or '2-digit'
      year: 'numeric', // or '2-digit' = 20, 21, 22...
      //weekday: 'long', // or 'short' or 'narrow'
    };

    // INTL API
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      rightNow
    );

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // COUNTDOWN / timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add the date to the dates array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }

  // reset the timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // SCHEDULE a function to happen after a set time, ONLY ONCE
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date to the dates array
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      alert('Your loan was accepted.');

      // reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  } else {
    alert('Your loan was NOT accepted. Try a smaller amount.');
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // insert an autofading div informing what was the closed account and what was the time

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

let value = 123.456789;
let value1 = 77763;
let value2 = 2469;

// to deal with numbers in the beginning of a string
Number.parseFloat('123value');

// way to check if value is NaN (not really useful)
Number.isNaN(value);

// best way to check if is number when working with floating point nuumbers
Number.isFinite(value); // isFinite method

// best way to check if is number when working with integers
Number.isInteger(value);

// returns the max and min number on a list
Math.max();
Math.min();

// get a random value between 0 - 1
Math.random();

// get a random value between 0 - value(-1)
Math.random() * value; // in order to get rid of decimal points and get 'value' as possible result, use Math.trunc(...) + 1

// get a random value between value1 and value2
const randomInt = (value1, value2) =>
  Math.floor(Math.random() * (value2 - value1) + 1) + value1;

// round integers
Math.trunc(value); // SIMPLY cuts the floating number. Not ideal
Math.round(value); // round to the NEAREST integer
Math.ceil(value); // round to the next higher integer
Math.floor(value); // round to the next lower integer

// rounding decimals - and use decimal points - RETURNING A STRING
value.toFixed(0); // no decimals
value.toFixed(1); // 1 decimal point... and it goes on
+value.toFixed(2); // 2 decimal points AND returns a NUMBER

// create a date
const nova = new Date(); // gets today's date now (year, month, etc........ hour....)
const now = new Date(2023, 5, 6, 21, 19);

//date methods
now.getFullYear();
now.getMonth(); // zero based
now.getDate();
now.getDay(); // zero based
now.getHours();
now.getMinutes();
now.getSeconds();
now.toISOString();
Date.now(); // gets today's time in milisecs
// all the methods above can be turned from GET to SET

// FORMAT NUMS ACCORDING TO COUNTRIES & OPTIONS
const oPtopns = {
  style: 'unit',
  unit: 'mile-per-hour',
};

const num = 34834378349.23;
console.log('US:', new Intl.NumberFormat('en-US').format(num));
console.log('GER:', new Intl.NumberFormat('de-DE').format(num));
console.log('SYR:', new Intl.NumberFormat('ar-SY').format(num));
console.log('Browser: ', new Intl.NumberFormat(navigator.language).format(num));

console.log(
  'SEE THE DIFFERENCE:',
  'US:',
  new Intl.NumberFormat('en-US', oPtopns).format(num)
);
console.log(
  'SEE THE DIFFERENCE:',
  'GER:',
  new Intl.NumberFormat('de-DE', oPtopns).format(num)
);
console.log(
  'SEE THE DIFFERENCE:',
  'SYR:',
  new Intl.NumberFormat('ar-SY', oPtopns).format(num)
);
console.log(
  'SEE THE DIFFERENCE:',
  'Browser: ',
  new Intl.NumberFormat(navigator.language, oPtopns).format(num)
);
