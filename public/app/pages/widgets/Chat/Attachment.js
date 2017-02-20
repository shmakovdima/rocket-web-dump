import React from 'react'
import {
    get_currency_letter
} from '../../../helpers/currencies'


export default class Attachment extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const a = this.props.data
        const is_admin = this.props.is_admin || false

        let styles = {
            sticker: null
        }

        if (is_admin === false) {
            styles.sticker = {
                float: 'right'
            }
        }

        console.info('Chat attachment', a)
        switch (a.type) {
            case 'rating': {
                return (
                    <p className="message__text">
                        {a.text}
                        <br/>
                        <span className="text-danger">Оценка поддержки пока не доступна</span>
                    </p>
                )
                break;
            }
            case 'operation': {
                const o = a.operation
                return (
                    <p className="message__text chat-attachment-operation">
                        <b>{o.details}</b>
                        <br/>
                        {o.display_money.formatted_exact}
                        <br/>
                        {
                            (o.mimimiles > 0) ? (
                                <span>+{o.mimimiles} рр.</span>
                            ) : null
                        }
                        {
                            (o.mimimiles < 0) ? (
                                <span>{o.mimimiles} рр.</span>
                            ) : null
                        }
                    </p>
                )
                break;
            }
            case 'sticker': {
                const s = a.sticker
                return (
                    <div>
                        <img src={s.url} height={s.height} width={s.width} className="chat-attachment-sticker" style={styles.sticker}/>
                    </div>
                )
                break;
            }
            case 'image':
            default: {
                return null
                break;
            }
        }
    }
}