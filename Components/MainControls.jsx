
MainControls = React.createClass({
    getInitialState: function(){
      return {
          inShift: this.props.inShift,
          inBreak: this.props.inBreak,
          shiftStartedAt: this.props.startedAt,
          breakStartedAt: this.props.bStartedAt,
          curShiftID: this.props.shiftID,
          curBreakID: this.props.breakID,
          project: "",
          user: null
      }  
    },
    componentDidMount: function(){
      var usr = this.props.user;
      this.setState({user: usr});
      //Check if user has live shift
      var liveShift = Shifts.findOne({live:1});
      if(liveShift.length > 0){
          this.setState({inShift:1, curShiftID: liveShift._id});
      }
    },
    startShift: function(){
      console.log("Start shift for user " + this.state.user._id);
      var that = this;
      $.ajax({
          url:'/shifts/new',
          type:'POST',
          data: {userID: this.state.user._id},
          success: function(results){
              console.log("Got response from server: Start Shift \n " + results);
              var newShift = JSON.parse(results);
              that.setState({inShift:1, shiftStartedAt:newShift.start_date + " " + newShift.start_time, curShiftID: newShift._id});
          }
          
      })
    },
    startBreak: function(){
        var that = this;
        $.ajax({
          url:'/breaks/new',
          type:'POST',
          data: {userID: this.state.user._id},
          success: function(results){
              console.log("Got response from server: start break: \n " + results);
              var newBreak = JSON.parse(results);
              that.setState({inBreak:1, breakStartedAt:newBreak.start_date + " " + newBreak.start_time, curBreakID: newBreak._id});
          }
              
          })
    },
    endShift: function(){
        var that = this;
        $.ajax({
          url:'/shifts/end',
          type:'POST',
          data: {userID: this.state.user._id},
          success: function(results){
              console.log("Got response from server: End Shift \n " + results);
              that.setState({inShift:0, shiftStartedAt:"", curShiftID: ""});
          }
          
      })
    },
    endBreak: function(){
        var that = this;
        $.ajax({
          url:'/breaks/end',
          type:'POST',
          data: {userID: this.state.user._id},
          success: function(results){
              console.log("Got response from server: end break: \n " + results);
              that.setState({inBreak:0, breakStartedAt:"", curBreakID: ""});
          }
              
         })
    },
    render:function(){
        var inShift = "";
        if(this.state.inShift){
            inShift = <div className='shiftInfo'>Shift started at {this.state.shiftStartedAt}</div>
        }
        var inBreak = "";
        if(this.state.inBreak){
            inBreak = <div className='shiftInfo'>Break started at {this.state.breakStartedAt}</div>
        }
        var buttons;
        if(this.state.inShift == 0){
            buttons = [<BasicButton label='Start Shift' handleClick={this.startShift}/>];
        }else if(this.state.inShift == 1 && this.state.inBreak == 0){
            buttons = [<BasicButton label='Start Break' handleClick={this.startBreak}/>,
                        <BasicButton label='End Shift' handleClick={this.endShift}/>];
        }else if(this.state.inShift == 1 && this.state.inBreak == 1){
            buttons = [<BasicButton label='End Break' handleClick={this.endBreak}/>]
        }
        return(<div className='controls_container'>
                {inShift}
                {inBreak}
                <ul className='controls'>
                    {buttons.map(function(btn, i){
                       return(<li key={i}>{btn}</li>); 
                    })}
                </ul>
            </div>);
    }
    
});

BasicButton = React.createClass({
    render: function(){
        return(
                <button className='btn_ez mainCtrl' onClick={this.props.handleClick}>{this.props.label}</button>
            )
        
    }
})