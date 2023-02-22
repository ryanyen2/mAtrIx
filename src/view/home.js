// react template for d3
import React from "react";
import * as d3 from "d3";
import BarChart from "../components/home/barChart";

// social media app component
import SocialMediaApp from "../components/socialMediaApp/SocialMediaApp.jsx";

// import { Container, Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [12, 5, 6, 6, 9, 10],
      width: 500,
      height: 150,
    };
  }

  componentDidMount() {
// Commented out due to compile errors

//    fetch("/api/time")
//      .then((res) => res.json())
//      .then((data) => {
//        this.setState({ data: data });
//      });
  }

  render() {
    return (
      <div>
        <SocialMediaApp />
        <div id="home">
          <Container>
            <Row>
              <Col id="barchart">
                <BarChart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                />
              </Col>
              <Col>2 of 3</Col>
              <Col>3 of 3</Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Home;
