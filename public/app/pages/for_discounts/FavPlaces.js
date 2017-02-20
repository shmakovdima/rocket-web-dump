import React from 'react'
import {
    get_currency_letter
} from '../../helpers/currencies'

export default class FavPlaces extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const info = this.props.fav_places;

        if (!info) {
            return null
        }
        if (info.visible === false) {
            return null
        }

        let styles = {
            place_logo: {
                maxWidth: '50px'
            },
            place_name: {
                paddingTop: '6%'
            }
        }
        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{info.title}</h3>
                </div>
                <div className="panel-body">
                    {
                        info.merchants.map(place => {
                            return (<div className="col-sm-12 col-md-4">
                                <div className="media">
                                    <div className="media-left">
                                        <img className="media-object img-circle" src={place.merchant['sexy']} style={styles.place_logo} alt={place.merchant['name']}/>
                                    </div>
                                    <div className="media-body">
                                        <h4 className="media-heading" style={styles.place_name}>{place.merchant['name']} +<b>{place.percent}%</b></h4>
                                    </div>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>
        )
    }
}