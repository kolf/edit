import memoize from "lru-memoize";
import {createValidator, required, number, maxLength, zhEn, enNumber} from "app/utils/validation";
import {isEn} from "app/utils/utils";
//const validation = createValidator({
//	"cnname": required,
//	"enname": required,
//	"kind"  : required
//	"pid"	: [required,number]
//});

const validation = data => {
    const errors = {};

    //console.log(data);

    // if(data.type=='creative'){
    //     if (!data.enname) errors.enname = '请输入英文名';
    //     if (!data.cnname) errors.cnname = '请输入中文名';
    // }

    if(data.type=='creative'){ // 创意类
        if (!data.enname) errors.enname = '请输入英文名';
        if (!data.cnname) errors.cnname = '请输入中文名';
    }else if(isEn()){
        if (!data.enname) errors.enname = '请输入英文名';
    }else{
        if (!data.cnname) errors.cnname = '请输入中文名';
    }

    if(data.type=='creative'&&!data.pid) errors.pid = '请输入父ID';
    //console.log('----data',data);
    return errors;
};

export default memoize(10)(validation);
