BasicForm = React.createClass({
    getInitialState: function(){
      return{
          errors:[] || this.props.errors,
          messages:[] || this.props.messages
      }  
    },
    handleSubmit: function(e){
        e.preventDefault();
        var data = $(ReactDOM.findDOMNode(this.refs.loginForm)).serializeArray();
        this.props.submitForm(data);
    },
    componentDidMount: function(){
        this.props.getForm(this);  
    },
    render:function(){
        var classN = "form " + this.props.customStyle;
        var questions = [];
        
        return(
                <form className={classN} onSubmit={this.handleSubmit} ref='loginForm'>
                    <h3>{this.props.title}</h3>
                    {this.state.errors.map(function(error, i){
                        return(<MessageBox key={i} type='error' message={error}/>);
                    })}
                    {this.state.messages.map(function(m, i){
                        return(<MessageBox key={i} type='success' message={m}/>);
                    })}
                    <table className='table table-responsive'>
                        <tbody>
                        {this.props.questions.map(function (question, i){
                          return(
                            <BasicQuestion key={i} label={question.label}  id={question.name || i} type={question.type} options={question.options || []}/>
                          )  
                        })}
                        </tbody>
                    </table>
                    <div>
                    <button type='submit' className='btn btn-primary'>{this.props.submitButtonLabel}</button>
                    </div>
                        {this.props.extraButtons.map(function (button, i){
                            return(
                                <div key={i}>
                                    <button type='button' onClick={button.handleClick} className='btn btn-secondary'>{button.label}</button>
                                </div>
                            )
                        })}
                </form>
            );
    }
    
});
var MessageBox = React.createClass({
   handleClick: function(){
       console.log("Make message dissappear");
       $(ReactDOM.findDOMNode(this.refs.messageBox)).fadeOut('fast');
   },
   componentDidMount: function() {
        console.log("Mounted message box");
        $(ReactDOM.findDOMNode(this.refs.messageBox)).fadeIn('fast');
    },
   render: function(){
       return(
           <div ref='messageBox' onClick={this.handleClick} className={this.props.type}>{this.props.message}</div>
           );
   } 
});
var BasicQuestion = React.createClass({
   render:function(){
       var questionInput;
       $(".datepicker").datepicker({
           format: 'dd-mm-yyyy'
       });
       var questionLabel = <label>{this.props.label}</label>;
       if(this.props.type == "text"){
           questionInput = <input type='text' name={this.props.id} className='form-control'/>;
       }else if(this.props.type == "radio"){
           questionInput = <input type='radio' name={this.props.id} className='form-control'/>;
       }else if(this.props.type == "checkbox"){
           questionInput = <input type='checkbox' name={this.props.id} className='form-control'/>;
       }else if(this.props.type == "password"){
           questionInput = <input type='password' name={this.props.id} className='form-control'/>;
       }else if(this.props.type == "select"){
           questionInput = <select className='form-control' name={this.props.id}>
                {this.props.options.map(function(o, i){
                    return(<option key={i}>{o}</option>);
                })}
           </select>;
       }else if(this.props.type == "number"){
           questionInput = <input type='number' step='any' name={this.props.id} className='form-control' />;
       }else if(this.props.type == "date"){
           questionInput = <input type='text' name={this.props.id} className='form-control datepicker' />;
       }else if(this.props.type == "time"){
           questionInput = <input type='time' name={this.props.id} className='form-control' />;
       }else if(this.props.type == "textarea"){
           questionInput = <textarea className='form-control ckeditor' name={this.props.id}></textarea>;
       }
       return(
            <tr>
                <td>{questionLabel}</td>
                <td>{questionInput}</td>
            </tr>
           )
   } 
    
});