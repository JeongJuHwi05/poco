import React, {Component} from 'react';
import { NavLink } from "react-router-dom";

class Nav extends Component {
    render(){
        return(
            <nav>
                <div>
                    <NavLink to="/">
                    Home
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/hoHold">
                    HoHold
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/spenPatt">
                    SpenPatt
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/fixed">
                    Fixed
                    </NavLink>
                </div>
            </nav>
        );
    }
}

export default Nav;