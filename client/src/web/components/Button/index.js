import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import classname from 'hocs/classname';

import './main.scss';

export default classname('button')(
	({href, alternative_tag = 'button', ...rest}) => {
		const Tag = href ? Link : alternative_tag;
		
		return (
	        <Tag {...rest} to={href || undefined} />
	    )
	}
)