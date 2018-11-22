export const classname = (base_class, modifiers = [], mixin) => applyModifiers(base_class, modifiers) + (mixin ? ` ${mixin}` : '')

// WEB
export const applyModifiers = (base_class, modifiers = []) => modifiers.reduce((className, mod) => `${className} ${base_class}_${mod}`, base_class)

export const required = message => {
    throw new Error('Missing required param ' + message);
}

export const clearMask = tel => '+' + tel.replace(/\D+/g, '');

export const should_update = status => status === 'need_update' || status === 'initial';

// WEB
export const resolve = promise => cb => {
    promise.then((data = {}) => {
        console.log('data', data);
        if (data.status === 'ok' || data.status === 200) cb(data);
    })
}

export const redirect = (history, to) => promise => {
    resolve(promise)(() => history.push(to));
}

// export const parseQuery = (search) => {
//     console.log("url in parse query",search);
//     search = search.replace('?','');
//     const parsedQuery = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
//     return parsedQuery;
// }
export const parseQuery = (queryString) =>  {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export const compareObjects = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!compareObjects(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}

	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

export const setCookie = ({name,value,days = 10}) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


export const getCookie = (name)  =>  {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export const preventDefault = func => e => {
    e.preventDefault();
    func(e);
}
