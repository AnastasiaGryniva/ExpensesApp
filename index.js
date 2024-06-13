const STATUS_IN_LIMIT = 'всё хорошо';
const STATUS_OUT_OF_LIMIT = 'всё полохо';
const STOREGE_LABEL_LIMIT = 'limit';
const STOREGE_LABEL_EXPENSES = 'expenses';

const inputNode = document.querySelector('.js-expense-input');
const categorySelectNode = document.querySelector('.js-categorySelect');
const buttonNode = document.querySelector('.js-expense-btn');
const clearButtonNode = document.querySelector('.js-clearButton');
const totalValueNode = document.querySelector('.js-sum');
const statusNode = document.querySelector('.js-status');
const historyList = document.querySelector('.js-history');
const changeLimitBtn = document.querySelector('.js-limitBtn')

const limitNode = document.querySelector('.js-limit');
let limit = parseInt(limitNode.innerText);

function initLimit() {
    const limitFromStorage = parseInt (localStorage.getItem(STOREGE_LABEL_LIMIT));
    if(!limitFromStorage){
        return;
    }
    limitNode.innerText = limitFromStorage;
    limit = parseInt(limitNode.innerText);
}

initLimit();

const expensesFromStorageString = localStorage.getItem(STOREGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if(Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
}
render();

function getTotal() {
    let sum = 0;
    expenses.forEach(function(expense){
        sum += expense.amount;
    })
    return sum;
}

function renderStatus() {
    const total = getTotal(expenses);
    totalValueNode.innerText = total;

    if(total <= limit) {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.className = 'status';
    } else {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб)`;
        statusNode.className = 'status__red';
    }
}

function renderHistory() {
    historyList.innerHTML = '';

    expenses.forEach(function(expense){
        const historyItem = document.createElement('li');

        historyItem.className = 'rub';

        historyItem.innerText = `${expense.category} - ${expense.amount}`;

        historyList.appendChild(historyItem);
    });
}

function render() {
    renderStatus();

    renderHistory();
}

function getExpenseFromUser() {
    return parseInt(inputNode.value);
}

function getSelectedCategory() {
    return categorySelectNode.value;
}

const clearInput = function(input) {
    input.value = '';
}

function saveExpensesToStorage() {
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STOREGE_LABEL_EXPENSES, expensesString);
}

function addButtonHandler() {
    const currentAmount = getExpenseFromUser();
    if(!currentAmount) {
        return(alert('Введите сумму'));
    }

    const currentCategory = getSelectedCategory();
    if(currentCategory === 'Категория') {
        return(alert('Выберите категорию'))
    }

    const newExpense = {amount: currentAmount, category: currentCategory};
    console.log(newExpense);

    expenses.push(newExpense);
    saveExpensesToStorage();

    render();

    clearInput(inputNode);
}

function clearButtonHadler() {
    expenses = [];
    render();
}

function changeLimitHadler() {
    const newLimit = prompt('Новый лимит');

    const newLimitValue = parseInt(newLimit);
    if(!newLimitValue){
        return(alert('Лимит не изменен'));
    }

    limitNode.innerText = newLimitValue;
    limit = newLimitValue;
    localStorage.setItem(STOREGE_LABEL_LIMIT, newLimitValue);


    
    render();
}

buttonNode.addEventListener('click', addButtonHandler);
clearButtonNode.addEventListener('click', clearButtonHadler);
changeLimitBtn.addEventListener('click', changeLimitHadler);