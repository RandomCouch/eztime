
var extraButtons = [];
extraButtons.push({label: "Login", handleClick: function(){
    Router.go('/');
}});


SignupForm = React.createClass({
    getInitialState: function(){
      return{
          form:null
      }  
    },
    getForm: function(component){
      console.log("Got form ");
      this.setState({form:component});
    },
    submitForm: function(data){ 
        var username = data[0].value;
        var email = data[1].value;
        var password = data[2].value;
        var self = this;
        Accounts.createUser({username: username, password:password, email:email}, function(error){
            if(error){
                var err = [];
                err.push(error.reason);
                self.state.form.setState({errors:err});
                console.log("Error creating user: " + error.reason);
            }else{
                var msg = [];
                msg.push("User created successfully.");
                self.state.form.setState({messages:msg});
                console.log("Created user");
                
                Router.go('/');
            }
        });
        //Router.go('/');
    },
    render:function(){
        return(
                <BasicForm title='Create Account' customStyle="lform" questions={SignupFields} extraButtons={extraButtons} getForm={this.getForm} submitForm={this.submitForm} submitButtonLabel="Register"/>
            )
    }
});