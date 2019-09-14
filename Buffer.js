function Buffer(owner) { // A Buffer belongs to a terminal
    
    // private:
    
    /* PRIVATE PROPERTY DECLARATIONS
    *
    *
    *
    *
    *
    */
    
    var _BUFFER_LENGTH = 0;
    var _buffer = null;
    var _pre_buffer = null; // staging place for new output
    var _active_line = 0
    
    // These lines form the prompt. 'Live line' doesn't change.
    // Others inititalized in init_buffer, context changes with
    // commands.
    var _terminal_current_context = "";
    var _terminal_live_line = "<span id='al' contentEditable=true></span>";
    var _terminal_prompt = "";
    var _terminal_parent = null;
    
    // END PRIVATE PROPERTY DECLARATIONS
    //**************************************
    /* PRIVATE METHOD DEFINITIONS
    *
    *
    *
    *
    *
    */
    
    var _build_buffer = function(){
        _buffer = new Array(_BUFFER_LENGTH);
        _pre_buffer = new Array();
        
        for(i of _buffer.keys()){
            _buffer[i] = document.createElement("span");
            _buffer[i].style.display = "block";  // span by default is inline
            _buffer[i].innerHTML = "&nbsp"; // requires an HTML 'non-breaking space' to prevent element collapse
            _terminal_parent.appendChild(_buffer[i]);
        }
         
    }
    
    // EVENT HANDLER
    //***************************
    var _new_line_handler = function(event){  // necessary since you can't remove anonymous functions
        if(event.code == "Enter"){
            event.preventDefault();
            owner._submit_line();
        }
    }  
    //***************************
    // END EVENT HANDLER
    
    var _init_prompt = function(){
        _terminal_prompt = _terminal_current_context + _terminal_live_line; // current context set in init_buffer
        _buffer[_active_line].innerHTML = _terminal_prompt;

        _buffer[_active_line].addEventListener("keypress", _new_line_handler);
        document.getElementById("al").focus();
    }

    var _move_active_line = function () {
        _buffer[_active_line].innerHTML = "&nbsp";  // clear current line
        _buffer[_active_line].removeEventListener("keypress", _new_line_handler);  // remove "ENTER" key listener
        _active_line = 0;  // this and next line tell us how far to move active line down to make room for output
        _active_line += _pre_buffer.length;
    } 
    
    var _update_screen_buffer = function () {
        for(a of _buffer.keys()){  // .keys() just  gives us terminal[]'s indexes to iterate with
            if(a < _active_line){ // lines above active line
                if(_pre_buffer[a] == ""){  // blank line submitted?
                    _buffer[a].innerHTML = _terminal_current_context;  // output prompt only
                }else {  
                    _buffer[a].innerHTML = _terminal_current_context + _pre_buffer[a];
                }
            }else {  //lines below active line
                _buffer[a].innerHTML = "&nbsp";
            }  
        }
    } 
    
    var _reinit_terminal = function () {
        console.log(_active_line);
        _buffer[_active_line].innerHTML = _terminal_prompt;
        _buffer[_active_line].addEventListener("keypress", _new_line_handler);         
        document.getElementById("al").focus();
    }
    
    // END PRIVATE METHOD DEFINITIONS
    //****************************************
    /* PUBLIC METHOD DEFINITIONS
    *
    *
    *
    *
    *
    */
    
    
    // public:
    
    this.init_buffer = function(current_context, parent, buffer_length = 100){
        _terminal_parent = parent;
        _terminal_current_context = current_context;
        _BUFFER_LENGTH = buffer_length;
        console.log(_active_line);
        _build_buffer();
        _init_prompt();
    }
    
    this.build_output = function (input) {
        _pre_buffer.push(input);
    }    
    
    this.write_output = function () {
        _move_active_line();
        _update_screen_buffer();
        _reinit_terminal();
    } 

    this.clear_buffer = function (ok_to_clear = false) {  // default parameter value requires explicit passing of 'true'
        if(ok_to_clear){
            _pre_buffer = [];  // there are no other references to _output_text, so this is safe and discards old array
            this.write_output();  // actually 'commits' wipe to screen
        }
    }
    
    
}