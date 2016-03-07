Shifts = new Mongo.Collection('shifts');
Breaks = new Mongo.Collection('breaks');

var toTimezone = function(time, zone){
    var format = "DD-MM-YYYY HH:mm:ss";
    return moment(time, format).tz(zone).format(format);
}


Meteor.users.allow({remove:function() { return true }, update: function(){ return true }});
Meteor.startup(function(){
  Router.route("/shifts/new",  {where: "server"})
    .post( function(){
      var body = this.request.body;
      var userID = body.userID;
      //Get current date and time and split into two vars
      var curDate = new Date();
      var sDate = curDate.getDate() + "-" + (curDate.getMonth()+1) + "-" + curDate.getFullYear();
      var sTime = curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds();
      var timeZone = curDate.getTimezoneOffset();
      var dateTimeStr = sDate + " " + sTime + " " + timeZone;
      var realTime = toTimezone(dateTimeStr, "America/Toronto");
      sTime = realTime.split(" ")[1];
      sDate = realTime.split(" ")[0];
      var shiftEntry = {
        live: 1,
        start_date: sDate,
        start_time: sTime,
        end_date: null,
        end_time: null,
        total: null,
        tasks: "",
        user_id: userID
      }
      var existingShift = Shifts.find({live:1, user_id:userID}).fetch();
      if(existingShift.length == 0){
        Shifts.insert(shiftEntry);
      }else{
        //Shifts.update({}, {$set: {live: 0}});
        for(var x in existingShift){
          console.log(JSON.stringify(existingShift[x]));
          var sID = existingShift[x]._id;
          var isLive = existingShift[x].live;
          if(isLive){
            Shifts.update(sID, {$set: {live:0}});
          }
        }
        Shifts.insert(shiftEntry);
      }
      var liveShift = Shifts.findOne({live:1, user_id:userID});
      this.response.statusCode = 200;
      this.response.end(JSON.stringify(liveShift));
    });
    Router.route("/shifts/end",  {where: "server"})
      .post( function(){
        var body = this.request.body;
        var userID = body.userID;
        //Get current date and time and split into two vars
        var curDate = new Date();
        var sDate = curDate.getDate() + "-" + (curDate.getMonth()+1) + "-" + curDate.getFullYear();
        var sTime = curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds();
        var timeZone = curDate.getTimezoneOffset();
        var dateTimeStr = sDate + " " + sTime + " " + timeZone;
        var realTime = toTimezone(dateTimeStr, "America/Toronto");
        sTime = realTime.split(" ")[1];
        sDate = realTime.split(" ")[0];
        //Check for an existing shift and edit it, if no live shift exists, this shouldn't be possible
        var existingShift = Shifts.findOne({live:1, user_id:userID});
        if(!existingShift){
          //Do nothing if no live shift was found
        }else{
          var sID = existingShift._id;
          //calculate total
          var startDate = existingShift.start_date;
          var startTime = existingShift.start_time;
          var sDT = new Date(startDate + " " + startTime);
          var eDT = new Date(sDate + " " + sTime);
          var hourDiffms = (eDT - sDT);
          var diffHrs = Math.floor((hourDiffms % 86400000) / 3600000); //Hours
					var diffMins = Math.floor(((hourDiffms % 86400000) % 3600000) / 60000); //Minutes
					var m = (diffMins * 100)/60;
					var hd = diffHrs + "." + m;
				//	var nhd = diffHrs + ":" + diffMins;
          var hourDiff = (Math.round(parseFloat(hd) * 2) / 2).toFixed(1);
          
          Shifts.update(sID, {$set: {live:0, end_date:sDate, end_time:sTime, total:hd}});
        }
        this.response.statusCode = 200;
        this.response.end("1");
        
      });
    Router.route("/breaks/new",  {where: "server"})
      .post( function(){
        var body = this.request.body;
        var userID = body.userID;
        
        //Get current date and time and split into two vars
        var curDate = new Date();
        var sDate = curDate.getDate() + "-" + (curDate.getMonth()+1) + "-" + curDate.getFullYear();
        var sTime = curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds();
        var timeZone = curDate.getTimezoneOffset();
        var dateTimeStr = sDate + " " + sTime + " " + timeZone;
        var realTime = toTimezone(dateTimeStr, "America/Toronto");
        sTime = realTime.split(" ")[1];
        sDate = realTime.split(" ")[0];
        //get live shift, if doesn't exist then this shouldn't be possible
        var liveShift =  Shifts.find({live:1, user_id: userID}).fetch();
        if(liveShift.length > 0){
          var shiftID = liveShift[0]._id;
          var breakEntry = {
            live: 1,
            start_date: sDate,
            start_time: sTime,
            end_date: null,
            end_time: null,
            total: 0,
            user_id: userID,
            shift_id: shiftID
          }
          //Check if a live break already exists, because it shouldn't
          var existingBreak = Breaks.find({live:1, user_id: userID, shift_id:shiftID}).fetch();
          if(existingBreak.length > 0){
            for(var x in existingBreak){
              var bID = existingBreak[x]._id;
              Breaks.update(bID, {$set: {live:0}});
            }
            Breaks.insert(breakEntry);
          }else{
            //No live breaks exist, insert new break
            Breaks.insert(breakEntry);
          }
          var liveBreak = Breaks.findOne({live:1, user_id:userID, shift_id:shiftID});
          this.response.statusCode = 200;
          this.response.end(JSON.stringify(liveBreak));
        }
      });
    Router.route("/breaks/end",  {where: "server"})
      .post( function(){
        var body = this.request.body;
        var userID = body.userID;
        
        //Get current date and time and split into two vars
        var curDate = new Date();
        var sDate = curDate.getDate() + "-" + (curDate.getMonth()+1) + "-" + curDate.getFullYear();
        var sTime = curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds();
        var timeZone = curDate.getTimezoneOffset();
        var dateTimeStr = sDate + " " + sTime + " " + timeZone;
        var realTime = toTimezone(dateTimeStr, "America/Toronto");
        sTime = realTime.split(" ")[1];
        sDate = realTime.split(" ")[0];
        
        //Check for a live break, if it doesnt exist this shouldn't be possible
        var liveBreaks = Breaks.find({live:1, user_id:userID}).fetch();
        if(liveBreaks.length > 0){
          var bID = liveBreaks[0]._id;
          //Got the live break, now calculate the total and update the record
          var startDate = liveBreaks[0].start_date;
          var startTime = liveBreaks[0].start_time;
          var sDT = new Date(startDate + " " + startTime);
          var eDT = new Date(sDate + " " + sTime);
          var hourDiffms = (eDT - sDT);
          var diffHrs = Math.floor((hourDiffms % 86400000) / 3600000); //Hours
					var diffMins = Math.floor(((hourDiffms % 86400000) % 3600000) / 60000); //Minutes
					var m = (diffMins * 100)/60;
					var hd = diffHrs + "." + m;
				//	var nhd = diffHrs + ":" + diffMins;
          var hourDiff = (Math.round(parseFloat(hd) * 2) / 2).toFixed(1);
          
          Breaks.update(bID, {$set: {live: 0, end_date: sDate, end_time: sTime, total:hd}});
        }
        this.response.statusCode = 200;
        this.response.end("1");
      });
    Router.route("/timesheet/generate", {where:"server"})
      .post(function(){
          var body = this.request.body;
          var userID = body.userID;
          
          var startAt = body.startAt;
          var maxWeeks = body.maxWeeks;
          if (maxWeeks == "") {
              maxWeeks = 2;
          }
          var dArr = startAt.split("-");
          var nDSTR = dArr[1] + "-"  + dArr[0] + "-" + dArr[2];
          var d = new Date(nDSTR);
         // var newInDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
          var  newSD = d;
          var days = [];
          for (var i = 0; i < 14; i++) {
            //console.log("Input date : day: " + d.getDate() + " month: " + (d.getMonth()+1) + " year: " +d.getFullYear());
            
            var  newD = new Date(nDSTR);
            newD.setDate(newD.getDate() + i);
            //console.log("Dates : "  + dStr);
            var dObj = {};
            
            var dDate = newD;
            var mmonth = dDate.getMonth() + 1;
            var mDate = dDate.getDate();
            if(mmonth < 10){
              mmonth = "0" + mmonth;
            }
            if(mDate < 10){
              mDate = "0" + mDate;
            }
            var newDStr = mDate + "-" + mmonth + "-" + dDate.getFullYear();
            var newDStr2 = mmonth + "-" + (mDate - 1) + "-" + dDate.getFullYear();
            var newDStr3 = mmonth + "-" + mDate + "-" + dDate.getFullYear();
            dObj.day = newDStr;
            dObj.date = new Date(newDStr3);
            var dayStr = "";
            var daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
            dayStr = daysArr[new Date(newDStr2).getDay()];
            dObj.dayStr = dayStr;
            days.push(dObj);
          }
          var newED = days[days.length -1].date;
          var shifts = [];
          var breaks = [];
          //var tasks = [];
          var allShifts = Shifts.find({user_id:userID}).fetch();
          for(var x in allShifts){
            var thisShift = allShifts[x];
            //Check if this shift is within range
            var thisSDate = new Date(thisShift.start_date);
            var newInDate = thisSDate.getDate() + "-" + (thisSDate.getMonth()+1) + "-" + thisSDate.getFullYear();
            var  newSDD = new Date(newInDate);
            console.log("This shifts date is :" + newSDD.toLocaleDateString());
            if(newSDD >= newSD && newSDD <= newED){
              shifts.push(thisShift);
            }
          }
          var allBreaks = Breaks.find({user_id:userID}).fetch();
          for(var x in allBreaks){
            var thisBreak = allBreaks[x];
            var thisBDate = new Date(thisBreak.start_date);
            var newInDate = thisBDate.getDate() + "-" + (thisBDate.getMonth()+1) + "-" + thisBDate.getFullYear();
            var newSDD = new Date(newInDate);
            if(newSDD >= newSD && newSDD <= newED){
              breaks.push(thisBreak);
            }
          }
          console.log("All shifts between " + startAt + " and " + days[days.length -1].day + " \n "  + JSON.stringify(shifts));
          console.log("All breaks between " + startAt + " and " + days[days.length -1].day + " \n "  + JSON.stringify(breaks));
         // console.log("Days: " + JSON.stringify(days));
          this.response.statusCode = 200;
          this.response.end("1");
      });
})
if (Meteor.isClient) {
  Meteor.startup(function(){
    var currentUser = Meteor.userId();
      Router.onBeforeAction(function(){
        //Clean up shifts with no associated users
        var invalidShifts = Shifts.find({}).fetch();
        for(var x in invalidShifts){
          if(!invalidShifts[x].user_id){
            Shifts.remove(invalidShifts[x]._id);
          }
        }
        
        var currentRoute = Router.current().route.getName() ? Router.current().route.getName() : "";
        var idParam = this.params.id ? this.params.id : "";
        var routeSplit = currentRoute.toString().split('.');
        console.log("Route: "  + JSON.stringify(routeSplit));
        var event = this.params.event;
        var page = this.params.page ? this.params.page : "";
          if(!Meteor.userId() && Router.current().route.path() != '/signup'){
            ReactDOM.render(<App session={Session} css={Links} title="Login" scripts={Scripts}>
                    <LoginForm />
                </App>, document.getElementById("render-target"));
            //this.next();
          }else{
            this.next();
            
          }
        
      });
      
      Router.route('/', function(){
            //Check for live shift
            var inShift = 0;
            var inBreak = 0;
            var shiftID = "";
            var breakID = "";
            var startedAt = "";
            var bStartedAt = "";
            var liveShift = Shifts.findOne({live:1, user_id: Meteor.user()._id});
            if(!$.isEmptyObject(liveShift)){
              inShift = 1;
              shiftID = liveShift._id;
              startedAt = liveShift.start_date + " " + liveShift.start_time;
            }
            var liveBreak = Breaks.findOne({live:1, user_id: Meteor.user()._id});
            if(!$.isEmptyObject(liveBreak)){
              inBreak = 1;
              breakID = liveBreak._id;
              bStartedAt = liveBreak.start_date + " " + liveBreak.start_time;
            }
            console.log("LIVE SHIFT: " + JSON.stringify(liveShift));
            ReactDOM.render(<App session={Session} css={Links} title="Main" scripts={Scripts}>
                <MainPage>
                  <TopMenu items={TopLinks} user={Meteor.user()}/>
                  <MainControls user={Meteor.user()} inShift={inShift} inBreak={inBreak} shiftID={shiftID} breakID={breakID} startedAt={startedAt} bStartedAt={bStartedAt}/>
                </MainPage>
              </App>, document.getElementById("render-target"));
      });
      Router.route('/timesheet/create', function(){
        ReactDOM.render(<App session={Session} css={Links} title="Create Timesheet" scripts={Scripts}>
                  <MainPage>
                    <TopMenu items={TopLinks} user={Meteor.user()}/>
                    <CreateTimesheet />
                  </MainPage>
              </App>, document.getElementById("render-target"));
      });
      Router.route('/signup', function(){
          ReactDOM.render(<App session={Session} css={Links} title="Signup" scripts={Scripts}>
                  <SignupForm />
              </App>, document.getElementById("render-target"));
      });
      Router.route('/logout', function(){
        currentUser = Meteor.userId();
        if(currentUser){
          Meteor.logout();
          currentUser = null;
          delete Session.keys['user'];
        }
        Router.go('/');
      });
      
      
      
      
  });
}
