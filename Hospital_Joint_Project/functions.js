let pre = "general";
let preDiv = "generalDiv";

let disInfo = (divId) =>{

    let preTag = document.getElementById(pre);
    let preDivTag = document.getElementById(preDiv);

    preTag.classList.add("hover:bg-white");
    preTag.classList.remove("bg-white");
    preDivTag.classList.add("hidden");
    preDivTag.classList.remove("flex");

    let div = document.getElementById(divId);

    div.classList.remove("hover:bg-white");
    div.classList.add("bg-white");

    let disDiv = document.getElementById(divId+"Div");

    disDiv.classList.remove("hidden");
    disDiv.classList.add("flex");

    pre = divId;
    preDiv = divId+"Div";
}