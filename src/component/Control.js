import React, {Component} from 'react';

class Control extends Component {
    render(){
        return(
            <ul>
                <li>
                    <a
                    href='./CreateContent'
                    onClick={function(mode){
                        this.props.onChangeMode('create');
                    }.bind(this)}>
                        메뉴1
                    </a>
                </li>

                <li>
                    <a
                    href='/update'
                    onClick={function(mode){
                        this.props.onChangeMode('update');
                    }.bind(this)}>
                        메뉴2
                    </a>
                </li>
                
                <li>
                    <a
                    href='/update'
                    onClick={function(mode){
                        this.props.onChangeMode('delete');
                    }.bind(this)}>
                        메뉴3
                    </a>
                </li>
            </ul>
        );
    }
}

export default Control;