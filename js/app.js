// d3.select("h3").on("click", togglePieChart);

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

function startup() {
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);


    var pie = d3.layout.pie()
        .value(function(d) {
            return d.champions;
        })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 60)
        .outerRadius(radius - 10);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(overview));

    g.enter().append("g")
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
        .on("click", function(d) {
            change(d.data.class);
            d3.select('.tooltip')
                .style('opacity', 0);
        });

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.class;
        });

    function change(leagueTag) {
        pie.value(function(d) {
            return 1;
        });
        var specificChampions = [];
        champion.forEach(function(champ) {
          var champTag = champ.tags;
          if(contains(champTag, leagueTag)){
            specificChampions.push(champ);
          }
        });

        g = g.data(pie(specificChampions), function(d) {
            return d.data.name;
        });
        g.enter().append("path").attr("fill", function(d) {
            return color(d.data.name);
        });
        g.exit().remove();
        g.attr("d", arc);

    }
}
function contains(tags, certainTag) {
    var i = tags.length;
    while (i--) {
       if (tags[0] == certainTag) {
           return true;
       }
    }
    return false;
}
fucntion specificChampions(champions){

}
