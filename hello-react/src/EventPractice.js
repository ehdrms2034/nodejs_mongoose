import React, {Component} from 'react';

class EventPractice extends Component {
    
    state = {
        message :''
    }
    
    handleChange(e){
        this.setState({
            message : e.target.value
        });
    }

    handleKeyPress=(e) =>{
        if(e.key === 'Enter'){
            alert('엔터키 침');
        }
    }

    render(){
        return (
            <div>
                <h1> 이벤트 연습 </h1>
                <input
                    type ="text"
                    name ="message"
                    placeholder = "배고프다"
                    value = {this.state.message}
                    onChange={
                        (e)=>{
                            console.log(e.target.value);
                        }}
                    
                    onKeyPress={this.handleKeyPress}    
                        
                        />
                    <button
                    onClick={()=>{
                        alert(this.state.message);
                        this.setState({
                            message:''
                        });
                    }
                }
                    >
                        확인


                        </button>


            </div>
        
        )
    };
}

export default EventPractice;