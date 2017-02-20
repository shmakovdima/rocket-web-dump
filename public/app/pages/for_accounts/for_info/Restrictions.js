import React from 'react'
import {connect} from 'react-redux'
import {
    load_card_limits,
    update_card_limits
} from '../../../actions/accounts'

@connect((store) => {
    return {};
})

export default class Restrictions extends React.Component {
    constructor(props) {
        super(props);

        const client = this.props.client
        const card = this.props.account
        const session_token = client.tokens.session

        this.props.dispatch(load_card_limits(session_token, card.plastic_token))

        this.toggle_card_restriction = this.toggle_card_restriction.bind(this)
        this.get_limit_view = this.get_limit_view.bind(this)
        this.names = {
            atm: "Снятие наличных",
            internet: "Оплата в интернете",
            pos: "Оплата в магазинах"
        }
    }
    toggle_card_restriction(name = '', new_status) {
        const client = this.props.client
        const session_token = client.tokens.session
        const limits = this.props.client.actions.card.limits

        let new_states = limits.data
        new_states[name] = new_status

        this.props.dispatch(update_card_limits(session_token, limits.plastic_token, new_states))
    }
    get_limit_view(param) {
        const self = this
        const client = this.props.client
        const limits = client.actions.card.limits

        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    {this.names[param]}:
                    <b> {
                        (limits.data[param] === true) ? (
                            <span className="text-success">включено</span>
                        ) : (
                            <span className="text-danger">отключено</span>
                        )
                    }</b>
                </div>
                <div className="panel-footer">
                    {
                        (limits.data[param] === true) ? (
                            <button onClick={() => self.toggle_card_restriction(param, false)} className="btn btn-block btn-danger">отключить</button>
                        ) : (
                            <button onClick={() => self.toggle_card_restriction(param, true)} className="btn btn-block btn-success">включить</button>
                        )
                    }
                </div>
            </div>
        )
    }
    render() {
        const acc = this.props.account
        const client = this.props.client

        const limits = client.actions.card.limits
        const self = this



        let buttons = null
        if (limits.loaded === true) {
            buttons = (
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        {this.get_limit_view('atm')}
                    </div>
                    <div className="col-sm-12 col-md-4">
                        {this.get_limit_view('internet')}
                    </div>
                    <div className="col-sm-12 col-md-4">
                        {this.get_limit_view('pos')}
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="page-header">
                    <h1>
                        Ограничения по карте
                        {
                            (limits.loaded === false) ? (
                                <small> Подгружаем...</small>
                            ): null
                        }
                    </h1>
                </div>
                {
                    (limits.loaded === true) ? buttons: null
                }
            </div>
        )

    }
}