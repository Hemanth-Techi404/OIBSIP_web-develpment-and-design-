const input = document.querySelector(".input")
const button = document.querySelector(".converter")
const output = document.querySelector(".output");

function convert(){
    let value = Number(input.value)
    let F = document.querySelector(".F")
    let C = document.querySelector(".C")
    
    if(C.checked){
        let celsius = (value - 32) * 5/9;
        output.innerHTML = celsius + "°C"

    }else{
        let fahrenheit= (value * 9/5) + 32
        output.innerHTML = fahrenheit + "°F"
        
    }

}
