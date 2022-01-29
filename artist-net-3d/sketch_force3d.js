//  <script src="three.js"></script>
//  <script src="OrbitControls.js"></script>
const elem = document.getElementById('3d-graph');

// large static graph
//const Graph = ForceGraph3D()(elem).jsonUrl('./data/artist_net_static.json')
//      .nodeAutoColorBy('component')
//      .nodeLabel(node => `${node.label}`)
//      .onNodeClick(node => window.open(`https://bl.ocks.org/${node.user}/${node.id}`, '_blank'));


console.log(net_data)
var curr_net = {"nodes":[],"links":[]}
console.log(curr_net)

// get the graph at a given timestamp
function getCurrGraph(timestamp){
  var curr_net = {"nodes":[],"links":[]}
  for (var i = 0; i < net_data['links'].length; i++) {
    if(net_data['links'][i]['time'] <=timestamp){
      if(net_data['links'][i]['time'] == timestamp){
        var color=0xc42e0c;//new link
        var width = 7;
      }else{
        var color=0x218ccf;
        var width = 1
      }
      curr_net['links'].push({'source':net_data['links'][i]['source'],
                              'target':net_data['links'][i]['target'],
                              'time':net_data['links'][i]['time'],
                              'color':color,
                              'width':width})
    }
  }

  for (var i = 0; i < net_data['nodes'].length;i++){
    if(net_data['nodes'][i]['time']<=timestamp){
      if(net_data['nodes'][i]['time'] == timestamp){
        var color=0xc42e0c;//c42e0c; // new node
      }else{
        var color = 0x218ccf;
      }
      curr_net['nodes'].push({'id':net_data['nodes'][i]['id'],
                              'label':net_data['nodes'][i]['label'],
                              'component':net_data['nodes'][i]['component'],
                              'color':color,
                              'n_art_sold':net_data['nodes'][i]['n_art_sold'],
                              'total_earn':net_data['nodes'][i]['total_earn']})
    }
  }
  return curr_net
}

// setup dynamic graph
const Graph = ForceGraph3D()(elem)
        .enableNodeDrag(false)
        .graphData(curr_net)
        .linkWidth(5)
        .nodeLabel(node =>{
          var content = ''.concat('Artist: ',node['label'],
                           '; Total Earnings: $', Math.round(node['total_earn']),
                           '; N art sold: ', node['n_art_sold'])
          return content
        })
        .linkMaterial(link => {
          return new THREE.LineBasicMaterial({color:link['color']})})
        .linkWidth('width')
        .nodeVal('n_art_sold')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          console.log(url)
          window.open(url);
        })

// start date
var curr_date = 'Friday Jan 22 2021 00:00:00';
curr_date = new Date(curr_date)

// seconds * minutes * hours * milliseconds = 1 day
var day = 60 * 60 * 24 * 1000;
var counter = 0;
var maxcounter = 40;

var isAnimationActive = true;
var interval = setInterval(() => {
      if(isAnimationActive){
        document.getElementById("myText").innerHTML = curr_date.toDateString();
        var curr_net = getCurrGraph(counter)
        Graph.graphData(curr_net);
        counter+=1
        // update date
        curr_date = new Date(curr_date.getTime() + day);

        if(counter === maxcounter){
          clearInterval(interval);
      }}
}, 1500);

// pause animation
document.getElementById('animationToggle').addEventListener('click', event => {
//      isAnimationActive ? Graph.pauseAnimation() : Graph.resumeAnimation();
      isAnimationActive = !isAnimationActive;
      event.target.innerHTML = `${(isAnimationActive ? 'Pause' : 'Resume')} Animation`;
});
