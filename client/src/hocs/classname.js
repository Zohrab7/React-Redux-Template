import React from 'react';

import { classname } from 'utils';

export default (base_class, apply = [], is_pure = false) => WrappedComponent => ({modifiers = [], mixin = '', className = '', ...rest}) => {
    apply.forEach(item => {
        const applyMod = (item, default_value) => {
            const {mod_name, mod_value} = (typeof item === 'object') ? {mod_value: rest[item.type], mod_name: item.type} : {mod_value: rest[item], mod_name: item};

            if (typeof item === 'object' && !item.filter) {

            }else {
                rest[mod_name] = undefined;
            }

            // console.log('name', mod_name);
            // console.log('value', mod_value);

            switch (true) {
                case typeof mod_value === 'boolean':
                case typeof default_value === 'boolean':
                    return (mod_value || default_value) ? modifiers.concat(mod_name) : modifiers;
                case typeof (mod_value || default_value) === 'string':
                    return modifiers.concat(`${mod_name}_${mod_value || default_value}`);
                case typeof mod_value === 'undefined':
                    // return modifiers
                    // console.log('?', typeof item === 'object' && item.default, item, default_value, mod_name);
                    return (typeof item === 'object' && item.default) ? applyMod(mod_name, item.default) : modifiers
                default:
                    // console.log('mod_value', mod_value);
                    // console.log('mod_name');
                    throw new Error(`Wrong modifier type ${mod_name}, ${typeof mod_value}, ${item}, ${WrappedComponent}`)
            }
        }

        modifiers = applyMod(item);
    })

    return <WrappedComponent {...rest} className={classname(base_class, modifiers, mixin ? `${is_pure ? '' :className} ${mixin}` : (is_pure ? '' :className))} />
}
