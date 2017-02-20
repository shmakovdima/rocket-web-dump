import React from 'react'
import {connect} from 'react-redux'

import MainInfo from './widgets/MainInfo'
import TotalBalance from './widgets/TotalBalance'
import LastTransfers from './widgets/LastTransfers'
import Transactions from './widgets/Transactions'
import Cards from './widgets/Cards'
import SafeAccounts from './widgets/SafeAccounts'

@connect((store) => {
    return {
        client: store.reducer.client
    };
})

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const client = this.props.client;

        if (client.isAuthenticated === false) {
            return (<div className="alert alert-danger">Не авторизован</div>);
        }

        let widget_options = {
            transactions: {
                showDatetime: true
            }
        }

        return(
            <div className="row">
                <div className="col-sm-12 col-md-4">
                    <MainInfo client={client}/>
                    <TotalBalance client={client}/>
                    <Cards client={client}/>
                    <SafeAccounts client={client}/>
                </div>
                <div className="col-sm-12 col-md-8">
                    <Transactions client={client} options={widget_options.transactions}/>

                </div>
            </div>
        )
    }
}