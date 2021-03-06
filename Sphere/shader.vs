
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying float depht;
varying vec4 vColor;

void main(void) {
	
	depht = aVertexPosition.z;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
