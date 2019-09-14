function Terminal(){
    // private:
    
    var _buffer = new Buffer(this);
    var _parent_element = document.getElementById("ui-terminal");
    var _BUFFER_LENGTH = 100;

    
    var _context = "<span contentEditable=false>>&nbsp</span>";
    var _line = "<span id='al' contentEditable=true></span>";
    var _prompt = _context + _line;
    

    
    this._submit_line = function(){
        var _submitted_text = document.getElementById("al").textContent;

        if(_submitted_text == "clear"){
            _buffer.clear_buffer(true);
        }else {
            _buffer.build_output(_submitted_text);
            _buffer.write_output();
        }
    }
    
    
    
    // public:
    
    this.init_terminal = function(){
        _buffer.init_buffer(_prompt, _parent_element, _BUFFER_LENGTH);
    }
    

}