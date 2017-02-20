import React from 'react'
import {Link} from 'react-router'

export default class MainInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const info = this.props.client.client;

        let styles = {
            profile_photo: {
                maxWidth: '50px'
            },
            full_name: {
                paddingTop: '6%'
            }
        }
        return(
            <div className="panel panel-default">
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="media">
                            <div className="media-left">
                                <img className="media-object img-circle" src={info['userpic_url']} style={styles.profile_photo} alt="Фотография"/>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading" style={styles.full_name}>{info['last_name']} {info['first_name']} {info['second_name']}</h4>
                            </div>
                        </div>
                    </li>
                    {
                        (info['unread_messages'] && info['unread_messages'] > 0) ? (
                            <li className="list-group-item">
                                <Link to="support">
                                    <span className="glyphicon glyphicon-envelope"/> <span className="text-primary">Есть новые сообщения от поддержки</span>
                                </Link>
                            </li>
                        ) : null
                    }
                    <li className="list-group-item">
                        <span className="glyphicon glyphicon-piggy-bank"/> <b>{info['miles']}</b> рокетрублей
                    </li>
                    {
                        (info['invites']['friends'] > 0) ? (
                            <li className="list-group-item">
                                <span className="glyphicon glyphicon-heart-empty"/> Друзей в рокетбанке: <b>{info['invites']['friends']}</b>
                            </li>
                        ) : null
                    }
                </ul>
            </div>
        )
    }
}