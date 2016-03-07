
TimesheetQuestions = [
        {label:"Start At", type: "date", name:"startAt"},
        {label:"Max Weeks", type:"number", name:"maxWeeks"}
    ];

extraButtons = [
        {label: "Go Back", handleClick: function(){
             history.back(); 
        }}
    ];

CreateTimesheet = React.createClass({
    submitForm:function(data){
        console.log("Got time sheet input data: " + JSON.stringify(data));
        var startAt = data[0].value;
        var maxWeeks = data[1].value;
        console.log("Sending : " + startAt + " " + maxWeeks);
        var userID = Meteor.user()._id;
        $.ajax({
            url:'/timesheet/generate',
            type:'POST',
            data: {userID: userID, startAt: startAt, maxWeeks: maxWeeks},
            success:function(results){
                console.log("Got results array: " + results);
            }
        })
    },
   render:function(){
       return(<div className='controls_container'>
            <BasicForm questions={TimesheetQuestions} submitButtonLabel="Generate Sheet" extraButtons={extraButtons} submitForm={this.submitForm} />
       </div>)
       
   } 
});