import React from 'react'
import {connect} from 'react-redux'
import {auth_required} from '../actions/client'

export const PUBLIC = 'PUBLIC'
export const ONLY_AUTHENTICATED = 'ONLY_AUTHENTICATED'


export default function (ComponentToInclude, access_type = PUBLIC) {
    class routeProtector extends React.Component {
        componentWillMount() {
            this.state = {
                should_render: true
            };

            switch (access_type) {
                case ONLY_AUTHENTICATED: {
                    if (!(this.props.authorization.isAuthenticated)) {
                        this.props.dispatch(auth_required('Please, authorize first'))
                        this.props.router.push('login');
                        this.state.should_render = false;
                    }
                    break;
                }
            }
        }
        componentWillUpdate(new_props) {
            if (access_type == ONLY_AUTHENTICATED) {
                if (!(new_props.authorization.isAuthenticated)) {
                    this.props.dispatch(auth_required('You are logged out'))
                    this.props.router.push('login');
                    this.state.should_render = false;
                }
            }
        }

        render() {
            if (this.state.should_render === true) {
                return (
                    <ComponentToInclude {...this.props} />
                )
            } else {
                return (<div></div>)
            }
        }
    }

    routeProtector.propTypes = {
        authorization: React.PropTypes.object.isRequired
    }

    function mapStateToProps(state) {
        return {
            authorization: state.reducer.client
        }
    }
    return connect(mapStateToProps)(routeProtector);
}