import React from 'react'
import {
    get_currency_letter
} from '../../helpers/currencies'

export default class Categories extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const info = this.props.categories;

        if (!info) {
            return null
        }
        let styles = {
            place_logo: {
                maxWidth: '125px'
            },
            place_name: {
                paddingTop: '6%'
            },
            place_block: {
                paddingBottom: '3%'
            }
        }
        return(
            <div>
                {
                    info.map(cat => {
                        let max_per_row = 4
                        let items_current_row = []



                        return (
                            <div>
                                <div className="page-header">
                                    <h1>
                                        {cat['name']}
                                    </h1>
                                </div>
                                {
                                    (cat['name'] == 'Консьерж') ? (
                                        <p>
                                            1) Забронируйте столик, написав в чат поддержки<br/>
                                            2) Расплатитесь картой Рокетбанка<br/>
                                            3) Получите кешбэк 5% от суммы чека на карту в течение суток после посещения
                                        </p>
                                    ) : null
                                }
                                {
                                    cat['discounts'].map((item, index, arr) => {
                                        let image = null
                                        if (item['preview_image_url']) {
                                            image = <img className="media-object img-rounded" src={item['preview_image_url']} style={styles.place_logo} alt={item['short_title']}/>
                                        } else if (item['main_image_url']) {
                                            image = <img className="media-object img-rounded" src={item['main_image_url']} style={styles.place_logo} alt={item['short_title']}/>
                                        }

                                        let name = null
                                        if (item['short_title']) {
                                            name = item['short_title']
                                        }
                                        if (item['link_type'] == 'external_url') {
                                            name = <a href={item['link']} target="_blank">{name}</a>
                                            image = <a href={item['link']} target="_blank">{image}</a>
                                        }

                                        let description = description = <p>
                                            {(item['promo_code']) ? (
                                                <span>
                                                Промо-код <b>{item['promo_code']}</b> <br/>
                                                    {(item['promo_title']) ? (
                                                        <span>
                                                        {item['promo_title']}<br/>
                                                    </span>) : null}
                                            </span>
                                            ) : null}
                                            {(item['name']) ? item['name'] : null}
                                        </p>

                                        items_current_row.push((
                                            <div className="col-xs-6 col-md-3" style={styles.place_block}>
                                                <div className="media">
                                                    <div className="media-left">
                                                        {image}
                                                    </div>
                                                    <div className="media-body">
                                                        <h4 className="media-heading" style={styles.place_name}>{name}</h4>
                                                        {description}
                                                    </div>
                                                </div>
                                            </div>
                                        ))

                                        if (items_current_row.length == max_per_row || index == arr.length - 1) {
                                            let row_display = (
                                                <div className="row">
                                                    {
                                                        items_current_row.map(item => {
                                                            return item
                                                        })
                                                    }
                                                </div>
                                            )
                                            items_current_row = []
                                            return row_display
                                        } else {
                                            return null
                                        }


                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}