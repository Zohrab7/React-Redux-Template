import React, { Component } from 'react';
import createComponent, { createElement } from 'hocs/createComponent';

import Video from 'components/Video';

import classname from 'hocs/classname';

const MainText = createComponent({className: 'main-text'}, [
    {name: 'Title', tag: 'h2', className: 'title'},
    {name: 'P', tag: 'p', className: 'paragraph'},
    {name: 'Video', tag: Video, className: 'video'},
    {name: 'Top', className: 'top'},
]);

export default MainText