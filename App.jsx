
App = React.createClass({
    componentDidMount(){
      document.title = this.props.title;
      
      
    },
   render(){
       return(
            <div>
            <div className='resources'>
                {this.props.scripts.map(function(script, i){
                    return(<script src={script} key={i} />)
                })}
                {this.props.css.map(function(css, j){
                    return(<link rel='stylesheet' href={css} key={j}/>)
                })}
            </div>
            <div className='container_ezt'>
                {this.props.children}
            </div>
            </div>
           )
   } 
    
});