import React, { Component } from 'react';

import classname from 'hocs/classname';

import './main.scss';

export default classname('video')(
	({src = '', ...rest}) => (
		<div {...rest}>
			<div className="video__wrapper">
				<video src={src} height="100%" width="100%"></video>
				<img src={require("images/play.svg")} alt="" className="video__play" />
			</div>
		</div>
	)
)