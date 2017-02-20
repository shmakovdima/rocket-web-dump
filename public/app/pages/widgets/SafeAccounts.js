import React from 'react'
import {Link} from 'react-router'
import {
    get_currency_letter
} from '../../helpers/currencies'

export default class SafeAccounts extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const info = this.props.client.client;
        if (!info['safe_accounts'] || info['safe_accounts'].length == 0) {
            return null
        }
        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Safe-счета</h3>
                </div>
                <ul className="list-group">
                    {
                        info.safe_accounts.map(acc => {
                            return (
                                <li className="list-group-item">
                                    <Link to={'cards/' + acc.account_details.account}>{acc.title}</Link>
                                    <br/>
                                    {
                                        (acc.status == 'blocked') ? (
                                            <span>
                                                <b>Счет заблокирован</b>
                                                <br/>
                                            </span>
                                        ) : null
                                    }
                                    Баланс: <b>{acc.balance}</b> {get_currency_letter(acc.currency)}<br/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}