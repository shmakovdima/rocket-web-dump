import cookie from 'react-cookie'
import init from './initial_states/client.json'
import {
    REGISTER_OK,
    REGISTER_FAILED,

    VERIFY_SMS_CODE_OK,
    VERIFY_SMS_CODE_FAILED,

    AUTH_START,
    AUTH_OK,
    AUTH_FAILED,

    LOG_OUT,
    ACCESS_DENIED
} from '../actions/client'

import {
    GET_TRANSACTIONS_OK,
    GET_TRANSACTIONS_FAILED,
    SWITCH_TRANSACTIONS_PAGE
} from '../actions/transactions'
import {
    GET_DISCOUNTS_OK,
    GET_DISCOUNTS_FAILED
} from '../actions/discounts'
import {
    GET_CHAT_OK,
    GET_CHAT_FAILED,
    SEND_MSG_OK,
    SEND_MSG_FAILED,
    SWITCH_CHAT_PAGE,
    LOAD_NEW_MSG_OK,
    CLEAN_UNREAD_COUNT,
    ENABLE_AUTO_UPDATE
} from '../actions/chat'
import {
    BLOCK_CARD_OK,
    UNBLOCK_CARD_OK,
    REISSUE_CARD_OK,
    CHANGE_PIN_VERIFY_CARD_NUMBER_OK,
    CHANGE_PIN_FINAL_OK,
    LOAD_CARD_LIMITS_OK,
    SET_CARD_LIMITS_OK,
    LOAD_ALL_EXTRACTS_OK,
    LOAD_EXTRACT_OK,
    RESET_EXTRACT,

    CLOSE_SAFE_OK,
    UPDATE_CARD_FAILED,
    UPDATE_SAFE_FAILED,
    RESET_CARD_SAFE_ACTIONS
} from '../actions/accounts'

const initialState = init;

export default function client(state = initialState, action) {
    // check for INCORRECT_TOKEN
    switch (action.type) {
        case AUTH_FAILED:
        case GET_TRANSACTIONS_FAILED:
        case GET_DISCOUNTS_FAILED:
        case GET_CHAT_FAILED:
        case SEND_MSG_FAILED:
        case UPDATE_CARD_FAILED: {
            if (action.data['response'] && action.data.response.response['code'] == "INCORRECT_TOKEN") {
                return Object.assign({}, init, {
                    errors: {
                        auth: 'Нужно ввести код еще раз'
                    }
                })
            }
            break;
        }
    }


    switch (action.type) {
        case REGISTER_OK: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, initialState.errors),
                register: Object.assign({}, state.register, {
                    stage: 'enter_sms_code',
                    sms_verification: action.data.sms_verification.id
                })
            })
        }

        // Authorization
        case REGISTER_FAILED: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, initialState.errors, {
                    stage: 'enter_phone',
                    register: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case VERIFY_SMS_CODE_OK: {
            let login_token = action.data.user.login_token
            let expire_at = new Date()
            expire_at.setFullYear(expire_at.getFullYear() + 1)

            cookie.save('rocket_login', login_token, {
                expires: new Date(expire_at)
            })
            cookie.save('device', action.data.device_id, {
                expires: new Date(expire_at)
            })

            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, initialState.errors),
                register: Object.assign({}, state.register, {
                    stage: 'done',
                    sms_verification: null
                })
            })
        }
        case VERIFY_SMS_CODE_FAILED: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, initialState.errors, {
                    stage: 'enter_sms_code',
                    register: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case AUTH_OK: {
            return Object.assign({}, state, {
                isAuthenticated: true,
                client: action.data.user,
                tokens: Object.assign({}, initialState.tokens, {
                    session: action.data.token
                }),
                errors: Object.assign({}, initialState.errors)
            })
        }
        case AUTH_FAILED: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, initialState.errors, {
                    auth: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case ACCESS_DENIED:
        case LOG_OUT: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                errors: Object.assign({}, state.errors, {
                    auth: null
                }),
                register: {
                    stage: 'enter_phone',
                    sms_verification: null
                },
            })
        }

        // Transactions
        case GET_TRANSACTIONS_OK: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    transactions: null
                })
            })

            new_state.transactions.per_page = action.data.pagination.per_page

            if (action.data.pagination.current_page > new_state.transactions.last_loaded_page) {
                new_state.transactions.last_loaded_page = action.data.pagination.current_page

                let new_t = action.data.feed
                if (new_t.length > 0) {
                    new_t.forEach(t => {
                        new_state.transactions.list.push(t)
                    })


                    if (new_t.length < new_state.transactions.per_page) {
                        new_state.transactions.more_available = false
                    }
                } else {
                    // no more available
                    new_state.transactions.more_available = false
                }
            }


            return new_state
        }
        case GET_TRANSACTIONS_FAILED: {
            return Object.assign({}, state, {
                errors: Object.assign({}, initialState.errors, {
                    transactions: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case SWITCH_TRANSACTIONS_PAGE: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    transactions: null
                })
            })

            new_state.transactions.current_page = action.data


            return new_state
        }

        // Fav places and special offers
        case GET_DISCOUNTS_OK: {
            return Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    discounts: null
                }),
                discounts: action.data
            })
        }
        case GET_DISCOUNTS_FAILED: {
            return Object.assign({}, state, {
                errors: Object.assign({}, initialState.errors, {
                    discounts: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }

        // Chat
        case GET_CHAT_OK: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    chat: null
                })
            })

            new_state.chat.pagination.load.per_page = action.data.pagination.per_page

            if (action.data.pagination.current_page > new_state.chat.pagination.load.last_loaded_page) {
                new_state.chat.pagination.load.last_loaded_page = action.data.pagination.current_page

                let new_t = Object.values(action.data.messages)
                let temp = []
                if (new_t.length > 0) {

                    new_t.forEach(list => {
                        list.forEach(message => {
                            temp.unshift(message)
                        })
                    })

                    temp.forEach(message => {
                        new_state.chat.list.push(message)
                    })


                    if (new_t.length < new_state.chat.pagination.load.per_page) {
                        new_state.chat.pagination.load.more_available = false
                    }
                } else {
                    // no more available
                    new_state.chat.pagination.load.more_available = false
                }
            }


            return new_state
        }
        case GET_CHAT_FAILED:
        case SEND_MSG_FAILED: {
            return Object.assign({}, state, {
                errors: Object.assign({}, initialState.errors, {
                    chat: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case SEND_MSG_OK: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    chat: null
                })
            })

            new_state.chat.list.unshift(action.data.message)

            return new_state
        }
        case SWITCH_CHAT_PAGE: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    chat: null
                })
            })

            new_state.chat.pagination.view.current_page = action.data


            return new_state
        }
        case LOAD_NEW_MSG_OK: {
            let new_state = Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    chat: null
                })
            })

            let last_message = new_state.chat.list[0]
            let new_count = 0
            let all_m = Object.values(action.data.messages)
            if (all_m.length > 0) {
                let temp = []

                all_m.forEach(list => {
                    list.forEach(message => {
                        temp.unshift(message)
                    })
                })

                temp.forEach(message => {
                    if (last_message.created_at < message.created_at) {
                        new_count++
                        new_state.chat.list.unshift(message)
                    }
                })
            }

            if (new_count > 0) {
                new_state.client['unread_messages'] = new_count
            }

            return new_state
        }
        case CLEAN_UNREAD_COUNT: {
            let new_state = Object.assign({}, state)
            new_state.client.unread_messages = 0
            return new_state
        }
        case ENABLE_AUTO_UPDATE: {
            let new_state = Object.assign({}, state)

            new_state.chat.auto_update = true

            return new_state
        }

        // Card & Safe accounts management
        case BLOCK_CARD_OK:
        case UNBLOCK_CARD_OK:
        case REISSUE_CARD_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.client.accounts.map(card => {
                if (card.token == action.card_token) {
                    switch (action.type) {
                        case BLOCK_CARD_OK: {
                            card.status = "blocked"
                            break;
                        }
                        case UNBLOCK_CARD_OK: {
                            card.status = "active"
                            break;
                        }
                        case REISSUE_CARD_OK: {
                            card.reissue = action.data.reissue
                            break;
                        }
                    }
                }
                return card
            })

            return ns
            break;
        }
        case CLOSE_SAFE_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    safe: null
                })
            })

            ns.client.safe_accounts = ns.client.safe_accounts.reduce((now, acc) => {
                if (acc.token != action.safe_token) {
                    now.push(acc)
                }
                return now
            }, [])

            return ns
            break;
        }
        case CHANGE_PIN_VERIFY_CARD_NUMBER_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.change_pin = {
                in_progress: true,
                ask_pin: true,
                verification_id: action.data.plastic.validation.id,
                plastic_token: action.plastic_token
            }

            return ns
            break;
        }
        case CHANGE_PIN_FINAL_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.change_pin = Object.assign({}, init.actions.card.change_pin, {
                success: true
            })

            return ns
            break;
        }
        case LOAD_CARD_LIMITS_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.limits = {
                updated: false,
                loaded: true,
                data: action.data.plastic.limits,
                plastic_token: action.plastic_token
            }

            return ns
            break;
        }
        case SET_CARD_LIMITS_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.limits = {
                updated: true,
                loaded: true,
                data: action.data.plastic.limits,
                plastic_token: action.plastic_token
            }

            return ns
            break;
        }
        case LOAD_ALL_EXTRACTS_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.extracts = Object.assign({}, init.actions.card.extracts, {
                all: action.data,
                loaded: true
            })

            return ns
            break;
        }
        case LOAD_EXTRACT_OK: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.extracts = Object.assign({}, ns.actions.card.extracts, {
                selected: {
                    loaded: true,
                    url: action.data.extract.url
                }
            })

            return ns
            break;
        }
        case RESET_EXTRACT: {
            let ns =  Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null
                })
            })

            ns.actions.card.extracts = Object.assign({}, ns.actions.card.extracts, {
                selected: init.actions.card.extracts
            })

            return ns
            break;
        }
        case UPDATE_CARD_FAILED: {
            let error_text = null
            if (action.data.response['errors']) {
                error_text = action.data.response['errors']
            } else if (action.data.response.response['description']) {
                error_text = action.data.response.response['description']
            } else {
                error_text = 'Неизвестная ошибка...'
            }

            return Object.assign({}, state, {
                errors: Object.assign({}, initialState.errors, {
                    cards: error_text
                }),
                actions: Object.assign({}, state.actions, {
                    card: Object.assign({}, init.actions.card)
                })
            })
        }
        case UPDATE_SAFE_FAILED: {
            return Object.assign({}, state, {
                errors: Object.assign({}, initialState.errors, {
                    safe: (action.data.response.response['description']) ? action.data.response.response['description'] : 'An error occurred'
                })
            })
        }
        case RESET_CARD_SAFE_ACTIONS: {
            return Object.assign({}, state, {
                errors: Object.assign({}, state.errors, {
                    cards: null,
                    safe: null
                }),
                actions: Object.assign({}, state.actions, {
                    card: Object.assign({}, init.actions.card),
                    safe: Object.assign({}, init.actions.safe)
                })
            })
        }
        default: {
            return state
        }
    }
}