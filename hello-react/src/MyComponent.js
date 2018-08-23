import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MyComponent extends Component {
    
    static defaultProps={
        name : '기본 이름'
    }

    constructor(props){
        super(props);
        
        
    }

    state ={
        number : 2
    }

    render(){


        return(

            <div>
                안녕하세요, 제 이름은 {this.props.name} 입니다.
                <p>저는 {this.state.number} 살 입니다.</p>
                <button onClick={()=>{
                    this.setState({
                        number : this.state.number +1
                    })
                }}>누르기 </button>
                </div>


        );
    }

}



export default MyComponent;