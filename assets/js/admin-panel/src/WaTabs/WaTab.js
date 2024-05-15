import classes from "classnames";
import { Component } from '@wordpress/element';

export default class WaTab extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {active = false, title, onClick} = this.props;
        return <li class={classes("cf-container__tabs-item", {"cf-container__tabs-item--current": active})} tabindex="-1" role="tab" aria-selected="false">
            <button type="button" onClick={() => onClick(title)}>{title}</button>
        </li>;
    }
}