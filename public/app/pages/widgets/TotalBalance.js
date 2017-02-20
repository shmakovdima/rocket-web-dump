import React from 'react'
import {
    RUB,
    USD,
    EUR
} from '../../helpers/currencies'


export default class TotalBalance extends React.Component {
    constructor(props) {
        super(props);

        this.renderTotalList = this.renderTotalList.bind(this)
    }

    renderTotalList(list = []) {
        if (list.length == 0) {
            return (<span>ничего</span>)
        }
        return list.map((item, index, arr) => {
            let divider = ', '
            if (index == arr.length - 1) {
                divider = ''
            }

            let currency_view = item.currency
            switch (currency_view) {
                case 'RUB': {
                    currency_view = RUB
                    break;
                }
                case 'USD': {
                    currency_view = USD
                    break;
                }
                case 'EUR': {
                    currency_view = EUR
                    break;
                }
            }

            return (
                <span>
                    <b>{item.amount}</b> {currency_view}{divider}
                </span>
            )
        })
    }
    render() {
        const info = this.props.client.client;


        // for cards
        let card_total_balance = {};
        info.accounts.forEach((card) => {
            if (card_total_balance[card.currency]) {
                card_total_balance[card.currency] += card.balance
            } else {
                card_total_balance[card.currency] = card.balance
            }
        })
        let card_total_balance_list = []
        for (let cur in card_total_balance) {
            if (card_total_balance[cur] > 0) {
                card_total_balance_list.push({
                    amount: card_total_balance[cur],
                    currency: cur
                })
            }
        }

        // for safe accounts
        let safe_total_balance = {};
        info.safe_accounts.forEach((card) => {
            if (safe_total_balance[card.currency]) {
                safe_total_balance[card.currency] += card.balance
            } else {
                safe_total_balance[card.currency] = card.balance
            }
        })
        let safe_total_balance_list = []
        for (let cur in safe_total_balance) {
            if (safe_total_balance[cur] > 0) {
                safe_total_balance_list.push({
                    amount: safe_total_balance[cur],
                    currency: cur
                })
            }
        }

        return(
            <div className="panel panel-default">
                <ul className="list-group">
                    {
                        (info['accounts'] && info['accounts'].length > 0) ? (
                            <li className="list-group-item" key="balance-cards">
                                На картах: {this.renderTotalList(card_total_balance_list)}
                            </li>
                        ) : null
                    }
                    {
                        (info['safe_accounts'] && info['safe_accounts'].length > 0) ? (
                            <li className="list-group-item" key="balance-safe">
                                На safe-счетах: {this.renderTotalList(safe_total_balance_list)}
                            </li>
                        ) : null
                    }
                </ul>
            </div>
        )
    }
}