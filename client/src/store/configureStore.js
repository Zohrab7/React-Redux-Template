if (process.env.PLANFORM_ENV === 'web') {
    // if (process.env.NODE_ENV === 'production') {
    //     module.exports = require('store/configureStoreWeb.prod.js')
    // }else {
        module.exports = require('store/configureStoreWeb.dev.js')
    // }
}else {
    module.exports = require('store/configureStoreNative.js');
}
