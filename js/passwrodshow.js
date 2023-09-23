const eye = document.querySelector(".fa-eye")
const password = document.querySelector(".password")
const passValue = password.value
const req = document.querySelector(".requirement")


let switchTurn
switchTurn = false

function showPassword(){
    password.type = "text"
    switchTurn=!switchTurn
    
}

function hidePassword(){
    password.type= "password"
    switchTurn=!switchTurn
    
}

eye.addEventListener("click", ()=>{
    if(switchTurn===false){
        showPassword()
    }else{
        hidePassword()
    }
    
})