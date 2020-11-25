const selectInput = document.querySelector('.select_input');
const selectOutput = document.querySelector('.select_output');
const listCurrenciesInputItems = document.querySelectorAll('.item_input');
const listCurrenciesOutputItems = document.querySelectorAll('.item_output');
const inputCurrency = document.querySelector('.input_currency');
const outputCurrency = document.querySelector('.output_currency');
const curseInputUnderline = document.querySelector('.curse_input_value');
const curseOutputUnderline = document.querySelector('.curse_output_value');
const swap = document.querySelector('.swap');
const blockContainer = document.querySelector('.block_conteiner.currency');
let inputCurrentToFetch = 'RUB';
let outputCurrentToFetch = 'USD';
let curs = 1;

// реализация отображения экрана загрузки
const setLoading = (loading) => {
    if (loading) {
        document.querySelector('.loading').classList.remove('back');
    } else {
        document.querySelector('.loading').classList.add('back');
    }
}

//округление значения до 6 знаков
const amountSigns = (num) => {
    return new Intl.NumberFormat('en-US', {maximumFractionDigits: 6}).format(num)
}

// вычисление инпута вывода на основании инпута ввода
const changeCurrancyOutput = () => {
    let input = inputCurrency.value;

    input = input.replace(',', '.');
    input = parseFloat(input);
    if (isNaN(input)) {
        input = 0;
    }

    outputCurrency.value = input * curs;
}

// вычисление инпута ввода на основании инпута вывода 
const changeCurrancyInput = () => {
    let output = outputCurrency.value;

    output = output.replace(',', '.');
    output = parseFloat(output);
    if (isNaN(output)) {
        output = 0;
    }

    inputCurrency.value = output / curs;
}

// отправка запроса на получение курса, реализация вывода экрана загрузки, отображение ошибки при неудачном сценарии 
const getExchangeRate = async (inputCurrentToFetch, outputCurrentToFetch) =>{
    const timer = setTimeout(() => {
        setLoading(true);
    }, 500);

    try {
        const response = await fetch(`https://api.ratesapi.io/api/latest?base=${inputCurrentToFetch}&symbols=${outputCurrentToFetch}`);
        clearTimeout(timer);
        setLoading(false);
        const data = await response.json();
        return data
    } catch (error) {
        console.log('network',error);
        alert('Ошибка подключения к апи');
        clearTimeout(timer);
        setLoading(false);
        return false;
    }
}

//Отправка запроса на получение актуального курса и далее вычисления
const updateData = (inputCurrentToFetch,outputCurrentToFetch) =>{
    if(inputCurrentToFetch !== outputCurrentToFetch){
        getExchangeRate(inputCurrentToFetch,outputCurrentToFetch).then(promice =>{
        const{rates}  = promice;
        const arrCurs = Object.values(rates);
        curs = amountSigns(arrCurs[0]);
        changeCurrancyOutput();
        changeCurseUnderline();
        });
    }else{
        curs = 1;
        changeCurrancyOutput();
        changeCurseUnderline();
    }
}

//вычисление курса под рамкой инпута
const changeCurseUnderline = () => {
    curseInputUnderline.innerText = `1 ${inputCurrentToFetch} = ${curs} ${outputCurrentToFetch}`;
    curseOutputUnderline.innerText = `1 ${outputCurrentToFetch} = ${amountSigns(1/curs)} ${inputCurrentToFetch}`;
}

//Обработчики на options перезаписывание переменных для формирования запроса
const eventsHandler = () => {
    selectInput.addEventListener('change', event => {
        inputCurrentToFetch = event.target.value;

        updateData(inputCurrentToFetch,outputCurrentToFetch)
    });
    selectOutput.addEventListener('change', event => {
        inputCurrentToFetch = event.target.value;

        updateData(inputCurrentToFetch,outputCurrentToFetch)
    });

    inputCurrency.addEventListener('input', event => {
        changeCurrancyOutput();
        changeCurseUnderline();
    })

    outputCurrency.addEventListener('input', event =>{
        changeCurrancyInput();
        changeCurseUnderline();
    })
}

eventsHandler();
changeCurrancyOutput();
updateData(inputCurrentToFetch,outputCurrentToFetch);

//Получение списка валют в select -ы
const getListCurrenciesSelect = () =>{
    fetch('https://api.ratesapi.io/api/latest').then((promice)=>{
        return promice.json();

    }).then((data)=>{
        const {rates} = data;
        const getCurrencies = Object.keys(rates);
        console.log(getCurrencies);
        
        getCurrencies.forEach((getCurrency)=>{
            if(getCurrency !== "RUB" && getCurrency !== "USD" && getCurrency !== "EUR" && getCurrency !== "GBP"){
                const optionIn = document.createElement("option");
                const optionOut = document.createElement("option");
                optionIn.value = getCurrency;
                optionOut.value = getCurrency;
                optionIn.innerHTML = getCurrency;
                optionOut.innerHTML = getCurrency;
                selectInput.appendChild(optionIn);
                selectOutput.appendChild(optionOut);
            };
        });
    });
};
getListCurrenciesSelect();
//Смена валюты в контейнере ввода
listCurrenciesInputItems.forEach((currencyItem) =>{
    currencyItem.addEventListener('click', (event)=>{
        listCurrenciesInputItems.forEach((item) =>{
            item.classList.remove('selected');
        })
        event.currentTarget.classList.add('selected');

        if(event.target.innerText.length < 4){
            inputCurrentToFetch = event.target.innerText;
        }else{
            inputCurrentToFetch = event.target.value;
        }
        updateData(inputCurrentToFetch,outputCurrentToFetch);
    }); 
})
//смена валюты в контейнера вывода
listCurrenciesOutputItems.forEach(currencyItem =>{
    currencyItem.addEventListener('click', event =>{
        listCurrenciesOutputItems.forEach((item) =>{
            item.classList.remove('selected');
            // console.log("item", item);

        });
        event.currentTarget.classList.add('selected');

        if(event.target.innerText.length < 4){
            outputCurrentToFetch = event.target.innerText;
        }else{
            outputCurrentToFetch = event.target.value;
            console.log(event.target.value);
        };

        updateData(inputCurrentToFetch, outputCurrentToFetch);
    });
});

//замена контейнеров
swap.addEventListener('click', event =>{
    console.log('ololo', blockContainer)
     if (blockContainer.classList.contains('reverse')) {
        blockContainer.classList.remove('reverse')
     } else {
        blockContainer.classList.add('reverse')
     }
});