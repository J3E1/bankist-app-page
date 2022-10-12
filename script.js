'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jeel Khuman',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Uday Chavda',
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

const accounts = [account1, account2];

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

//Dates
const now = new Date();
const options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

/*
const locale = navigator.language;
console.log(locale);
const date = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()}`.padStart(2, 0);
const year = `${now.getFullYear()}`;
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${date}/${month}/${year} ${hour}:${min}`;
*/
//Focusing on input on page load
window.onload = () => inputLoginUsername.focus();

const formatMovementDate = date => {
  const calDayPassed = (d1, d2) =>
    Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)));
  const dayPassed = calDayPassed(new Date(), date);
  // console.log(dayPassed);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
};

const formatCurr = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

const setLogoutTimer = () => {
  //set the time
  let time = 60 * 2;

  const tick = () => {
    //value of min and sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //Each call print the time
    labelTimer.textContent = `${min}:${sec}`;
    //when timer hits 0 log out the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.scale = 0;
    }
    //decreases the time
    time--;
  };
  //call the fun every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Displaying the movements
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  moves.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    //Displaying dates in movements
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);
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

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurr(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(
    incomes,
    account.locale,
    account.currency
  );

  const outs = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(
    Math.abs(outs),
    account.locale,
    account.currency
  );
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCurr(
    interest,
    account.locale,
    account.currency
  );
};

//Creating the username
const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

let currentAccount, timer;

//UpdateUI function
const updateUI = account => {
  //Display movements
  displayMovements(account);
  //Display Balance
  calcDisplayBalance(account);
  //Display Summary
  calcDisplaySummary(account);
};

//Event Handlers
btnLogin.addEventListener('click', e => {
  //Prevents from from submitting
  e.preventDefault();

  //Finding currentAccount from input field
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //Checking whether the pin is correct if currentAccount exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log(currentAccount);

    //Clear the fields
    inputLoginPin.value = inputLoginUsername.value = null;

    //Removing the focus from the pin
    inputLoginPin.blur();

    //Display UI and welcome message
    containerApp.style.scale = 1;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear the previous log in timer
    if (timer) clearInterval(timer);

    timer = setLogoutTimer();
    updateUI(currentAccount);
  } else {
    alert('Please enter correct Username & Pin!!');
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(+inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = null;
    inputTransferAmount.blur();
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = setLogoutTimer();
  } else {
    alert('Error');
  }
  updateUI(currentAccount);
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      //reset the timer
      clearInterval(timer);
      timer = setLogoutTimer();
    }, 2500);
  } else {
    alert("You haven't deposited 10% of Requested loan");
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) == currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Deleting the account
    accounts.splice(index, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  //Clearing the UI
  containerApp.style.scale = 0;
  // console.log('DELETE');
});

let sort = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sort);
  sort = !sort;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
//Fake Login
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.scale = 1;
*/
/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['a', 'b', 'c', 'd', 'e'];
arr2.reverse();
// console.log(arr.splice(1, 3));
// console.log(arr);
// console.log(arr.reverse());
// console.log(arr.concat(arr2));
console.log(arr.at(-1));
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, mov] of movements2.entries()) {
  mov < 0
    ? console.log(`Movement ${i + 1}: You withdrawal ${mov}`)
    : console.log(`Movement ${i + 1}: You deposited ${mov}`);
}
console.log('ForEach'.padStart(20, '-').padEnd(15 + 20, '-'));
movements2.forEach((mov, i) => {
  mov < 0
    ? console.log(`Movement ${i + 1}: You withdrawal ${mov}`)
    : console.log(`Movement ${i + 1}: You deposited ${mov}`);
});
currencies.forEach((value, key) => {
  console.log(value, key);
});
const checkDogs = (dogs1, dogs2) => {
  const correctedDogs = dogs1.slice();
  correctedDogs.splice(0, 1);
  correctedDogs.splice(-2);
  const dogFinal = correctedDogs.concat(dogs2);
  console.log(correctedDogs);
  dogFinal.forEach((dog, i) => {
    console.log(
      `Dog number ${i + 1} is ${dog >= 3 ? 'an adult 🐶' : 'still a puppy 🥺'}`
    );
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
const movementDescriptions = movements.map(
  (mov, i) => `Movement ${i}: You ${mov > 0 ? 'Deposited' : 'Withdrew'}`
);
console.table(movementDescriptions);
const account = accounts.find(acc => acc.owner === 'Sarah Smith');
console.log(account);
const calcAverageHumanAge = ages =>
  ages.reduce((acc, avg, _, arr) => acc + avg / arr.length, 0);
console.log(calcAverageHumanAge([1, 2, 3, 4, 5, 6, 7, 8, 9]));
const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
 */
