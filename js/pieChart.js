var wordData =[
	{label:'3 letter', value: 1288, color: "red"},
	{label:'4 letter', value: 5451, color: "yellow"},
	{label:"5 letter", value: 12471, color:"green"},
	{label:"6 letter", value: 22133, color:"blue"},
	{label:"7 letter", value: 32891, color:"orange"},
	{label:'8 letter', value: 40144, color: "lime"},
	{label:'9 letter', value: 40719, color: "purple"},
	{label:"10 letter", value: 35526, color:"redorange"},
	{label:"11 letter", value: 27891, color:"magenta"},
	{label:"12 letter", value: 20295, color:"skyblue"},
	{label:"13 letter", value: 13857, color:"brown"},
	{label:"14 letter", value: 9117, color:"black"},
	{label:"15 letter", value: 5757, color:"navy"}
];
//08 letter words = 40144
//09 letter words = 40719
//10 letter words = 35526
//11 letter words = 27891
//12 letter words = 20295
//13 letter words = 13857
//14 letter words = 9117
//15 letter words = 5757

var svg = d3.select("body").append("svg").attr({ "width":700, "height":300 });

svg.append("g").property({id:"wordsDonut"});

Donut3D.draw("wordsDonut", wordData, 150, 150, 130, 100, 30, 0.4);

function changeData(){
	Donut3D.transition("wordsDonut", randomData(), 130, 100, 30, 0.4);
}

function randomData(){
	return wordData.map(function(d){
		return {label:d.label, value:1000*Math.random(), color:d.color};});
}