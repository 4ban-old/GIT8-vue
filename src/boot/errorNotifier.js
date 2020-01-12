import Vue from 'vue'
import { errorNotifier } from '@/services/errorNotifier'

Vue.prototype.$errorNotifier = errorNotifier
