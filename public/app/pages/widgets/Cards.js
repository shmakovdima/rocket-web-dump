import React from 'react'
import {
    get_currency_letter
} from '../../helpers/currencies'
import {Link} from 'react-router'

export default class Cards extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const info = this.props.client.client;
        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Карты</h3>
                </div>
                <ul className="list-group">
                    {
                        info.accounts.map(card => {
                            let card_class = 'list-group-item'
                            if (card.status == 'blocked') {
                                card_class = card_class + ' list-group-item-danger'
                            }
                            return (
                                <li className={card_class} key={card.token}>
                                    <Link to={'cards/' + card.account_details.account}>
                                        <b>{card.pan}</b> (до {card.month}/{card.year})
                                    </Link>
                                    <br/>
                                    {
                                        (card.status == 'blocked') ? (
                                            <span>
                                                <b>Карта заблокирована</b>
                                                <br/>
                                            </span>
                                        ) : null
                                    }
                                    Баланс: <b>{card.balance} {get_currency_letter(card.currency)}</b>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}