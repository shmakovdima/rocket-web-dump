import React from 'react'


export default class LastTransfers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const info = this.props.client.client;

        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Последние переводы</h3>
                </div>
                <ul className="list-group">
                    {
                        (info['transfers'] && info['transfers'].length > 0) ? (info['transfers'].map((item) => {
                            return (<li className="list-group-item">
                                {item.first_name} {item.last_name} <b>-{item.amount}</b> RUB
                            </li>)
                        })) : (
                            <li className="list-group-item">Нет переводов</li>
                        )
                    }
                </ul>
            </div>
        )
    }
}