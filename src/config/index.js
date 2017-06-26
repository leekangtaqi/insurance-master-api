import baseCfg from './config.base'
import props from '../app/properties'
import * as _ from 'lodash'

const env = process.env
const suffix = env === props.env.QA ? 'qa' : env === props.env.PRD ? 'prd' : 'dev'
const toMergeCfg = require(`./config.${suffix}`).default

export default _.merge({}, baseCfg, toMergeCfg);