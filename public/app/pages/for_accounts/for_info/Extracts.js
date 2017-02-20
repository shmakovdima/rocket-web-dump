import React from 'react'
import {connect} from 'react-redux'
import {
    load_available_extracts,
    load_extract,
    reset_extract
} from '../../../actions/accounts'

@connect((store) => {
    return {};
})

export default class Extracts extends React.Component {
    constructor(props) {
        super(props);

        const client = this.props.client
        const card = this.props.account
        const session_token = client.tokens.session

        this.props.dispatch(load_available_extracts(session_token, card.token))

        this.state = {
            loading: false
        }

        this.ask_for_extract = this.ask_for_extract.bind(this)
    }
    ask_for_extract(kind = '') {
        this.setState({
            loading: true
        })
        this.props.dispatch(reset_extract())

        const client = this.props.client
        const card = this.props.account
        const session_token = client.tokens.session

        this.props.dispatch(load_extract(session_token, card.token, kind))
    }
    componentWillUpdate() {
        const client = this.props.client
        const extracts = client.actions.card.extracts

        if (extracts.selected.loaded === true && this.state.loading === true) {
            this.setState({
                loading: false
            })
        }
    }
    render() {
        const client = this.props.client
        const extracts = client.actions.card.extracts

        return (
            <div>
                <div className="page-header">
                    <h1>
                        Справки
                        {
                            (extracts.loaded === false) ? (
                                <small> Подгружаем...</small>
                            ): null
                        }
                    </h1>
                </div>
                <div className="row">
                {
                    (extracts.selected.loaded === true) ? (
                        <div className="col-sm-12">
                            <div className="alert alert-info">
                                Ваша справка готова. <b><a href={extracts.selected.url} target="_blank">Скачать</a></b>.
                            </div>
                        </div>
                    ) : null
                }
                {
                    (this.state.loading === true) ? (
                        <div className="col-sm-12">
                            <div className="alert alert-info">
                                Напрягаем бухгалтеров...
                            </div>
                        </div>
                    ) : null
                }
                </div>
                {
                    (extracts.loaded === true) ? (
                        <div className="panel panel-default">
                            <ul className="list-group">
                                {
                                    extracts.all.map(item => {
                                        return (
                                            <li className="list-group-item">
                                                <button onClick={() => this.ask_for_extract(item.kind)} className="btn btn-link">{item.title} ({item.lang})</button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    ): null
                }
            </div>
        )

    }
}