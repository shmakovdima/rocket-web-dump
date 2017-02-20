import React from 'react'
import {
    get_currency_letter
} from './../../../helpers/currencies'

export default class Limits extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const acc = this.props.account
        const limits = acc.better_limits
        return (
            <div>
                <div className="page-header">
                    <h1>
                        Лимиты
                    </h1>
                </div>
                <div>
                    {
                        limits.map(category => {
                            let name = category[0]
                            let data = category[1]
                            return (
                                <span>
                                <h4>{name}</h4>
                                    {
                                        data.map(item => {
                                            return (
                                                <span>
                                                {item[0]}: <b>{item[1]}</b><br/>
                                            </span>
                                            )
                                        })
                                    }
                            </span>
                            )
                        })
                    }
                </div>
            </div>
        )

    }
}