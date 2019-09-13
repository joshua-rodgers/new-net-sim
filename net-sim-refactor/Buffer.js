function Buffer(owner) {
    var _buffer = new Array(100);
    var _active_line = 0
    var _terminal_prompt = "";
    var _terminal_parent = null;
    
    var _build = function(){
            for(i of _buffer.keys()){
                _buffer[i] = document.createElement("span");
                _buffer[i].style.display = "block";  // span by default is inline
                _buffer[i].innerHTML = "&nbsp"; // requires an HTML 'non-breaking space' to prevent element collapse
                _terminal_parent.appendChild(_buffer[i]);
            }
            _buffer[_active_line].innerHTML = _terminal_prompt; 
        }
    
    var _init_prompt = function(){
                _buffer[_active_line].addEventListener("keypress", _new_line_handler);
                document.getElementById("al").focus();
        }
    
    var _new_line_handler = function(event){  // necessary since listener removal can't handle anonymous functions
        if(event.code == "Enter"){
            event.preventDefault();
            owner._submit_line();
        }
    }
    
    this.init_buffer = function(prompt, parent){
        _terminal_parent = parent;
        _terminal_prompt = prompt;
        _build();
        _init_prompt();
    }
}