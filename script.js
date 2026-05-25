let customers = [];
let filteredCustomers = [];
let currentPage = 1;
const rowsPerPage = 10;

let pieChart = null;
let barChart = null;
let scatterChart = null;

const sampleData = [
{
id:1,name:"John",gender:"Male",age:25,
income:25000,spending:20,frequency:5
},
{
id:2,name:"Emma",gender:"Female",age:28,
income:40000,spending:45,frequency:10
},
{
id:3,name:"David",gender:"Male",age:32,
income:65000,spending:70,frequency:18
},
{
id:4,name:"Sophia",gender:"Female",age:30,
income:90000,spending:88,frequency:22
},
{
id:5,name:"Alex",gender:"Male",age:40,
income:120000,spending:98,frequency:30
},
{
id:6,name:"Mia",gender:"Female",age:24,
income:30000,spending:30,frequency:6
},
{
id:7,name:"James",gender:"Male",age:35,
income:55000,spending:60,frequency:15
},
{
id:8,name:"Olivia",gender:"Female",age:29,
income:80000,spending:82,frequency:20
}
];

document.getElementById("sampleBtn")
.addEventListener("click", loadSampleData);

document.getElementById("clusterBtn")
.addEventListener("click", runSegmentation);

document.getElementById("searchInput")
.addEventListener("input", applyFilters);

document.getElementById("segmentFilter")
.addEventListener("change", applyFilters);

document.getElementById("exportBtn")
.addEventListener("click", exportCSV);

document.getElementById("csvFile")
.addEventListener("change", handleCSVUpload);

function loadSampleData() {
customers = [...sampleData];
filteredCustomers = [...customers];
renderTable();
updateStats();
}

function handleCSVUpload(event) {

const file = event.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

const text = e.target.result;
const rows = text.split("\n").slice(1);

customers = [];

rows.forEach((row,index)=>{

const cols = row.split(",");

if(cols.length >= 7){

customers.push({
id:Number(cols[0]),
name:cols[1],
gender:cols[2],
age:Number(cols[3]),
income:Number(cols[4]),
spending:Number(cols[5]),
frequency:Number(cols[6])
});

}

});

filteredCustomers = [...customers];

renderTable();
updateStats();

};

reader.readAsText(file);
}

function runSegmentation(){

customers.forEach(customer=>{

const score =
(customer.income * 0.0005) +
(customer.spending * 0.7) +
(customer.frequency * 0.3);

if(score < 40){
customer.segment = "Budget";
}
else if(score < 65){
customer.segment = "Regular";
}
else if(score < 90){
customer.segment = "Premium";
}
else{
customer.segment = "VIP";
}

});

filteredCustomers = [...customers];

updateStats();
renderTable();
drawCharts();

alert("Segmentation Completed Successfully");

}

function updateStats(){

document.getElementById("totalCustomers")
.textContent = customers.length;

const budget =
customers.filter(c=>c.segment==="Budget").length;

const regular =
customers.filter(c=>c.segment==="Regular").length;

const premium =
customers.filter(c=>c.segment==="Premium").length;

const vip =
customers.filter(c=>c.segment==="VIP").length;

document.getElementById("budgetCount")
.textContent = budget;

document.getElementById("regularCount")
.textContent = regular;

document.getElementById("premiumCount")
.textContent = premium;

document.getElementById("vipCount")
.textContent = vip;

}

function applyFilters(){

const search =
document.getElementById("searchInput")
.value.toLowerCase();

const segment =
document.getElementById("segmentFilter")
.value;

filteredCustomers = customers.filter(c=>{

const matchSearch =
c.name.toLowerCase().includes(search);

const matchSegment =
segment==="All" || c.segment===segment;

return matchSearch && matchSegment;

});

currentPage = 1;

renderTable();

}

function renderTable(){

const tbody =
document.querySelector("#customerTable tbody");

tbody.innerHTML = "";

const start =
(currentPage-1)*rowsPerPage;

const end =
start + rowsPerPage;

const pageRows =
filteredCustomers.slice(start,end);

pageRows.forEach(c=>{

let badge = "-";

if(c.segment){

badge =
`<span class="badge badge-${c.segment.toLowerCase()}">
${c.segment}
</span>`;

}

tbody.innerHTML += `
<tr>
<td>${c.id}</td>
<td>${c.name}</td>
<td>${c.gender}</td>
<td>${c.age}</td>
<td>$${c.income}</td>
<td>${c.spending}</td>
<td>${c.frequency}</td>
<td>${badge}</td>
</tr>
`;

});

renderPagination();

}

function renderPagination(){

const container =
document.getElementById("pagination");

container.innerHTML = "";

const pages =
Math.ceil(filteredCustomers.length / rowsPerPage);

for(let i=1;i<=pages;i++){

const btn =
document.createElement("button");

btn.textContent = i;

btn.onclick = ()=>{

currentPage = i;
renderTable();

};

container.appendChild(btn);

}

}

function drawCharts(){

const budget =
customers.filter(c=>c.segment==="Budget").length;

const regular =
customers.filter(c=>c.segment==="Regular").length;

const premium =
customers.filter(c=>c.segment==="Premium").length;

const vip =
customers.filter(c=>c.segment==="VIP").length;

if(pieChart) pieChart.destroy();
if(barChart) barChart.destroy();
if(scatterChart) scatterChart.destroy();

pieChart = new Chart(
document.getElementById("pieChart"),
{
type:"pie",
data:{
labels:[
"Budget",
"Regular",
"Premium",
"VIP"
],
datasets:[{
data:[
budget,
regular,
premium,
vip
]
}]
}
});

barChart = new Chart(
document.getElementById("barChart"),
{
type:"bar",
data:{
labels:[
"Budget",
"Regular",
"Premium",
"VIP"
],
datasets:[{
label:"Customers",
data:[
budget,
regular,
premium,
vip
]
}]
}
});

scatterChart = new Chart(
document.getElementById("scatterChart"),
{
type:"scatter",
data:{
datasets:[{
label:"Income vs Spending",
data:customers.map(c=>({
x:c.income,
y:c.spending
}))
}]
}
});

}

function exportCSV(){

let csv =
"ID,Name,Gender,Age,Income,Spending,Frequency,Segment\n";

customers.forEach(c=>{

csv +=
`${c.id},${c.name},${c.gender},${c.age},${c.income},${c.spending},${c.frequency},${c.segment || ""}\n`;

});

const blob =
new Blob([csv],{type:"text/csv"});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"customer_segments.csv";

a.click();

}
loadSampleData();
runSegmentation();
function exportCSV() {
  // existing code
}

/* Add these two lines below */
loadSampleData();
runSegmentation();
loadSampleData();
runSegmentation();
function exportCSV() {
  // existing code
}
