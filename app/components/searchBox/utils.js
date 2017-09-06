import moment from "moment";

const re = {
    TIME: /^(.{10})|,.{10}/,
    KEY: /\(([\d,]+)\)/g
};


const splitVal = val => {
    if (Array.isArray(val)) {
        if(!val.length){
            return {value: [], key: '', label: ''}
        }
        return {
            value: val.map(item => item.split('|')[2]).join(',').replace(/^,|,$/g, ''),
            key: val[0].split('|')[0],
            label: val.map(item => item.split('|')[1]).join(',').replace(/^,|,$/g, '')
        }
    } else if (!/\|/.test(val)) {
        return {
            value: val
        }
    } else {
        const arr = val.split('|');
        return {
            key: arr[0],
            label: arr[1],
            value: arr[2]
        }
    }
};

const joinVal = vals => {
    for(let name in vals){
        if (Array.isArray(vals[name])) {
            vals[name] = vals[name].map(item => item.split('|')[2]).toString().replace(/^\,+/g, '')
        } else if (typeof vals[name] == 'string') {
            vals[name] = splitVal(vals[name]).value;
        }
        if(!name) delete vals[name]
    }
    return vals
};

const toValueStr = value => {
    let re = /\d+/g;
    if (Array.isArray(value)) {
        return value.length ? (value + '').match(re).join(',') : []
    } else {
        re = /([^\(\]]+)(?=\))/;
        if (re.test(value)) {
            value = value + '';
            return value ? value.match(re)[0] : '';
        } else {
            return value ? value : ''
        }
    }
};

const str2json = str => (new Function("return " + str))();

const searchs2title = searchs => {
    let result = [];
    for (let name in searchs) {
        if(!name){
            return;
        };
        const valStr = searchs[name];
        if (/00:00:00/.test(valStr)) {
            result.push(valStr.match(re.TIME).join(','))
        } else if (splitVal(valStr).value) {
            if (Array.isArray(splitVal(valStr).value)) {
                result.push(splitVal(valStr).label)
            } else {
                result.push(splitVal(valStr).label)
            }
        }
    }
    return result.join('+').replace(re.KEY, '').replace(/^\+|\+$/g, '').replace(/\+\+/g, '+')
};

const formatDate = (date) => {
    return date.split(',').map(time => {
        return moment(time.substr(0, 10))
    })
};

export {
    toValueStr,
    str2json,
    searchs2title,
    formatDate,
    splitVal,
    joinVal
}
