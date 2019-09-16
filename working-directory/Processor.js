function Processor (owner) {
    var _out_buffer = null;
    var _tokens = null;
    var _finished = false;
    var _error_code = 0;
    
    var _command_tree = {
        help: function (){
            console.log("Got it!");
        }
    }
    
    var _error_table = [
        "",
        "Please enter a command.",
        "Command not found."
    ]
    
    this.read_input = function(input = ""){
        _out_buffer = [];
        _tokenize(input);
        if(!_error_code){
            _parse();
        }else {
            return _output()
        }
        return _output();
        
    }
    
    var _tokenize = function(input){
        _tokens = input.split(" ");
        if(_tokens.length <= 1){
            _tokens = null;
            _error_code = 1;
            _finished = true;
        }
    }
    
    var _parse = function () {
        for(t of _tokens.keys()){
            for(command in _command_tree){
                if(_tokens[t] == command){
                    _command_tree[command]();
                }else {
                    _error_code = 2;
                    _finished = true;
                    break
                }
            }
        }
    }
    
    var _fetch_error_msg = function () {
        return _error_table[_error_code];
    }
    
    var _output = function () {
        if(_error_code){
            var _error_msg = _fetch_error_msg();
            _out_buffer.push(_error_msg);
            _error_code = 0;
            _finished = false;
            return _out_buffer;
        }
    }
}