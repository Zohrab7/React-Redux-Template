import React, { Component } from 'react';
import { compose } from 'redux';

import classname from 'hocs/classname';

import MainText from 'components/MainText';

import './main.scss';

const composedPath = (el) => {

	    var path = [];

	    while (el) {

	        path.push(el);

	        if (el.tagName === 'HTML') {

	            path.push(document);
	            path.push(window);

	            return path;
	       }

	       el = el.parentElement;
	    }
	}


class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {names: true, sphere: 0};
	}

	showNames = () => {
		this.setState({names: true})
	}

	hideNames = () => {
		this.setState({names: false})
	}

	changeSphere = (e) => {
		if(!e.currentTarget.classList.contains('locked')){
			this.setState({sphere: e.currentTarget.getAttribute('number')});
			if(e.currentTarget.classList.contains('main-names__item')){
				this.hideNames();
			} else{
				this.showNames();
			}
		}
	}


	// Вызывается до рендера
	componentWillMount() {
	  document.addEventListener('click', this.handleClickOutside.bind(this), false);
	}

	// Отлавливаем клик на любую область
	handleClickOutside(e) {
	  // Получаем ссылку на элемент, при клике на который, скрытие не будет происходить
	  const names = document.getElementsByClassName('main-names')[0];
	  // Проверяем, есть ли в списке родительских или дочерних элементов, вышеуказанный компонент
	  if (!e.composedPath().includes(names)) {
	    const burger = document.querySelector('.main-list__burger');
	    if (!e.composedPath().includes(burger)) this.setState({ names: false });
	  }
	}

	render() {
		const {items=[], ...rest} = this.props;

		return (
			<div {...rest}>
				<div class="main-list">
					<img src={require("images/burger.svg")} alt="" class="main-list__burger" onClick={this.showNames} />
					{
						items.map((item, index) => (
							<div number={index} class={`main-list__item ${!item.paid && 'main-list__item_locked locked'}`} onClick={this.changeSphere}>{index+1}</div>
						))
					}
				</div>
				<div class={`main-names ${this.state.names && 'active'}`}>
					<div class="main-names__close" onClick={this.hideNames}>
						<img src={require("images/close.png")} alt="" />
					</div>	
					{
						items.map((item, index) => (
							<div number={index} class={`main-names__item ${!item.paid && 'main-names__item_locked locked'}`} onClick={this.changeSphere}>
								<div class="main-names__item-name">{index+1}.{item.name}</div>
								{
									item.paid ? <div class="main-names__item-icon"><i class="fas fa-plus"></i></div> : <div class="main-names__item-icon"><i class="fa fa-lock"></i></div>
								}
							</div>
						))
					}
				</div>	
				{items[this.state.sphere].component}
			</div>
		);
	}
}

export default compose(
	classname('main'),
)(Main)
