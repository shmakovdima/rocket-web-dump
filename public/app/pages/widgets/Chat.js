import React from 'react'
import Message from './Chat/Message'
import {
    get_chat,
    switch_page,
    send_message,
    pull_new_messages,
    enable_auto_update,
    clear_unread_count
} from '../../actions/chat'
import {
    get_currency_letter
} from '../../helpers/currencies'

import {connect} from 'react-redux'

@connect((store) => {
    return {};
})


export default class Chat extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            message: ''
        }

        this.openNextPage = this.openNextPage.bind(this)
        this.openPrevPage = this.openPrevPage.bind(this)
        this.openPage = this.openPage.bind(this)
        this.getChatPage = this.getChatPage.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.changeInput = this.changeInput.bind(this)
        this.checkForNewMessages = this.checkForNewMessages.bind(this)

        const self = this
        const chat = this.props.client.chat
        const client = this.props.client
        const session_token = client.tokens.session

        new Promise((resolve, reject) => {
            resolve()
        })
            .then(() => {
                if (chat.pagination.load.last_loaded_page == 0) {
                    self.props.dispatch(get_chat(session_token, chat.pagination.load.last_loaded_page + 1))
                }
            })
            .then(() => {
                if (chat.auto_update === false) {
                    this.checkForNewMessages()
                }
            })
    }


    checkForNewMessages() {

        const self = this
        const client = this.props.client
        const session_token = client.tokens.session


        setTimeout(() => {
            console.log('checkForNewMessages', client)
            if (client.isAuthenticated === false) {
                return
            }
            new Promise((resolve, reject) => {
                if (client.isAuthenticated === true) {
                    resolve()
                } else {
                    reject()
                }
            })
                .then(() => {
                    if (client.chat.auto_update == false && client.isAuthenticated === true) {
                        console.log('Chat > Enable auto pull')
                        self.props.dispatch(enable_auto_update())
                    }
                })
                .then(() => {
                    if (client.isAuthenticated === true) {
                        self.props.dispatch(pull_new_messages(session_token))
                    }
                })
                .then(() => {
                    if (client.isAuthenticated === true) {
                        self.checkForNewMessages()
                    }
                })
        }, 5000)
    }
    componentWillMount() {
        const client = this.props.client.client
        if (client['unread_messages'] > 0) {
            this.props.dispatch(clear_unread_count())
        }
    }
    componentWillUnmount() {
        const client = this.props.client.client
        if (client['unread_messages'] > 0) {
            this.props.dispatch(clear_unread_count())
        }

    }
    openNextPage() {
        const chat = this.props.client.chat
        this.openPage(chat.pagination.view.current_page + 1)
    }
    openPrevPage() {
        const chat = this.props.client.chat
        this.openPage(chat.pagination.view.current_page - 1)
    }
    openPage(number) {
        const chat = this.props.client.chat
        const client = this.props.client
        const session_token = client.tokens.session

        let items_in_page = this.getChatPage(number)
        if (items_in_page && items_in_page.length < chat.pagination.view.per_page) {
            this.props.dispatch(get_chat(session_token, chat.pagination.load.last_loaded_page + 1))
        }

        this.props.dispatch(switch_page(number))
    }
    getChatPage(number) {
        const chat = this.props.client.chat
        let list = chat.list.slice((number - 1) * chat.pagination.view.per_page, number * chat.pagination.view.per_page)
        return list.reverse()
    }

    changeInput(e) {
        switch (e.target.name) {
            case 'message': {
                this.setState({[e.target.name]: e.target.value})
                break;
            }
        }
    }
    onSubmit(e) {
        e.preventDefault();
        const client = this.props.client
        const session_token = client.tokens.session
        this.props.dispatch(send_message(session_token, this.state.message))
        this.setState({'message': ''})
        this.refs.message.value = ''
    }
    render() {
        const widget_options = this.props['options']
        const client = this.props.client
        const chat = this.props.client.chat
        const error = this.props.client.errors.chat


        let alert = <div></div>
        if (error) {
            alert = (
                <div className="alert alert-danger">
                    {error}
                </div>
            )
        }

        let styles = {
            profile_photo: {
                maxWidth: '25px',
                width: '25px'
            },
        }
        return(
            <div>
                <div className="page-header">
                    <h1>
                        Чат с поддержкой
                    </h1>
                </div>
                {alert}
                <div className="panel panel-default">
                    <div className="panel-body chat">
                    {
                        (this.getChatPage(chat.pagination.view.current_page).length > 0) ? (
                            <ul className="chat-history">
                                {
                                    this.getChatPage(chat.pagination.view.current_page).map(function (m) {
                                        return <Message message={m} client={client}/>
                                    })
                                }
                            </ul>
                        ) : (
                            <div className="panel-body">
                                Подгружаем...
                            </div>
                        )
                    }
                    </div>
                    <div className="chat-controls">
                        <form onSubmit={this.onSubmit}>
                            <textarea className="chat-controls__textarea" rows="2" ref="message" name="message" onChange={this.changeInput} placeholder="Введите сообщение"/>
                            <div className="row">
                                <div className="col-xs-12">
                                    <button className="btn btn-block btn-primary">Отправить</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {
                        (chat.list.length > 0) ? (
                            <div className="panel-body">
                                <div className="row">

                                    <div className="col-xs-6">
                                        {
                                            (chat.pagination.load.more_available) ? (
                                                <button className="btn btn-block btn-warning btn-sm" onClick={this.openNextPage}>&lt; старое </button>
                                            ) : null
                                        }
                                    </div>
                                    <div className="col-xs-6">
                                        {
                                            chat.pagination.view.current_page > 1 ? (
                                                <button className="btn btn-block btn-warning btn-sm" onClick={this.openPrevPage}>новое &gt;</button>
                                            ) : null
                                        }
                                    </div>
                                </div>

                            </div>
                        ) : null
                    }



                </div>
            </div>
        )
    }
}