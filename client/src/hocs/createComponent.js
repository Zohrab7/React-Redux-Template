import React from 'react';
import { compose } from 'redux';

import classname from 'hocs/classname';
import tagHoc from 'hocs/tag';

export const createElement = ({tag, className, mods, pure_class, ...props}) => compose(
    classname(className, mods, pure_class),
    tagHoc(tag),
)(
    ({Tag, ...rest}) => (
        <Tag {...props} {...rest} />
    )
);

// element = {
//     name: Wrap,
//     className: {default: this.name.toLowwerCase()},
//     tag: {default: 'div'},
//     mods: ['active', {type: 'theme', default: 'large'}, {type: 'active', default: false}]
//     ...props
// }
const createComponent = (block, elements = []) => {
    const Component = createElement(block);

    elements.forEach(({name, className, ...rest}) => {
        Component[name] = createElement({className: `${block.className}__${className || name.toLowerCase()}`, ...rest});
    });

    return Component
};

export default createComponent
