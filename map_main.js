const topo_url = "https://gist.githubusercontent.com/Ayushjangida/c42b366cb33ed967f91f77efb5324bac/raw/8511944973445eb533c99c8e57aa99447d12fd59/student_district.json";
const student_url = "https://gist.githubusercontent.com/Ayushjangida/4f33a07e10bd6432dfd9bfa479467ce7/raw/2802462a0c054212c7dd985a566b12faf3222955/students.csv";

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

// For radio buttons
var form = d3.select("body").append("form");

var finalMap;

// For tooltips
var div = d3.select("#tooltip")
    .append("div")
    //.attr("class", "tooltip")
    .style("opacity", 0);

// Map SVG
var mapDiv = d3.select("body")
                .append("div")
                .attr("width", GRAPH_WIDTH)
                .attr("height", GRAPH_HEIGHT);

// Map
var svg = mapDiv.append("svg")
    .attr("width", GRAPH_WIDTH)
    .attr("height", GRAPH_HEIGHT)
    .attr("id", "map");


var selectedLanguage = "Punjabi";

function handleMouseOver(position) {
    let pos = d3.mouse(this);
    console.log(pos);
    d3.select(this)
        .style("fill", "black");
    d3.select("div")
        .transition().duration(500)
        .style("opacity", 0) // needs to be 0.7
        .style("top", d3.event.pageY + 10)
        .style("left", d3.event.pageX + 10);
    div.html(this.getAttribute("district"));
    //console.log(this.getAttribute("district"));
    //console.log(d3.event.pageX, d3.event.pageY);
}
function handleMouseOut() {
    d3.select(this).style("fill", "purple");
    d3.select("div")
        .transition().duration(500)
        .style("opacity", 0);
}

function selectLanguage()    {
    var select = document.getElementById("languages");
    var value = select.options[select.selectedIndex].value;
    console.log(value);
}

var languages = [
    "Punjabi",
    "Chinese",
    "Spanish",
    "Japanese",
    "French",
    "English"
];

var dropdownButton = d3.select("#languageDropdown")
    .append('select')

dropdownButton.selectAll('myOptions')
    .data(languages)
    .enter()
    .append('option')
    .text(function(d) {return d; })
    .attr("value", function(d) {return d});

dropdownButton.on("change", function(d) {
    selectedLanguage = d3.select(this).property("value");
    finalMap.transition()
        .attr("fill-opacity", 0);
    drawMap();
    console.log(selectedLanguage);
})


drawMap();

function drawMap() {

d3.csv("students_clean.csv").then(studentData => {
    console.log(studentData);

    var select = [];
    var selectLangTotalCount = 0;

    //
    // //console.log(studentData[0].HOME_LANGUAGE);
    // var uniqueLanguages = [];
    // for(let i = 0; i < studentData.length; i++) {
    //     if (studentData[i].HOME_LANGUAGE in uniqueLanguages) {
    //         // do nothing
    //         console.log("Language already there: " + studentData[i].HOME_LANGUAGE);
    //     }
    //     else {
    //         uniqueLanguages.push(studentData[i].HOME_LANGUAGE)
    //         console.log("New language: " + studentData[i].HOME_LANGUAGE + ", Adding...")
    //     }
    // }
    //
    // labels = form.selectAll("label")
    //     .data(uniqueLanguages)
    //     .enter()
    //     .append("label")
    //     .text(function(d) { return d; })
    //     .append("input")
    //     .attr("type", "radio")
    //     .attr("Value", function(d) { return d;})
    //     .text(function (d) {return d;} );
    //         //class: "languageRadio",
    //         //name: "mode",
    //     //     value: function(d, i) {return i;}
    //     // })
    //     // .property("checked", function(d, i) {return i===j;});
    //
    // d3.selectAll("input")
    //     .on("change", change);
    //
    // function change() {
    //     console.log("new language selected " + this.value);
    // }


    //Get selected year from dropdown
    var year = document.getElementById("year");
    var yearVal = year.options[year.selectedIndex].value;
    console.log(yearVal);

    var count = 0;
    selectLangTotalCount = studentData.map(function(studentData)    {
        if(studentData.HOME_LANGUAGE === selectedLanguage
            && studentData.DATA_LEVEL === "PROVINCE LEVEL"
            && studentData.SCHOOL_YEAR === yearVal
            && studentData.PUBLIC_OR_INDEPENDENT === "PROVINCE - Total")  {
                count = studentData.NUMBER_OF_STUDENTS;
            }
            return count;
    })
    console.log(count);
    
    var selectRows = [];

    select = studentData.map(function(studentData)   {
        if(studentData.HOME_LANGUAGE === selectedLanguage
            && studentData.DATA_LEVEL === "DISTRICT LEVEL"
            && studentData.SCHOOL_YEAR === yearVal)  {
                selectRows.push(studentData);
            }
                return studentData;
    })
    console.log(selectRows);

    var total = 0;
    for(i = 0; i < selectRows.length; i++)  {
        if(selectRows[i].NUMBER_OF_STUDENTS !== "Msk")   total += parseInt(selectRows[i].NUMBER_OF_STUDENTS);
    }

    console.log(total)

    d3.json("districts1.json").then(data => {
        console.log(data);

        //const collect = topojson.feature(data, data.objects.collection);

        // Map Projection
        const {height, width} = document.getElementById("map").getBoundingClientRect();
        const projection = d3.geoMercator()
            .center([15.454071, 4.279229])//13.439235,48.830666])//53.7267, 127.6476])
            .scale(3000)
            .translate([GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2]);


        projection.fitExtent(
            [
                [0, 0],
                [width, height],
            ],
            data
        )

        var path = d3.geoPath().projection(projection);

        // // Slider for selecting year
        // // https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        //
        // var dataTime = d3.range(0, 20).map(function(d) {
        //     return new Date(1991 + d, 10, 3);
        // });
        //
        // var sliderTime = d3
        //     .sliderBottom()
        //     .min(d3.min(dataTime))
        //     .max(d3.max(dataTime))
        //     .step(1000 * 60 * 60 * 24 * 365)
        //     .width(300)
        //     .tickFormat(d3.timeFormat('%Y'))
        //     .tickValues(dataTime)
        //     .default(new Date(2000, 10, 3))
        //     .on('onchange', val => {
        //         d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        //     });
        //
        // var gTime = d3.select('div#slider-time')
        //     .append('svg')
        //     .attr('width', 500)
        //     .attr('height', 100)
        //     .append('g')
        //     .attr('transform', 'translate(30,30)');
        //
        // gTime.call(sliderTime);
        //
        // d3.select('p#value-time')
        //     .text(d3.timeFormat('%Y')(sliderTime.value()));

        // Source used to understand code for reversing polygons to draw reverse of polygons: https://stackoverflow.com/questions/54947126/geojson-map-with-d3-only-rendering-a-single-path-in-a-feature-collection
        // This was necessary to have districts drawn where they are independent pieces of the overall map
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

        // Color scaling function for the opacity of the districts based on their language population
        const colorScale = d3.scaleLinear()
            .domain([0, 300])
            .range([0, 1])

            // Drawing the districts
        finalMap = svg.append("g")
                .selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("class", (data) => data.properties.SCHOOL_DISTRICT_NAME)
                .attr("d", path)
                .attr("transform", "translate(-500, -4100) scale(2)")
                //.attr("transform", "translate(30, 100)")
                //.attr("scale", "150")
                .attr("fill", "purple")
                // Changing the fill opacity for each district based on the student population for the chosen language
                .attr("fill-opacity", function (data) {
                    let studentCount = 0;
                    for (let i = 0; i < selectRows.length; i++) {
                        //console.log(data.properties.SCHOOL_DISTRICT_NAME + " : " + selectRows[i].DISTRICT_NAME);
                        if (data.properties.SCHOOL_DISTRICT_NAME === selectRows[i].DISTRICT_NAME) {
                            //console.log(selectRows[i].DISTRICT_NAME);
                            studentCount = studentCount + parseInt(selectRows[i].NUMBER_OF_STUDENTS);
                            //console.log("students: " + selectRows[i].NUMBER_OF_STUDENTS);
                            //console.log(studentCount);
                        }
                    }
                    // console.log(data.properties.SCHOOL_DISTRICT_NAME + ": " + studentCount);
                    return colorScale(studentCount);
                })
                .attr("stroke", "black")
                // Hover on and off functions for extra details
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);
        })

    });


}

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