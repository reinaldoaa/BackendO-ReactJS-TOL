const AccessControl = require('accesscontrol');
const acc = new AccessControl();

acc.grant('client')
    .readAny("product")
    .readOwn('user')
    .updateOwn('user')

acc.grant('user')
    .readAny("product")
    .readOwn('user')
    .updateOwn('user')
    .deleteOwn('user')

acc.grant('admin')
    .extend('user')
    .createAny('product')
    .updateAny('product')
    .deleteAny('product')

acc.grant('admin')
    .createAny('rol')    
    .readAny('rol')
    .updateAny('rol')
    .deleteAny('rol')

acc.grant('admin')
    .readAny('user')
    .createAny('user')
    .updateAny('user')
    .deleteAny('user')

module.exports = acc;
