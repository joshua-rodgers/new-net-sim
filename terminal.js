var terminal = new Array(20);  // the terminal itself
var c = document.getElementById("ui-terminal");
var active_line = 0;  // variable to mark where caret is via 'terminal' array index
var screen_buffer = new Output();  // buffer is encapsulated within Output object
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

/*
* The Output object hides the _output_text Array to prevent accidental modification of the buffer
* As _output_text is defined in the parameter list, it is only accessible within the object itself
* not even via the prototype chain.
*
*
*
*
*/
function Output(_output_text = []){
    this.build_output = function (input) {
        _output_text.push(input);
    }
    this.send_output = function () {
        terminal[active_line].innerHTML = "&nbsp";  // clear current line
        terminal[active_line].removeEventListener("keypress", new_line_handler);  // remove "ENTER" key listener
        active_line = 0;  // this and next line tell us how far to move active line down to make room for output
        active_line += _output_text.length;

        for(a of terminal.keys()){  // .keys() just  gives us terminal[]'s indexes to iterate with
            if(a < active_line){ // lines above active line
                if(_output_text[a] == ""){  // blank line submitted?
                    terminal[a].innerHTML = context;  // output prompt only
                }else {  
                    terminal[a].innerHTML = context + _output_text[a];
                }
            }else {  //lines below active line
                terminal[a].innerHTML = "&nbsp";
            }  
        }

        terminal[active_line].innerHTML = prompt;
        terminal[active_line].addEventListener("keypress", new_line_handler);                                                          
        document.getElementById("al").focus();

    }
    this.clear_buffer = function (ok_to_clear = false) {  // default parameter value requires explicit passing of 'true'
        if(ok_to_clear){
            _output_text = [];  // there are no other references to _output_text, so this is safe and discards old array
            this.send_output();  // actually 'commits' wipe to screen
        }
    }
}

// These declarations create the prompt. They're down here because the terminal 
// dynamically generated and is only now ready to be manipulated. 'context' will
// change as its name suggests
var context = "<span contentEditable=false>>&nbsp</span>";
var line = "<span id='al' contentEditable=true></span>";
var prompt = context + line;

function submitLine(){
    var submitted_text = document.getElementById("al").textContent;

    if(submitted_text == "clear"){
        screen_buffer.clear_buffer(true);
    }else {
        screen_buffer.build_output(submitted_text);
        screen_buffer.send_output();
    }
}

build_terminal();
init_terminal();