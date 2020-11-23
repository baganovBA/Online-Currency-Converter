const selectInput = document.querySelector('.select_input');
const selectOutput = document.querySelector('.select_output');
console.log(selectInput);
console.log(selectOutput);

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

const listCurrenciesItems = document.querySelectorAll('.list_currency_item');
console.log(listCurrenciesItems);
const listSelected = document.querySelector('.select_input');
let inputCurrentToFetch = '';

listCurrenciesItems.forEach((currencyItem) =>{
    currencyItem.addEventListener('click', (event)=>{
        listCurrenciesItems.forEach((item) =>{
            if(item.classList.contains('selected')){
                item.classList.remove('selected');
            };
        })
        if(listSelected.classList.contains('selected')){
            listSelected.classList.remove('selected');
        }
        if(event.target.innerText.length > 3){
            console.log(event.target.value);
            inputCurrentToFetch = event.target.value;
        }else{
            console.log(event.target.innerText);
            inputCurrentToFetch = event.target.innerText;
        }
        
        event.target.classList.add('selected');

        fetch(`https://api.ratesapi.io/api/latest?base=${inputCurrentToFetch}&symbols=RUB`).then((promice) =>{
                return promice.json();

            }).then((data) =>{
                console.log(data);
            })

    }); 
})


