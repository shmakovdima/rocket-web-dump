import React from 'react'
import {
    get_currency_letter
} from './../../../helpers/currencies'

export default class Requisites extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const acc = this.props.account
        const ad = acc.account_details

        let final_view = null

        if (acc.currency == "RUB") {
            final_view = (
                <div>
                    <b>Банк</b><br/> {ad.bank_name} <br/>
                    <b>Корреспондентский счет</b><br/> {ad.ks} <br/>
                    <b>Номер счета</b><br/> {ad.account} <br/>
                    <b>Получатель</b><br/> {ad.owner} <br/>
                    <b>Назначение платежа</b><br/> {ad.goal} <br/>
                    <b>ИНН</b><br/> {ad.inn} <br/>
                    <b>КПП</b><br/> {ad.kpp}
                </div>
            )
        } else {
            final_view = (
                <div>
                    <b>Банк корреспондент</b><br/> {ad.corr} (SWIFT: {ad.corr_swift}) <br/>
                    <b>Банк получателя</b><br/> {ad.benef_bank} <br/>
                    <b>Адрес банка получателя</b><br/> {ad.benef_bank_address} <br/>
                    <b>SWIFT</b><br/> {ad.benef_swift} <br/>
                    <b>Получатель</b><br/> {ad.owner} <br/>
                    <b>Номер счета</b><br/> {ad.account}
                </div>
            )
        }

        return (<div>
            <div className="page-header">
                <h1>
                    Реквизиты
                </h1>
            </div>
            {final_view}
        </div>)
    }
}