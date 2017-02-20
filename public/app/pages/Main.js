import React from 'react'
import {Link} from 'react-router'

export default class Main extends React.Component {

    render() {
        return(
            <div>
                <h1>
                    <div className="jumbotron">
                        <h1>Привет!</h1>
                        <p>
                            Это веб-версия легендарного банка. Она <Link to="about">безопасна</Link>. Она умеет многое. Скоро еще больше фишечек.
                        </p>
                        <p>
                            <div className="btn-group">
                                <Link to="login" className="btn btn-primary btn-lg">Войти</Link>
                                <Link to="about" className="btn btn-default btn-lg">Что это?</Link>
                            </div>
                        </p>
                    </div>
                </h1>
            </div>
        )
    }
}