const input = document.getElementById("input");
const button = document.getElementById("btn");
const clear = document.getElementById("clear");
const sum = document.getElementById("sum");

function display(text){
    input.value += text;
};

clear.addEventListener('click',()=>{
    input.value = "";
})

sum.addEventListener('click',()=>{
    try{
        input.value = eval(input.value);
    }
    catch(error){
        input.value ="Error";
    }
    
});