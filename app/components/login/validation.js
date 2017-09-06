import memoize from "lru-memoize";
import {createValidator, required, maxLength, email} from "app/utils/validation";

const validation = createValidator({
  userName: [required, maxLength(20)],
  password: [required, maxLength(20)]
});

export default memoize(10)(validation);