import {combineReducers} from "redux";
import {reducer as form} from 'redux-form';

import common            from "./common_reducer";
import passport          from "./passport_reducer";
import tag               from "./tag_reducer";
import application       from "./application_reducer";
import provider          from "./provider_reducer";
import person            from "./person_reducer";
import editor            from "./editor_reducer";
import topics            from "./topics_reducer";
import search            from "./search_reducer";
import edit              from "./edit_reducer";
import cms               from "./cms_reducer";
import filter            from "./filter_reducer";
import create            from "./create_reducer";
import group             from "./group_reducer";

const rootReducer = combineReducers({
  group,
  common,
  passport,
  tag,
  application,
  provider,
  person,
  editor,
  form,
  topics,
  search,
  edit,
  cms,
  filter,
  create
});

export default rootReducer;
