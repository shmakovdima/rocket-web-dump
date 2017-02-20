import React from 'react'
import {
    get_transactions,
    switch_page
} from '../../actions/transactions'
import {
    get_currency_letter
} from '../../helpers/currencies'
import {
    get_pretty_datetime
} from '../../helpers/datetime'
import {connect} from 'react-redux'

@connect((store) => {
    return {};
})


export default class Transactions extends React.Component {
    constructor(props) {
        super(props)

        this.openNextPage = this.openNextPage.bind(this)
        this.openPrevPage = this.openPrevPage.bind(this)
        this.openPage = this.openPage.bind(this)
        this.getTransactionsByPage = this.getTransactionsByPage.bind(this)

    }

    componentWillMount() {
        const transactions = this.props.client.transactions
        const client = this.props.client
        const session_token = client.tokens.session

        if (transactions.last_loaded_page == 0) {
            this.props.dispatch(get_transactions(session_token, transactions.last_loaded_page + 1))
        }
    }

    openNextPage() {
        const transactions = this.props.client.transactions
        this.openPage(transactions.current_page + 1)
    }
    openPrevPage() {
        const transactions = this.props.client.transactions
        this.openPage(transactions.current_page - 1)
    }
    openPage(number) {
        const transactions = this.props.client.transactions
        const client = this.props.client
        const session_token = client.tokens.session


        if (!(number <= transactions.last_loaded_page) && (transactions.last_loaded_page <= number)){
            this.props.dispatch(get_transactions(session_token, transactions.last_loaded_page + 1))
        }
        this.props.dispatch(switch_page(number))

    }

    getTransactionsByPage(number) {
        const transactions = this.props.client.transactions
        return transactions.list.slice((number - 1) * transactions.per_page, number * transactions.per_page)
    }

    render() {
        const widget_options = this.props['options']
        const client = this.props.client
        const transactions = this.props.client.transactions
        const error = this.props.client.errors.transactions

        let alert = <div></div>
        if (error) {
            alert = (
                <div className="alert alert-danger">
                    {error}
                </div>
            )
        }



        let styles = {
            merchant_logo: {
                maxWidth: '25px',
                width: '25px'
            },
            transaction_text: {
                verticalAlign: 'middle'
            },
            transaction_datetime: {
                opacity: 0.5
            }
        }
        return(
            <div>
                {alert}
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Операции</h3>
                    </div>
                    {
                        (this.getTransactionsByPage(transactions.current_page).length > 0) ? (
                            <table className="table table-hover">
                                <tbody>
                                {
                                    this.getTransactionsByPage(transactions.current_page).map(function (t) {
                                        let t_type = t[0]
                                        let t_data = t[1]

                                        let row = null

                                        switch (t_type) {
                                            case 'operation': {

                                                let transaction_image = null
                                                switch (t_data.context_type) {
                                                    case 'internal_cash_in':
                                                    case 'internal_cash_out':
                                                    case 'internal_cash_in_request':
                                                    case 'internal_cash_out_request': {
                                                        transaction_image = t_data.friend['userpic_url']
                                                        break
                                                    }
                                                    case 'card2card_cash_out':
                                                    case 'card2card_cash_in': {
                                                        transaction_image = t_data.linked_card['feed_icon_url']
                                                        break
                                                    }
                                                    case 'pos_spending':
                                                    case 'commission':
                                                    case 'transfer_cash_in':
                                                    case 'atm_cash_out':
                                                    case 'miles_cash_back':
                                                    default: {
                                                        if (t_data['merchant']) {
                                                            transaction_image = t_data.merchant['feed_icon']
                                                        }
                                                        break
                                                    }
                                                }

                                                let datetime_view = get_pretty_datetime(t_data.happened_at)

                                                let display_datetime = true
                                                if (widget_options && widget_options['showDatetime'] === false) {
                                                    display_datetime = false;
                                                }

                                                row = (
                                                    <tr key={t_data.id}>
                                                        <td style={styles.transaction_text}>
                                                            {
                                                                (t_data['merchant']) ? (
                                                                    <img className="img-circle" src={transaction_image} style={styles.merchant_logo}/>
                                                                ) : null
                                                            }
                                                        </td>
                                                        <td style={styles.transaction_text}>{t_data.merchant.name}</td>
                                                        <td style={styles.transaction_text}><b>{t_data.money.amount}</b> {get_currency_letter(t_data.money.currency_code)}</td>
                                                        <td style={styles.transaction_text}>
                                                            {
                                                                (t_data.mimimiles > 0) ? (
                                                                    <span>+{t_data.mimimiles} рр.</span>
                                                                ) : null
                                                            }
                                                            {
                                                                (t_data.mimimiles < 0) ? (
                                                                    <span>{t_data.mimimiles} рр.</span>
                                                                ) : null
                                                            }
                                                        </td>
                                                        {
                                                            (display_datetime) ? (
                                                                <td style={styles.transaction_text}>
                                                                    <span style={styles.transaction_datetime}>
                                                                        {datetime_view}
                                                                    </span>
                                                                </td>
                                                            ) : null
                                                        }
                                                        <td style={styles.transaction_text}>
                                                            {
                                                                (t_data.has_receipt === true) ? (
                                                                    <a href={t_data.receipt_url} target="_blank">
                                                                        <i className="glyphicon glyphicon-paperclip"/>
                                                                    </a>
                                                                ) : null
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                                break;
                                            }
                                            // applepay_push
                                            // chosen_month_cash_back
                                            // push (body)
                                            // friend (body)
                                            case 'push': {
                                                row = (
                                                    <tr key={t_data.id}>
                                                        <td/>
                                                        <td style={styles.transaction_text}>{t_data.body}</td>
                                                        <td>{
                                                            (t_data['ref']) ? (
                                                                <a href={t_data['ref']} target="_blank">{(t_data['title'] ? t_data['title'] : t_data['ref'] )}</a>
                                                            ) : null
                                                        }</td>
                                                        <td/>
                                                        <td/>
                                                        <td/>
                                                    </tr>)
                                                break;
                                            }
                                            case 'friend': {
                                                row = (
                                                    <tr key={t_data.id}>
                                                        <td>
                                                            <img className="img-circle" src={t_data.friend['userpic_url']} style={styles.merchant_logo}/>
                                                        </td>
                                                        <td style={styles.transaction_text}>{t_data.body}</td>
                                                        <td/>
                                                        <td/>
                                                        <td/>
                                                        <td/>
                                                    </tr>)
                                                break;
                                            }
                                            default: {
                                                console.log('NEW T TYPE', t_type, t_data)
                                                break
                                            }
                                        }
                                        if (t_data['visible'] == true) {
                                            return row
                                        } else {
                                            return null
                                        }
                                    })
                                }
                                </tbody>
                            </table>
                        ) : (
                            <div className="panel-body">
                                Подгружаем...
                            </div>
                        )
                    }
                    {
                        (transactions.list.length > 0) ? (
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-xs-6">
                                        {
                                            transactions.current_page > 1 ? (
                                                <button className="btn btn-block btn-primary" onClick={this.openPrevPage}>&lt; сюда</button>
                                            ) : null
                                        }
                                    </div>
                                    <div className="col-xs-6">
                                        {
                                            (transactions.more_available || (transactions.more_available == false && transactions.current_page < transactions.last_loaded_page)) ? (
                                                <button className="btn btn-block btn-primary" onClick={this.openNextPage}>туда &gt;</button>
                                            ) : null
                                        }
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div>
                            </div>
                        )
                    }


                </div>
            </div>
        )
    }
}