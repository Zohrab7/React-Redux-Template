import React, {Fragment, Component} from 'react';
import createComponent from 'hocs/createComponent';
import './main.scss';
const Home = createComponent({className: 'home'}, [
    {name: 'Container'},
    {name: 'Header'},
    {name: 'Content'},
    {name: 'Img',tag:"img"},
]);


class DefHome extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <Fragment>
                <Home.Container>
                    <Home.Content>
                        <Home.Img src={require("images/banner.png")}/>
                    </Home.Content>
                </Home.Container>
            </Fragment>
        );
    }

}

export default DefHome;
