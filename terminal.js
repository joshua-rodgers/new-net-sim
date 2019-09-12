var terminal = new Array(20);  // the terminal itself
var c = document.getElementById("ui-terminal");
var active_line = 0;  // variable to mark where caret is via 'terminal' array index
var screen_buffer = new Output();  // buffer is encapsulated within Output object

// The following declarations create the prompt
var context = "<span contentEditable=false>>&nbsp</span>";
var line = "<span id='al' contentEditable=true></span>";
var prompt = context + line;

var new_line_handler = function(event){  // necessary since listener removal can't handle anonymous functions
    if(event.code == "Enter"){
        event.preventDefault();
        submitLine();
    }
}

function build_terminal(){
    for(i of terminal.keys()){
        terminal[i] = document.createElement("span");
        terminal[i].style.display = "block";  // span by default is inline
        terminal[i].innerHTML = "&nbsp"; // requires an HTML 'non-breaking space' to prevent element collapse
        c.appendChild(terminal[i]);
    }
    terminal[active_line].innerHTML = prompt; 
}

function init_terminal(){
    terminal[active_line].addEventListener("keypress", new_line_handler);
    document.getElementById("al").focus();
}

function submitLine(){
    var submitted_text = document.getElementById("al").textContent;

    if(submitted_text == "clear"){
        screen_buffer.clear_buffer(true);
    }else {
        screen_buffer.build_output(submitted_text);
        screen_buffer.write_output();
    }
}