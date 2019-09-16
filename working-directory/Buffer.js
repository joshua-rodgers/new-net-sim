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
    var _last_buffer = null; // copy of last iteration of buffer
    var _active_line = 0
    var _new_buffer_offset = 0; // number of lines being added by new output, + 1 for active line
    
    // These lines form the prompt. 'Live line' doesn't change.
    // Others inititalized in init_buffer, context changes with
    // commands.
    var _terminal_current_context = "";
    var _terminal_live_line = "<span id='al' contentEditable=true></span>";
    var _terminal_prompt = "";
    var _terminal_parent = null;
    
    var temp_flip = false;
    
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
/*      _active_line = 0;  // this and next line tell us how far to move active line down to make room for output
        _active_line += _pre_buffer.length;*/
        _active_line = _active_line + _pre_buffer.length;
        if(_active_line >= _BUFFER_LENGTH) {
            _active_line = _BUFFER_LENGTH - 1;
            _new_buffer_offset = _pre_buffer.length + 1 ;
        }
    } 
    
   /* var _update_screen_buffer = function () {
        for(a of _buffer.keys()){  // .keys() just  gives us terminal[]'s indexes to iterate with
            if(a < _active_line){  // lines above active line
                _append_output();
                if(_pre_buffer[a] == ""){  // blank line submitted?
                    _buffer[a].innerHTML = _terminal_current_context;  // output prompt only
                }else {  
                    _buffer[a].innerHTML = _terminal_current_context + _pre_buffer[a];
                }
            }else {  //lines below active line
                _buffer[a].innerHTML = "&nbsp";
            }  
        }
    } */
    
    var _append_output = function () {

        if(_new_buffer_offset){
            
            for(var i = _BUFFER_LENGTH - _new_buffer_offset, j = _last_buffer.length - 1; j >= _new_buffer_offset; j--, i--){  // get amount of output to print and offset from bottom of terminal by that amount
                console.log(_last_buffer.length)
                _buffer[i].innerHTML = _last_buffer[j].innerHTML;
            }
            for(var i = _BUFFER_LENGTH - _new_buffer_offset, j = 0; j < _pre_buffer.length; i++, j++){
                console.log("here");
                _buffer[i].innerHTML = _terminal_current_context + "<span>Please.</span>";                   

            }
        }else {
            for(var i = _active_line - _pre_buffer.length, j = 0; j < _pre_buffer.length; i++, j++){
                if(i < _active_line){
                    temp_flip = !temp_flip;
//                    _buffer[i] = _pre_buffer[j];  
                    if(temp_flip == true){
                        _buffer[i].innerHTML =  _terminal_current_context + "<span>Please.</span>";
                    }
                    
                    if(temp_flip == false){
                        _buffer[i].innerHTML =  _terminal_current_context + "<span>stop.</span>";
                    }
                    
                    console.log(_buffer[i]);
                    console.log(_pre_buffer[j]);
                }else {
                    _buffer[i].innerHTML = "&nbsp";
                }
            }
        }
        
    }
    
    var _reinit_terminal = function () {
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
        _build_buffer();
        _init_prompt();
    }
    
    this.build_output = function (input) {

    }    
    
    this.write_output = function (input) {
        _pre_buffer = input;
        _last_buffer = _buffer;
        
        _move_active_line();
        _append_output();
        _reinit_terminal();
    } 

    this.clear_buffer = function (ok_to_clear = false) {  // default parameter value requires explicit passing of 'true'
        if(ok_to_clear){
            _pre_buffer = [];  // there are no other references to _output_text, so this is safe and discards old array
            this.write_output();  // actually 'commits' wipe to screen
        }
    }
    
    
}