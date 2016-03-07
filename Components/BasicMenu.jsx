BasicMenu = React.createClass({
    render:function(){
            var cName = "menu " + this.props.customStyle;
            var self = this;
        return(
                <div className={cName}>
                    <ul>
                        {this.props.children}
                        {this.props.items.map(function(item, i){
                            var itemClass = item.link == "" ? "menuLabel" : "menuLink"
                           return(<MenuItem key={i} className={itemClass} link={item.link} event={self.props.event} label={item.label} />) 
                        })}
                    </ul>
                </div>
            )
    }
});

var MenuItem = React.createClass({
    handleClick:function(){
        var goToLink = "";
        if(this.props.event != ""){
            goToLink += "/" + this.props.event;
        }
        if(this.props.link != ""){
            goToLink += this.props.link;
        }
        if(goToLink != ""){
            Router.go(goToLink); 
        }
    },
    render:function(){
        var active = "";
        var goToLink = "";
        if(this.props.event != ""){
            goToLink += "/" + this.props.event;
        }
        if(this.props.link != ""){
            goToLink += this.props.link;
        }
        var route = Router.current().route.path();
        if( route == this.props.link){
            active = "active";
        }
        return(
            <li><a href={goToLink} className={active}>{this.props.label}</a></li>)
    }
});