

var extraButtons = [];
extraButtons.push({label: "Create Account", handleClick: function(){
    Router.go('/signup');
}})
        
LoginForm = React.createClass({
    getInitialState: function(){
      return{
          form:null
      }  
    },
    submitForm: function(data){ 
        var username = data[0].value;
        var password = data[1].value;
        var self = this;
        Meteor.loginWithPassword(username, password, function(error){
            if(error){
                var err = [];
                err.push(error.reason);
                self.state.form.setState({errors:err});
                console.log("Login failed: " + error.reason);
            }else{
                console.log("Login successful");
                var currentUser = Meteor.userId();
                Session.set("user", currentUser);
                Session.set("username", username);
                var msg = [];
                msg.push("Login successfull");
                self.state.form.setState({messages:msg});
                Router.go("/");
            }
        });
    },
    getForm: function(component){
      console.log("Got form ");
      this.setState({form:component});
    },
    render:function(){
        return(
                <div>
                <BasicForm title='Login' customStyle='lform' getForm={this.getForm} questions={LoginFields} extraButtons={extraButtons} submitForm={this.submitForm} submitButtonLabel="Login"/>
                
                </div>
            )
    }
});