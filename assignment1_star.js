"use strict";

var canvas;
var gl;

var points = [];

var nSubdivisions = 3;
var nVertices     = 10;
var thetaTwist    = 2.;
var bSieripinski  = 0;
var oddRad        = 1.0
var evenRad       = 0.2;
var bFilled       = 1;
var bWired        = 1;

var color_fill    = vec4( 0.9, 0.4, 0.8, 1.0 );
var color_wire    = vec4( 0.0, 0.0, 0.0, 1.0 );


/*
Assignment 1 for Coursera Course, "Interactive Computer Graphics with WebGL",
employing course materials from Prof. Edward Angel of University of New Mexico.
 */


var bufferId;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3,10), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("sliderRecur").onchange = function(target)
    {
      nSubdivisions = parseInt(event.target.value);
      render();
    };

    document.getElementById("sliderSides").onchange = function(target)
    {
      nVertices = 2 * parseInt(event.target.value);
      render();
    };

    document.getElementById("sliderTwistFactor").onchange = function(target)
    {
      thetaTwist = parseInt(event.target.value) / 200.;
      render();
    };

    document.getElementById("sliderInnerRad").onchange = function(target)
    {
      evenRad = parseInt(event.target.value) / 100.;
      render();
    };

    document.getElementById("sliderSieripinski").onchange = function(target)
    {
      bSieripinski = parseInt(event.target.value);
      render();
    };


    render();
};


function rotatePoint(vertIn, angle_rad)
{
  var x = vertIn[0];
  var y = vertIn[1];
  
  vertIn[0] = x * Math.cos(angle_rad) - y * Math.sin(angle_rad);
  vertIn[1] = x * Math.sin(angle_rad) + y * Math.cos(angle_rad);
}


function twistPoint(vertIn, vertOut)
{
  var x = vertIn[0];
  var y = vertIn[1];

  var r = Math.sqrt(x*x + y*y);
  
  var angle_rad = thetaTwist * r;
  
  vertOut[0] = x * Math.cos(angle_rad) - y * Math.sin(angle_rad);
  vertOut[1] = x * Math.sin(angle_rad) + y * Math.cos(angle_rad);
  
}


function triangle( a, b, c )
{
    var aOut = vec2(0,0);
    var bOut = vec2(0,0);
    var cOut = vec2(0,0);

    //getPolarCoords(a, vecPolar);
    //twistCoords(vecPolar, a, thetaTwist);
    twistPoint(a, aOut);
    
    //getPolarCoords(b, vecPolar);
    //twistCoords(vecPolar, b, thetaTwist);
    twistPoint(b, bOut);

    //getPolarCoords(c, vecPolar);
    //twistCoords(vecPolar, c, thetaTwist);
    twistPoint(c, cOut);

    points.push(aOut, bOut, cOut);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
}

/*
function triangle( a, b, c )
{
    points.push( a, b, c );
}
*/

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        if (!bSieripinski)
          divideTriangle( ac, bc, ab, count );
    }
}

window.onload = init;

function render()
{
    var rotateVertices  = 2. * Math.PI / nVertices;
    var vert0 = vec2(0., 0.);

    var vert1 = vec2(0., 1.);
    var vert2 = vec2(0., 0.);
    vert2[0] = vert1[0];
    vert2[1] = vert1[1];
    rotatePoint(vert2, rotateVertices);
    
    var iTriangle = 0;
    var vert1a = vec2(0., 0.);
    var vert2a = vec2(0., 0.);
    var rad1   = 1.;
    var rad2   = 1.;
    
    
    
    
    
    points = [];
    //divideTriangle( vert0, vert1a, vert2a,
    //                nSubdivisions);

    
    gl.clear( gl.COLOR_BUFFER_BIT );
    for (iTriangle=0; iTriangle < nVertices; iTriangle++)
    {
      if (iTriangle % 2 == 0)
      {
        rad1 = oddRad;
        rad2 = evenRad;
      }
      else
      {
        rad2 = oddRad;
        rad1 = evenRad;
      }
      vert1a[0] = vert1[0] * rad1;
      vert1a[1] = vert1[1] * rad1;
      
      vert2a[0] = vert2[0] * rad2;
      vert2a[1] = vert2[1] * rad2;
      
      divideTriangle( vert0, vert1a, vert2a,
                      nSubdivisions);
      rotatePoint(vert1, rotateVertices);
      rotatePoint(vert2, rotateVertices);
    }

    //requestAnimFrame(render);
}
