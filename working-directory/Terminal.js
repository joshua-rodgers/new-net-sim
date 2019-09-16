function Terminal(){
    // private:
    
    var _buffer = new Buffer(this); // A terminal 'has a' Buffer so we pass a ref to ourselves to let the Buffer know whos boss.
    var _command_processor = new Processor(this);
    var _parent_element = document.getElementById("ui-terminal");
    var _BUFFER_LENGTH = 100;

    
    var _current_context = "<span contentEditable=false>>&nbsp</span>";

    

    
    this._submit_line = function(){
        var _submitted_text = document.getElementById("al").textContent;
        _buffer.write_output(_command_processor.read_input(_submitted_text));

        /*if(_submitted_text == "clear"){
            _buffer.clear_buffer(true);
        }else {
            _buffer.build_output(_submitted_text);
            _buffer.write_output();
        }*/
    }
    
    
    
    // public:
    
    this.init_terminal = function(){
        _buffer.init_buffer(_current_context, _parent_element, _BUFFER_LENGTH);
    }
    

}