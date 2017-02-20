import React from 'react'
import {connect} from 'react-redux'
import {
    get_currency_letter
} from '../../helpers/currencies'
import {
    block_card,
    unblock_card,
    reissue_card,
    verify_card_number,
    set_pin_code,
    close_safe,
    reset
} from '../../actions/accounts'
import Requisites from './for_info/Requisites'
import Limits from './for_info/Limits'
import Restrictions from './for_info/Restrictions'
import Extracts from './for_info/Extracts'
import Alerts from './for_info/Alerts'

@connect((store) => {
    return {};
})

export default class Info extends React.Component {
    constructor(props) {
        super(props);

        this.get_default_state = this.get_default_state.bind(this)
        this.toggle_selected = this.toggle_selected.bind(this)
        this.toggle_view = this.toggle_view.bind(this)
        this.toggle_account_status = this.toggle_account_status.bind(this)
        this.close_safe_account = this.close_safe_account.bind(this)
        this.change_pin = this.change_pin.bind(this)
        this.ask_for_new_pin = this.ask_for_new_pin.bind(this)

        this.switch_mode = this.switch_mode.bind(this)

        this.state = this.get_default_state()

        console.log('Info > constructor')
    }
    componentWillMount() {
        console.log('Info > componentWillMount')
    }
    componentWillUpdate() {
        console.log('Info > componentWillUpdate')
    }
    componentWillUnmount() {
        console.log('Info > componentWillUnmount')
    }
    componentDidUpdate() {
        console.log('componentDidUpdate', this)

        const client = this.props.client
        switch (this.state.mode) {
            case 'change_pin': {
                const cp = client.actions.card.change_pin // change pin state

                if (cp.in_progress == true) {
                    if (cp.ask_pin == true) {
                        this.ask_for_new_pin()
                    }
                }
                break
            }
        }
    }
    get_default_state() {
        return {
            selected_id: null,
            display: {
                account_details: false,
                limits: false,
                card_limits: false
            },
            mode: "default", // or: change pin
            actions: {
                card: {
                    ask_pin: false
                }
            }
        }
    }
    switch_mode(new_mode = 'default') {
        this.props.dispatch(reset())
        this.setState(Object.assign({}, this.state, {
            mode: new_mode,
            display: this.get_default_state().display
        }))
    }
    toggle_selected(id = null) {
        if (this.state.selected_id != id) {
            this.switch_mode()
            this.setState(Object.assign({}, this.get_default_state(),{
                selected_id: id
            }))
        }
    }
    toggle_view(e) {
        switch (e.target.name) {
            case 'account_details':
            case 'limits': {
                this.setState(
                    Object.assign({}, this.get_default_state(), {
                        selected_id: this.state.selected_id
                    }, {
                        display: {
                            [e.target.name]: !(this.state.display[e.target.name])
                        }
                    })
                )
                break;
            }
        }
        console.log('toggle_view', e.target.name, this.state)
    }
    toggle_account_status(acc, set_blocked) {
        const client = this.props.client
        const session_token = client.tokens.session

        let block_text = "При блокировке недоступна оплата в интернете, в магазинах и через Apple Pay.\n\n" +
            "Вы подтверждаете блокировку карты " + acc.pan + "?"

        let unblock_text = "Ваша карта будет снова активна.\n\n" +
            "Вы подтверждаете разблокировку карты " + acc.pan + "?"

        if (set_blocked === true) {
            if (confirm(block_text)) {
                // do block
                this.props.dispatch(block_card(session_token, acc.token))
            }
        } else {
            if (confirm(unblock_text)) {
                // do unblock
                this.props.dispatch(unblock_card(session_token, acc.token))
            }
        }
    }
    close_safe_account(acc) {
        const client = this.props.client
        const session_token = client.tokens.session

        let close_text = acc.close_text + "\n\n" +
            "Вы подтверждаете закрытие счета " + acc.title + "?"

        if (confirm(close_text)) {
            // do block
            this.props.dispatch(close_safe(session_token, acc.token))
        }
    }
    change_pin(acc) {
        console.log('change pin requested', acc)
        const client = this.props.client
        const session_token = client.tokens.session

        let card_number = prompt("Введите номер карты", acc.pan)
        if (card_number && (typeof card_number == "string")) {
            if (card_number.length == 16) {
                this.props.dispatch(verify_card_number(session_token, acc.plastic_token, card_number))
                this.switch_mode('change_pin')
            } else {
                alert('Неверный формат номера карты')
            }
        }
    }
    ask_for_new_pin() {
        const client = this.props.client
        const session_token = client.tokens.session
        const cp = client.actions.card.change_pin // change pin state

        let new_pin = prompt("Номер карты верный.\n\n" +
            "Введите новый пин", '')
        if (new_pin.length == 4) {
            this.props.dispatch(set_pin_code(session_token, cp.plastic_token, cp.verification_id, new_pin))
            this.switch_mode()
        } else {
            this.ask_for_new_pin()
        }
    }
    reissue_card(acc) {
        const client = this.props.client
        const session_token = client.tokens.session

        if (confirm(acc.reissue.price_text)) {
            // do block
            this.props.dispatch(reissue_card(session_token, acc.token))
        }
    }

    render() {
        const errors = this.props.client.errors;
        const info = this.props.client.client;
        const watch = this.props.subject

        if (watch['type'] != 'watch') {
            return null
        }

        const account_number = watch.id
        this.toggle_selected(account_number)

        let acc = null

        // watch for cards
        info.accounts.forEach(item => {
            const account = item.account_details
            if (account.account == account_number) {
                acc = {
                    type: 'card',
                    data: item
                }
            }
        })
        // watch for safe
        info.safe_accounts.forEach(item => {
            const account = item.account_details
            if (account.account == account_number) {
                acc = {
                    type: 'safe',
                    data: item
                }
            }
        })

        console.log('found', acc)

        if (acc == null) {
            return null
        }


        let styles = {
            sms: {
                paid_to: {
                    'opacity': 0.6
                }
            }
        }

        if (acc.type == 'card') {
            const c = acc.data

            let options = {
                sms: {
                    active: false
                }
            }
            c.current_tariff.options.forEach(opt => {
                switch (opt['permalink']) {
                    case 'sms_notification': {
                        options['sms'] = Object.assign({}, opt)
                        if (opt['paid_to'] > 0){
                            let paid_to = new Date()
                            paid_to.setTime(opt['paid_to'] * 1000)

                            options.sms['paid_to_formatted'] = paid_to.getDate() + '.'
                                + (paid_to.getMonth() + 1) + '.'
                                + paid_to.getFullYear()
                        }
                        break
                    }
                }
            })


            return(
                <div>
                    <div className="row">
                        <Alerts client={this.props.client}/>
                        <div className="col-sm-12 col-md-8">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">{c.title}</h3>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item"><b>{c.pan}</b> (до {c.month}/{c.year})</li>
                                    <li className="list-group-item">
                                        Баланс: <b>{c.balance} {get_currency_letter(c.currency)}</b>
                                    </li>
                                </ul>
                            </div>
                            <div className="panel panel-default">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        Тариф <b><a href={c.current_tariff.url} target="_blank">{c.current_tariff.name}</a></b>
                                    </li>
                                    <li className="list-group-item">
                                        {
                                            (c.unlimited_cashouts === true) ? (
                                                <span>{c.free_cash_out_limit_text}</span>
                                            ) : (
                                                <span>
                                                    Доступно бесплатных снятий: <b>{(c.free_cash_out_limit - c.cash_out_count)}</b>
                                                </span>
                                            )
                                        }
                                    </li>
                                    <li className="list-group-item">
                                        Уведомления {
                                        (options.sms.active === true) ? (
                                            <b>SMS</b>
                                        ) : (
                                            <b>Push</b>
                                        )
                                    }
                                        {
                                            (options.sms['paid_to_formatted']) ? (
                                                <span style={styles.sms.paid_to}> (оплачено до {options.sms['paid_to_formatted']})</span>
                                            ) : null
                                        }
                                    </li>
                                    {
                                        (c.reissue.status != "none") ? (
                                            <li className="list-group-item">
                                                <span>Перевыпуск: </span>
                                                <b>
                                                    {
                                                        (c.reissue.status == "in_progress") ? (
                                                            <span>карта выпускается</span>
                                                        ) : null
                                                    }
                                                    {
                                                        (c.reissue.status == "delivery") ? (
                                                            <span>готово, согласуем доставку в чате</span>
                                                        ) : null
                                                    }
                                                    {
                                                        (c.reissue.status == "scheduled") ? (
                                                            <span>доставка согласована</span>
                                                        ) : null
                                                    }

                                                </b>
                                            </li>
                                        ) : null
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <button name="account_details" onClick={this.toggle_view} className="btn btn-block btn-primary">Реквизиты</button>
                                    <button name="limits" onClick={this.toggle_view} className="btn btn-block btn-primary">О лимитах</button>
                                    <button onClick={() => { this.switch_mode('watch_extracts') }} className="btn btn-block btn-primary">Справки</button>
                                    <button onClick={() => { this.change_pin(c) }} className="btn btn-block btn-primary">Сменить пин</button>
                                    <button onClick={() => { this.switch_mode('change_limits') }} className="btn btn-block btn-primary">Ограничения</button>
                                    {
                                        (c.reissue.status == 'none') ? (
                                            <button onClick={() => { this.reissue_card(c) }} className="btn btn-block btn-primary">Перевыпуск</button>
                                        ) : (
                                            <button disabled="disabled" className="btn btn-block btn-primary">Перевыпуск</button>
                                        )
                                    }
                                    {
                                        (c.status == 'active') ? (
                                            <button onClick={() => { this.toggle_account_status(c, true) }} className="btn btn-block btn-danger">Заблокировать</button>
                                        ) : null
                                    }
                                    {
                                        (c.status == 'blocked') ? (
                                            <button onClick={() => { this.toggle_account_status(c, false) }} className="btn btn-block btn-success">Разблокировать</button>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        (this.state.display.account_details === true) ? (<Requisites account={acc.data}/>) : null
                    }
                    {
                        (this.state.display.limits === true) ? (<Limits account={acc.data}/>) : null
                    }
                    {
                        (this.state.mode == 'change_limits') ? (<Restrictions account={acc.data} client={this.props.client}/>) : null
                    }
                    {
                        (this.state.mode == 'watch_extracts') ? (<Extracts account={acc.data} client={this.props.client}/>) : null
                    }
                </div>
            )
        } else if (acc.type == 'safe') {
            const s = acc.data
            if (!s) {
                return null
            }
            return(
                <div>
                    <div className="row">
                        <Alerts client={this.props.client}/>
                        <div className="col-sm-12 col-md-8">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">{s.title}</h3>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        Баланс: <b>{s.balance} {get_currency_letter(s.currency)}</b>
                                    </li>
                                    <li className="list-group-item">
                                        <a href={s.url} target="_blank">Условия обслуживания счета</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <button name="account_details" onClick={this.toggle_view} className="btn btn-block btn-primary">Реквизиты</button>
                                    {
                                        (s.status == 'active') ? (
                                            <button onClick={() => { this.close_safe_account(s) }} className="btn btn-block btn-danger">Закрыть счет</button>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        (this.state.display.account_details === true) ? (<Requisites account={acc.data}/>) : null
                    }
                </div>
            )
        }


    }
}