function Buffer(owner) {
    var _BUFFER_LENGTH = 100;
    var _buffer = new Array(_BUFFER_LENGTH);
    var _pre_buffer = new Array(_BUFFER_LENGTH);
    var _active_line = 0
    var _terminal_prompt = "";
    var _terminal_parent = null;
    
    var _build_buffer = function(){
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
    
    this.build_output = function (input) {
        _pre_buffer.push(input);
    }
        
    
    this.init_buffer = function(prompt, parent, buffer_length = 100){
        _terminal_parent = parent;
        _terminal_prompt = prompt;
        _BUFFER_LENGTH = buffer_length;
        _build_buffer();
        _init_prompt();
    }
}