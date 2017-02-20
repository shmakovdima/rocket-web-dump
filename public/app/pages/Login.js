import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import {
    register,
    verify_sms_code,
    login,
    log_out
} from '../actions/client'

@connect((store) => {
    return {
        client: store.reducer.client
    };
})

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isNew: !(cookie.load('rocket_login') && cookie.load('rocket_login').length > 0),
            phone: '',
            sms_code: '',
            app_code: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.logout = this.logout.bind(this);
    }
    changeInput(e) {
        switch (e.target.name) {
            case 'phone':
            case 'sms_code':
            case 'app_code': {
                this.setState({[e.target.name]: e.target.value})
                break;
            }
        }
    }
    onSubmit(e) {
        e.preventDefault();
        const isNew = this.state.isNew
        const reg = this.props.client.register

        if (isNew) {
            switch (reg.stage) {
                case 'enter_phone': {
                    this.props.dispatch(register(this.state.phone))
                    break;
                }
                case 'enter_sms_code': {
                    this.props.dispatch(verify_sms_code(reg.sms_verification, this.state.sms_code))
                    break;
                }
            }
        } else {
            let username = decodeURIComponent(cookie.load('rocket_login'))
            this.props.dispatch(login(username, this.state.app_code))
        }
    }
    logout(e) {
        e.preventDefault();
        this.props.dispatch(log_out())
        this.props.router.push('');
    }
    render() {
        const client = this.props.client
        const register = this.props.client.register
        const errors = this.props.client.errors
        const isNew = this.state.isNew


        if (client.isAuthenticated) {
            // redirect to profile
            this.props.router.push('profile');
        }


        let alert = <div className=""></div>;
        if (errors.register) {
            alert = <div className="alert alert-danger">{errors.register}</div>
        } else if (errors.auth) {
            alert = <div className="alert alert-danger">{errors.auth}</div>
        } else if (register.stage == 'enter_sms_code') {
            alert = <div className="alert alert-info">Введите код из СМС</div>
        } else if (register.stage == 'done' && this.state.isNew === true) {
            this.setState({'isNew': !(cookie.load('rocket_login') && cookie.load('rocket_login').length > 0)})
        }

        const panel_style = {marginTop: '8%'}
        return(
            <div className="col-sm-12 col-md-6 col-md-offset-3" style={panel_style}>
                <form onSubmit={this.onSubmit}>
                    {alert}
                    <div className="panel panel-default" >
                        <div className="panel-heading">
                            <h3 className="panel-title">Войти в кабинет Рокетбанка</h3>
                        </div>
                        <div className="panel-body">
                            {
                                (isNew && register.stage == 'enter_phone') ? (
                                    <div className="form-group">
                                        <label>Введите ваш номер телефона</label>
                                        <input type="text" className="form-control" name="phone" onChange={this.changeInput} placeholder="Номер телефона (+79998887766)"/>
                                    </div>
                                ) : null
                            }
                            {
                                (isNew && register.stage == 'enter_sms_code') ? (
                                    <div className="form-group">
                                        <label>Введите код из СМС</label>
                                        <input type="text" className="form-control" name="sms_code" onChange={this.changeInput} placeholder="Код из смс (XXXX)"/>
                                    </div>
                                ) : null
                            }
                            {
                                (!isNew) ? (
                                    <div className="form-group">
                                        <label>Введите код от личного кабинета</label>
                                        <input type="password" className="form-control" ref="app_code" name="app_code" onChange={this.changeInput} placeholder="Код от личного кабинета (XXXX)"/>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="panel-footer">
                            <button type="submit" className="btn btn-primary btn-block">Войти</button>
                            {
                                (!isNew) ? (
                                    <button onClick={this.logout} className="btn btn-danger btn-block">Выйти</button>
                                ) : null
                            }
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}