import React from 'react'
import Header from './Header'

export default class Template extends React.Component {
    render() {
        return(
            <div className="container">
                <Header {...this.props} />
                {this.props.children}
            </div>
        )
    }
}