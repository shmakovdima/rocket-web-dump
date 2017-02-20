import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {log_out} from '../../actions/client'


@connect((store) => {
    return {
        client: store.reducer.client
    };
})



export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }
    onLogoutClick(e) {
        // console.info('Header onLogoutClick', this);
        this.props.dispatch(log_out('You are logged out'));
        this.props.router.push('login');
    }

    render() {
        const client = this.props.client;
        const info = this.props.client.client;

        let rocketbank_logo = 'data:image/png;base64,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'

        let styles = {
            rocket_logo: {
                maxWidth: '19px'
            },
            nav: {
                marginTop: '25px'
            }
        }
        return(
            <nav className="navbar navbar-inverse" style={styles.nav}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand">
                            <img alt="Рокетбанк" style={styles.rocket_logo} src={rocketbank_logo}/>
                        </Link>
                        <Link to="/" className="navbar-brand">
                            Рокетбанк
                        </Link>
                    </div>
                    <div className="collapse navbar-collapse">
                        {
                            !(client.isAuthenticated) ? (
                                <div>
                                    <ul className="nav navbar-nav">
                                        <li>
                                            <a href="http://rocketbank.ru/loves/lol" target="_blank">Открыть карту Рокетбанка <span className="label label-danger">+500 рокетрублей</span></a>
                                        </li>
                                    </ul>
                                    <Link to="login" className="btn btn-default navbar-btn navbar-right">Войти</Link>
                                </div>
                            ) : (
                                <div>
                                    <ul className="nav navbar-nav">
                                        <li><Link to="cards" activeClassName="active">Карты, счета</Link></li>
                                        <li><Link to="support" activeClassName="active">Поддержка {
                                            (info['unread_messages'] && info['unread_messages'] > 0) ? (
                                                <span className="label label-success">{info['unread_messages']}</span>
                                            ) : null
                                        }</Link></li>
                                        <li><Link to="discounts" activeClassName="active">Скидки</Link></li>
                                    </ul>
                                    <Link to="profile" className="btn btn-default navbar-btn navbar-right">Кабинет</Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </nav>
        )
    }
}