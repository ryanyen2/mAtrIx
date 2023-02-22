// react template for d3
import React from "react";
// import * as d3 from "d3";
import BarChart from "../components/home/barChart";

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
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data });
      });
  }

  render() {
    return (
      <div id="home">
        <BarChart
          id="barchart"
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default Home;
