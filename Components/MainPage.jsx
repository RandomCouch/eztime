
MainPage = React.createClass({
    
    render:function(){
        return(<div className='main'>
                <div className='container_main'>
                    {this.props.children}
                </div>
            </div>);
    }
    
});