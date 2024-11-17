export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

export const vertexShaderSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec3 vOriginalPosition;

void main() {
    vNormal = mat3(uModelMatrix) * aNormal;
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vPosition = worldPos.xyz;
    vTexCoord = aTexCoord;
    vOriginalPosition = aPosition;
    gl_Position = uProjMatrix * uViewMatrix * worldPos;
}`;

export const fragmentShaderSource = `
precision highp float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec3 vOriginalPosition;

uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform vec4 uBaseColor;
uniform sampler2D uTexture;
uniform bool uUseTexture;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vPosition);
    vec3 viewDir = normalize(uViewPos - vPosition);
    vec3 halfDir = normalize(lightDir + viewDir);

    // Enhanced lighting model
    float ambient = 0.2;
    float diffuse = max(dot(normal, lightDir), 0.0);
    float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    vec4 baseColor = uUseTexture ? texture2D(uTexture, vTexCoord) : uBaseColor;
    
    // Add subtle gradient based on height for the bookshelf
    float heightGradient = (vOriginalPosition.y + 1.0) * 0.1;
    baseColor.rgb += heightGradient;

    // Combine lighting components
    vec3 color = baseColor.rgb * (ambient + diffuse) + 
                 vec3(1.0) * specular * baseColor.a +
                 vec3(0.5, 0.7, 1.0) * fresnel * baseColor.a;

    gl_FragColor = vec4(color, baseColor.a);
}`;