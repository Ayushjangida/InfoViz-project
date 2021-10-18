

//const topo_url = "https://gist.githubusercontent.com/Ayushjangida/c42b366cb33ed967f91f77efb5324bac/raw/8511944973445eb533c99c8e57aa99447d12fd59/student_district.json";

// other resources used:
// https://mapshaper.org/ - for simplyfying geojson file

const MARGIN = {
    TOP : 30,
    BOTTOM : 30,
    LEFT : 50,
    RIGHT : 20,
};

const GRAPH_WIDTH = 8000 - MARGIN.LEFT - MARGIN.RIGHT;
const GRAPH_HEIGHT = 8000 - MARGIN.TOP - MARGIN.BOTTOM;

var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
    .attr("width", GRAPH_WIDTH)
    .attr("height", GRAPH_HEIGHT)
    .attr("id", "map");

function handleMouseOver(position) {
    let pos = d3.mouse(this);
    console.log(pos);
    d3.select(this)
        .style("fill", "black");
    d3.select("div")
        .transition().duration(500)
        .style("opacity", 0.9)
        .style("top", d3.event.pageY + 10)
        .style("left", d3.event.pageX + 10);
    div.html(this.getAttribute("district"));
    console.log(this.getAttribute("district"));
    console.log(d3.event.pageX, d3.event.pageY);
}
function handleMouseOut() {
    d3.select(this).style("fill", "#ba8deb");
    d3.select("div")
        .transition().duration(500)
        .style("opacity", 0);
}
d3.csv("students.csv").then(studentData => {
    console.log(studentData);

    d3.json("districts1.json").then(data => {
        console.log(data);

        const {height, width} = document.getElementById("map").getBoundingClientRect();

        const projection = d3.geoMercator()
            .scale(5)
            .center([0, 0])//13.439235,48.830666])//53.7267, 127.6476])
            .translate([GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2]);
        projection.fitExtent(
            [
                [0, 0],
                [width, height],
            ],
            data
        )

        // Source used to understand code for reversing polygons to draw reverse of polygons: https://stackoverflow.com/questions/54947126/geojson-map-with-d3-only-rendering-a-single-path-in-a-feature-collection
        data.features.forEach(function(feature) {
            if(feature.geometry.type === "MultiPolygon") {
                feature.geometry.coordinates.forEach(function(polygon) {

                    polygon.forEach(function(ring) {
                        ring.reverse();
                    })
                })
            }
            else if (feature.geometry.type === "Polygon") {
                feature.geometry.coordinates.forEach(function(ring) {
                    ring.reverse();
                })
            }
        })

        const path = d3.geoPath().projection(projection);
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("district", (data) => data.properties.SCHOOL_DISTRICT_NAME)
            .attr("d", path)
            .attr("scale", "150")
            .attr("fill", "#ba8deb")
            .attr("stroke", "#3b007a")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

    });
})

/*
 const graticule = d3.geoGraticule();

const proj = svg.append("projPath")
    .attr("width", "100%");

const g = svg.append("g")
    .attr("width", "100%");

//const pathG = g.append("pathG");

d3.json("districts1.json").then(data => {
    console.log(data);
    console.log(data.features);
    //var bounds = path.bounds(data);
    //_data = data;

    proj.select()
        .enter()
        .append("proj")
        .merge(bc_projection);

    g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        //.attr("class", data)
        //.merge(bc_path)
        .attr("id", (d) => d.properties.SCHOOL_DISTRICT_NAME)
        .attr("d", bc_path)
        .attr("fill", "none")
        //.attr("opacity", 0.1)
        .attr("stroke", "black");
})
        //.attr("stroke-width", "0.5");
        //.attr("fake", d => console.log(data.features.map((f) => f.properties.SCHOOL_DISTRICT_NAME)));

    /*
    var labels = g.selectAll(".label").data(data.features);

    labels.enter()
        .append("text")
        .attr("class", "label")
            .merge(labels)
            .text((d) => d.properties.SCHOOL_DISTRICT_NAME);
*/
    //.attr("stroke-width", 1.5);

/*



        g.selectAll("path").data(data.features)
            .enter()
            .append("path")
            .attr("class", data)
            .attr("d", bc_path)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("fake", d=> console.log(data.features.map((f) => f.properties.SCHOOL_DISTRICT_NAME)));

        //console.log(data.features.map((f) => f.properties.name))

        for(let i = 0; i < data.features.length; i++) {
            console.log(data.features.map((f) => f.properties.SCHOOL_DISTRICT_NAME));
        }

        const collect = topojson.feature(data, data.objects.collection);

//        console.log(collect);
//        const locate = collect.features;
        
//        console.log(data.features);
//        console.log(locate);
        console.log(collect.features)
        g.selectAll("path").data(collect.features)
                            .enter()
                            .append("path")
                            .attr('transform', `translate(${TRANSLATE_LEFT}, ${TRANSLATE_BOTTOM})`)
                            .attr("class", "collection")
                            .attr("d", bc_path)
                            .attr("fill", "white")
                            .attr("stroke", "black"); */


// function drawMap(err, bc)    {
//     if(err) throw err

//     console.log(bc)

//     svg.append("path")
//         .datum(graticule)
//         .attr("class", "graticule")
//         .attr("d", bc_path);

//     svg.append("path")
//         .datum(graticule.outline)
//         .attr("class", "foregorund")
//         .attr("d", bc_path);

//     svg.append("g")
//         .selectAll("path")
//         .data(topojson.feature(bc, bc.objects.collection).features)
//         .enter().append("path")
//         .attr("d", bc_path);
// }

// d3.json(topo_url, drawMap);


        

