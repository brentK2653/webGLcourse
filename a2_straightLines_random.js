"use strict";

var canvas ;
var gl ;

var maxNumVertices = 2000;

var vertices     = [] ;
var vertexColors = [] ;
var linePoints   = [] ;
var nLines       =  0 ;
var totalPoints  =  0 ;

var vBuffer;
var cBuffer;


window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );



  // color array atrribute buffer

  vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  // Event listeners

  var vaX = Math.random() * 2. -1.;
  var vaY = Math.random() * 2. -1.;
  var vbX = Math.random() * 2. -1.;
  var vbY = Math.random() * 2. -1.;
  vertices.push(vec2(vaX, vaY), vec2(vbX, vbY))

  linePoints.push(2);

  var c0 = Math.random()
  var c1 = Math.random()
  var c2 = Math.random()
  vertexColors.push(vec4(c0,c1,c2,1.), vec4(c0,c1,c2,1.));

  render();

  
  document.getElementById("lineButton").onclick = function () {
    addLine();
    render();
  };

}



function addLine()
{
  var vaX = Math.random() * 2. -1.;
  var vaY = Math.random() * 2. -1.;
  var vbX = Math.random() * 2. -1.;
  var vbY = Math.random() * 2. -1.;
  vertices.push(vec2(vaX, vaY), vec2(vbX, vbY))

  linePoints.push(2);

  var c0 = Math.random()
  var c1 = Math.random()
  var c2 = Math.random()
  vertexColors.push(vec4(c0,c1,c2,1.), vec4(c0,c1,c2,1.));

  nLines++;
}


function render()
{
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var v0=0;

  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertexColors));
  
  for (var i0=0; i0 < nLines; i0++)
  {
    console.log(v0);
    gl.drawArrays(gl.LINES, v0, linePoints[i0]);
    v0 += linePoints[i0];
    
  }
  
}

