import React, { Component } from "react";
import { BrowserRouter, NavLink } from 'react-router-dom';


export class Nav extends Component {
    render(){
        return(
            <BrowserRouter>
                <nav>
                    <p><NavLink to='/'>Home</NavLink></p>
                    <p><NavLink to='/topics'>Topics</NavLink></p>
                    <p><NavLink to='/contact'>Contact</NavLink></p>
                </nav>
            </BrowserRouter>
        );
    }
};


export default Nav;
