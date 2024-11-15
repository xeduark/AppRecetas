import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome} from "react-icons/fa";
import { PiHamburgerBold } from "react-icons/pi";
import { GiFruitBowl } from "react-icons/gi";
import Style from '../styles/sidebar.module.css';

const Sidebar = ({ isOpen }) => {
    return (
        <div className={`${Style.sidebar} ${isOpen ? '' : Style.closed}`}>
            <ul>
                <li>
                    <NavLink to="/estadisticas" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <FaHome className={Style.icon}/>Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/vegetarianas" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <GiFruitBowl className={Style.icon}/>Vegetarianas
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/novegetarianas" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <PiHamburgerBold className={Style.icon}/>No Vegetarianas
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
