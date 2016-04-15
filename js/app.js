var overview = null;
var champion = null;

//read data from json via ajax call
d3.json("/js/overview.json", function(error, data) {
    overview = data;
    datacall();
});

d3.json("/js/champion.json", function(error, data) {
    champion = data;
    datacall();
});

//check for validity of data
function datacall() {
    if (overview != null && champion != null) {
        startup();
    }
}

function startup() {
    //sets up pie chart
    var width = 950,
        height = 500,
        radius = Math.min(width, height) / 2;
    var color = d3.scale.ordinal()
        .range(["#001133"]);

    var pie = d3.layout.pie()
        .value(function(d) {
            return d.champions;
        })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 10);

    var svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc");
    var path = null;
    var path2 = null;

    d3.select('.title')
        .on("click", function() {
            original();
        });

    //loads first pie chart
    original();

    function original() {
        displayTip();

        //removes previous pie path drawing
        if (path2 != null) {
            path2.remove();
        }

        //gives pie chart specific data
        g = g.data(pie(overview), function(d) {
            return d.data.class;
        });

        //gives each path element mouseover, mouseout and click even attribute
        path = g.enter().append("path")
            .attr("fill", function(d) {
                return color(d.data.class);
            })
            .on('mouseover', function(d) {
                displayTip();
                mouseOver(this, d);
            })
            .on('mouseout', function(d) {
                show(this);
                displayTip();
            })
            .on("click", function(d) {
                change(d.data.class); //loads new pie based on path clicked
            });
        g.exit().remove(); //removes old labels
        g.attr("d", arc); //loads the pie chart

        putLabel();
    }

    function change(leagueTag) {
        path.remove(); //removes old data from previous pie
        pie.value(function(d) {
            return 1;
        });

        //gets specific data based on path chosen
        var specificChampions = specificChamps(champion, leagueTag);

        g = g.data(pie(specificChampions), function(d) {
            return d.data.name;
        });

        //appends paths to form a circle
        path2 = g.enter().append("path")
            .attr("fill", function(d) {
                return color(d.data.name);
            })
            .on('mouseover', function(d) {
                mouseOver(this, d, leagueTag);
            })
            .on('mouseout', function(d) {
                show(this);
            })
            .on("click", function(d) {
                getOriginal(d);
            });
        g.exit().remove(); //removes previous labels
        g.attr("d", arc); //loads the pie

        putLabel(leagueTag);
    }

    //function that loads the orignal data for onclick events
    function getOriginal(d) {
        d3.event.stopPropagation();
        displayTip("<h3><b>" + d.data.name + "</b></h3>" + '</br><img src="' + d.data.image + '" />');
        d3.select('.info')
            .on("click", function() {
                original();
            });
    }

    //fucntions that performs actions for mouseover events
    function mouseOver(current, d, tag) {
        if (tag == null) {
            displayTip("<h3>" + d.data.class + "</h3>" + "<br />" + d.data.info);
        }
        d3.select(current)
            .style('opacity', 0.3);
    }

    //appends to the pie labels
    function putLabel(tag) {
        g.enter().append("text")
            //appends label based on size of the data
            .attr("transform", function(d) {
                var getAngle = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
                if (d.data.name == null || ((tag != "Fighter") && (tag != "Mage"))) {
                    var getAngle = 0;
                }
                return "translate(" + arc.centroid(d) + ") " +
                    "rotate(" + getAngle + ")";
            })
            .attr("text-anchor", "middle")
            .attr("fill", "#D2B14C")
            .text(function(d) {
                if (d.data.name == null) {
                    return d.data.class;
                }
                return d.data.name;
            })
            //appends same events as the path they overlay
            .on('mouseover', function(d) {
                if (d.data.name == null) {
                    displayTip();
                    mouseOver(this, d);
                } else {
                    mouseOver(this, d, tag);
                }
            })
            .on('mouseout', function(d) {
                if (d.data.name == null) {
                    displayTip();
                }
                show(this);
            })
            .on("click", function(d) {
                if (d.data.class != null) {
                    change(d.data.class);
                } else {
                    getOriginal(d);
                }
            });
    }

    //display information at center of the pie
    function displayTip(description) {
        var displayinfo = "</br></br>Before beginnning your fight, pick your role and your champion.";
        if (description != null) {
            displayinfo = description;
        }

        d3.select('.info')
            .style("left", width / 2 + 90 + "px")
            .style("top", height / 2 + 215 + "px")
            .html(displayinfo);
    }

    //shows current selected object
    function show(current) {
        d3.select(current)
            .style('opacity', 1);
    }

  //hides current selected object
    function hide(current) {
        d3.select(current)
            .style('opacity', 0);
    }
}

//see if a class type is in the array of class types the champion belongs to
function contains(tags, certainTag) {
    var i = tags.length;
    while (i--) {
        if (tags[0] == certainTag) {
            return true;
        }
    }
    return false;
}

//returns an array of champions that fits the given critera
function specificChamps(champions, tags) {
    var specificChampion = [];
    champion.forEach(function(champ) {
        var champTag = champ.tags;
        if (champTag[0] == tags) {
            specificChampion.push(champ);
        }
    });
    return specificChampion;
}
