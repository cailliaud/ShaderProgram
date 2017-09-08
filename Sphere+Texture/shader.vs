
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying vec2 vTextureCoord;

void main(void) {
	vTextureCoord = aTextureCoord;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
