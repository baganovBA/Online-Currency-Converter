const selectInput = document.querySelector('.select_input');
const selectOutput = document.querySelector('.select_output');
const listCurrenciesInputItems = document.querySelectorAll('.item_input');
const listCurrenciesOutputItems = document.querySelectorAll('.item_output');
const inputCurrency = document.querySelector('.input_currency');
const outputCurrency = document.querySelector('.output_currency');
const curseInputUnderline = document.querySelector('.curse_input_value');
const curseOutputUnderline = document.querySelector('.curse_output_value');
let inputCurrentToFetch = 'RUB';
let outputCurrentToFetch = 'USD';
let curs = 1;

const amountSigns = (num) => {
    return new Intl.NumberFormat('en-US', {maximumFractionDigits: 6}).format(num)
}

const changeCurrancyOutput = () => {
    outputCurrency.value = inputCurrency.value * curs;
}

const getExchangeRate = async (inputCurrentToFetch, outputCurrentToFetch) =>{
    const response = await fetch(`https://api.ratesapi.io/api/latest?base=${inputCurrentToFetch}&symbols=${outputCurrentToFetch}`);
    const data = await response.json();
    return data
}
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

const changeCurseUnderline = () => {
    //curseInputUnderline.innerText = `1 ${inputCurrentToFetch} = ${curs} ${outputCurrentToFetch}`;
    curseInputUnderline.innerText = "1 " + inputCurrentToFetch + " = " + curs + " " + outputCurrentToFetch;
    curseOutputUnderline.innerText = `1 ${outputCurrentToFetch} = ${amountSigns(1/curs)} ${inputCurrentToFetch}`;
}

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
}

eventsHandler();
changeCurrancyOutput();
updateData(inputCurrentToFetch,outputCurrentToFetch);

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



// console.log(curs);

//addEventListener для выбора валюты и отправки запроса на API


//const allOptionsSelected = listSelected.children;
//console.log(allOptionsSelected);
//console.log(listCurrenciesItems);

// allOptionsSelected.forEach((option)=>{
//     option.addEventListener('click', (event)=>{
//         if(option.classList.contains('selected')){
//             option.classList.remove('selected')
//         }
//         console.log(event.target)
//         event.target.classList.add('selected');
//     })
// })

//addEventListener для выбора валюты и отправки запроса на API
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

        console.trace(inputCurrentToFetch); 

    });
});
