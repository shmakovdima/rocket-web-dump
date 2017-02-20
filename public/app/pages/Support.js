import React from 'react'
import {connect} from 'react-redux'
import Chat from './widgets/Chat'

@connect((store) => {
    return {
        client: store.reducer.client
    };
})


export default class Support extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const client = this.props.client;

        if (client.isAuthenticated === false) {
            return (<div className="alert alert-danger">Не авторизован</div>)
        }

        if (!client.chat) {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="alert alert-info" >Подгружаем...</div>
                    </div>
                </div>
            )
        }

        return(
            <div className="row">
                <div className="col-sm-12 col-md-offset-2 col-md-8">
                    <Chat client={client} />
                </div>
            </div>
        )
    }
}