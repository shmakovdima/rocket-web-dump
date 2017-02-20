import React from 'react'
import {
    get_pretty_datetime
} from '../../../helpers/datetime'
import Attachment from './Attachment'

export default class Message extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const m = this.props.message
        const client = this.props.client

        let styles = {
            profile_photo: {
                maxWidth: '25px',
                width: '25px'
            },
        }



        let view = null
        if (m.admin == true) {
            view = (
                <li className="chat-item chat-item--me" key={m.id}>
                    <img src={m.avatar} alt={m.author} draggable="false" className="chat-item-avatar" />
                    <div className="message">
                        <span className="message__user-name">{m.author} </span>
                        <time className="message__time">
                            <i className="glyphicon glyphicon-time"/>
                            {get_pretty_datetime(m.created_at)}
                        </time>
                        {
                            (m['body'] && m['body'].length > 0) ? (
                                <p className="message__text">{m.body}</p>
                            ): null
                        }
                        {
                            m.attachments.map(att => {
                                return <Attachment is_admin={true} data={att}/>
                            })
                        }
                    </div>
                </li>
            )
        } else {
            view = (
                <li className="chat-item chat-item--other" key={m.id}>
                    <div className="message">
                        <span className="message__user-name">Вы </span>
                        <time className="message__time">
                            <i className="glyphicon glyphicon-time"/>
                            {get_pretty_datetime(m.created_at)}
                        </time>
                        <p className="message__text">{m.body}</p>
                        {
                            m.attachments.map(att => {
                                return <Attachment is_admin={false} data={att}/>
                            })
                        }
                    </div>
                    <img src={client.client['userpic_url']} alt={m.author} draggable="false" className="chat-item-avatar"/>
                </li>
            )
        }
        return view
    }
}