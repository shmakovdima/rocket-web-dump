import React from 'react'
import {connect} from 'react-redux'


import Cards from './widgets/Cards'
import SafeAccounts from './widgets/SafeAccounts'
import Info from './for_accounts/Info'

@connect((store) => {
    return {
        client: store.reducer.client
    };
})

export default class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.getWatchMode = this.getWatchMode.bind(this)

    }
    getWatchMode() {
        const path = this.props.route.path
        switch (path) {
            case 'cards': {
                return {
                    watch: {
                        type: 'all',
                        id: null
                    }
                }
                break
            }
            case 'cards(/:account_number)': {
                return {
                    watch: {
                        type: 'watch',
                        id: this.props.routeParams['account_number']
                    }
                }
                break
            }
        }
    }
    render() {
        const client = this.props.client;
        const watchType = this.getWatchMode()
        return(
            <div className="row">
                <div className="col-sm-12 col-md-3">
                    <Cards client={client}/>
                    <SafeAccounts client={client}/>
                </div>
                <div className="col-sm-12 col-md-9">
                    <Info client={client} subject={watchType.watch} />
                </div>
            </div>
        )
    }
}