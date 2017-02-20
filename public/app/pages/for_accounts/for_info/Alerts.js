import React from 'react'
import {
    get_currency_letter
} from './../../../helpers/currencies'

export default class Alerts extends React.Component {
    constructor(props) {
        super(props);
        this.parse_alerts = this.parse_alerts.bind(this)
    }
    parse_alerts() {
        const errors = this.props.client.errors;

        let alerts = []
        if (errors.cards) {
            alerts.push(<div className="alert alert-danger">
                {errors.cards}
            </div>)
        }
        if (errors.safe) {
            alerts.push(<div className="alert alert-danger">
                {errors.safe}
            </div>)
        }

        // check for pin success
        const client = this.props.client
        const cp = client.actions.card.change_pin // change pin state
        if (cp.success == true) {
            alerts.push(<div className="alert alert-success">
                Пин код успешно изменен
            </div>)
        }

        return alerts
    }
    render() {
        return (<div>
            {
                this.parse_alerts().map(alert => {
                    return (
                        <div className="col-sm-12">
                            {alert}
                        </div>
                    )
                })
            }
        </div>)

    }
}