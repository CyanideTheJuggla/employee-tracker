require('dotenv').config();


class Util {
    constructor(){}

    static Log(msg, _obj, _spaced) {
        const timeStamp = new Date();
        //console.log('');
        
        (_obj) ?
            console.log(`[${timeStamp.toLocaleDateString()} - ${timeStamp.toLocaleTimeString()}: ${timeStamp.getMilliseconds()}]> ${msg}:`, _obj)
        : 
            console.log(`[${timeStamp.toLocaleDateString()} - ${timeStamp.toLocaleTimeString()}]> ${msg}`)
        ;
        if(_spaced) console.log('');
    }

    static StringFormat(str, type){
        switch (type) {
            case '$':
                return `$${Number.parseFloat(str).toFixed(2)}`;
            case 'camelCase':
                let retval = '';
                const strParts = str.split(' ');
                strParts.forEach(part => {
                    retval += part[0].toUpperCase() + part.substring(1, part.length);
                    if(strParts.indexOf(part) != strParts.length - 1) retval += ' ';
                });
                return retval;
                break;
            
            default:
                break;
        }
    }
}

module.exports = Util;