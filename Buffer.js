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
    var _buffer_full = false;
    
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
        var _last_active_line = document.getElementById("al");
        _last_active_line.id = "";
        _buffer[_active_line].removeEventListener("keypress", _new_line_handler);  // remove "ENTER" key listener
        _active_line = _active_line + _pre_buffer.length + 1;
        console.log(_active_line);
        if(_active_line >= _BUFFER_LENGTH) {  // if incoming output will exceed buffer...
            _buffer_full = true; 
            _active_line = _BUFFER_LENGTH - 1; 
        }
    } 
    
    var _append_output = function () {
        if(_buffer_full){
            var _insertion_point = _handle_overflow();
            
            for(var i = _insertion_point, j = 0; j < _pre_buffer.length; i++, j++){
                _buffer[i].innerHTML = _terminal_current_context + _pre_buffer[j];
            }    
        }else {
            for(var i = _active_line - _pre_buffer.length, j = 0; j < _pre_buffer.length; i++, j++){
                _buffer[i].innerHTML = _terminal_current_context + _pre_buffer[j];
            }
        }
    }
    
    var _handle_overflow = function () {
        
        _dump_overflow();
        _append_space();
        _buffer_full = false;
        
        return _active_line - _pre_buffer.length;
    }
    
    var _append_space = function (){
            for(var i = 0; i <= _pre_buffer.length; i++){
                var _new_line = document.createElement("span");
                _new_line.style.display = "block";
                _buffer.push(_new_line);
                _terminal_parent.appendChild(_new_line);
            }
        }
    
    var _dump_overflow = function () {
            for(var i = 0; i <= _pre_buffer.length; i++){
                _terminal_parent.removeChild(_buffer.shift());
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