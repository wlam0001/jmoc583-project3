d3.select("h3").on("click", togglePieChart);

var overview = null;
var champion = null;

d3.json("/js/overview.json", function(error, data) {
  overview = data;
  datacall();
});

d3.json("/js/champion.json", function(error, data) {
  champion = data;
  datacall();
});


function datacall() {
  if (overview != null && champion != null) {
    startup();
  }
}

function startup () {
  console.log("stuff" + overview);
  var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

  //colors different sections of the pie chart
  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);

  //determines the thickness of the pie chart
  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 100);

  //proportion different sizes of pie pieces based on their champion count
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.champions;
    });

  //appends svg object to chart div
  var svg = d3.select(".chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // d3.json("/js/overview.json", function(error, data) {
  //   if (error) throw error;

    var g = svg.selectAll(".arc")
      .data(pie(overview))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) {
        return color(d.data.class);
      })
      .on('mouseover', function(d) {
        d3.select('.tooltip')
          .html(d.data.class + "<br />" + d.data.info)
          .style('opacity', 1);
        d3.select(this)
          .style('opacity', 0.3);
      })
      .on('mouseout', function(d) {
        d3.select('.tooltip')
          .style('opacity', 0);
        d3.select(this)
          .style('opacity', 1);
      })
      .on("click", togglePieChart);

    g.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data.class;
      });
  // });

}
function togglePieChart() {
  var pieChart = d3.select(".chart");
  if (pieChart.style("visibility") == "hidden") {
    pieChart.style("visibility", "");
  } else {
    pieChart.style("visibility", "hidden");
  }
}
// function showChampion(class){
//   d3.json("champion.json", function(error, data) {
//
//   }
// }
function type(d) {
  d.champions = +d.champions;
  return d;
}
