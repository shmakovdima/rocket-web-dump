import React from 'react'
import {connect} from 'react-redux'
import {
    get_discounts
} from '../actions/discounts'
import FavPlaces from './for_discounts/FavPlaces'
import Categories from './for_discounts/Categories'

@connect((store) => {
    return {
        client: store.reducer.client
    };
})


export default class Discounts extends React.Component {
    constructor(props) {
        super(props);
        const client = this.props.client
        const session_token = client.tokens.session

        this.props.dispatch(get_discounts(session_token))
    }
    render() {
        const client = this.props.client;

        if (client.isAuthenticated === false) {
            return (<div className="alert alert-danger">Не авторизован</div>)
        }

        if (!client.discounts) {
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
                <div className="col-xs-12">
                    <FavPlaces fav_places={client.discounts['chosen_month_cash_back']} />
                    <Categories categories={client.discounts['categories']} />
                </div>
            </div>
        )
    }
}