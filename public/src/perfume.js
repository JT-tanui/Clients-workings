import { mat4 } from 'gl-matrix';

export class PerfumeBottle {
    constructor(gl) {
        this.gl = gl;
        this.position = [0, 0, 0];
        this.rotation = 0;
        this.scale = [0.15, 0.15, 0.15]; // Reduced size
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;
        const vertices = [];
        const normals = [];
        const indices = [];
        
        this.generateBottleGeometry(vertices, normals, indices);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.indexCount = indices.length;
    }

    generateBottleGeometry(vertices, normals, indices) {
        const segments = 32;
        
        // More detailed perfume bottle profile (x, y coordinates)
        const profile = [
            // Base
            [0.0, -1.0],    // Center bottom
            [0.3, -0.95],   // Base edge
            [0.35, -0.9],   // Base curve
            // Main body
            [0.45, -0.8],   // Lower body
            [0.5, -0.6],    // Mid-lower body
            [0.52, -0.4],   // Middle body
            [0.52, -0.2],   // Mid-upper body
            [0.5, 0.0],     // Upper body
            [0.45, 0.1],    // Shoulder start
            // Neck
            [0.25, 0.2],    // Shoulder
            [0.2, 0.3],     // Upper shoulder
            [0.15, 0.4],    // Neck start
            [0.12, 0.5],    // Neck middle
            [0.15, 0.6],    // Neck top
            // Cap
            [0.2, 0.65],    // Cap base
            [0.22, 0.7],    // Cap middle
            [0.2, 0.8],     // Cap top
            [0.18, 0.85],   // Cap edge
            [0.0, 0.9]      // Cap center
        ];

        // Generate vertices and normals
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let j = 0; j < profile.length; j++) {
                const [radius, height] = profile[j];
                const x = radius * cosTheta;
                const z = radius * sinTheta;
                const y = height;

                // Vertex position
                vertices.push(x, y, z);

                // Calculate normal
                let nx = cosTheta;
                let nz = sinTheta;
                let ny = 0;

                // Adjust normals for different parts of the bottle
                if (j < 3) { // Base
                    ny = -0.5;
                } else if (j < 8) { // Body
                    ny = 0.1;
                } else if (j < 14) { // Neck
                    ny = 0.3;
                } else { // Cap
                    ny = 0.5;
                }

                const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
                normals.push(nx/length, ny/length, nz/length);
            }
        }

        // Generate indices
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < profile.length - 1; j++) {
                const current = i * profile.length + j;
                const next = (i + 1) * profile.length + j;

                indices.push(
                    current, next, current + 1,
                    next, next + 1, current + 1
                );
            }
        }
    }

    setProgram(program, locations) {
        this.program = program;
        this.locations = locations;
    }

    render() {
        const gl = this.gl;
        
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, this.position);
        mat4.rotate(modelMatrix, modelMatrix, this.rotation, [0, 1, 0]);
        mat4.scale(modelMatrix, modelMatrix, this.scale);

        gl.uniformMatrix4fv(this.locations.uniforms.modelMatrix, false, modelMatrix);
        
        // Enhanced glass material properties with a slight blue tint
        gl.uniform1i(this.locations.uniforms.uUseTexture, 0);
        gl.uniform4fv(this.locations.uniforms.baseColor, [0.8, 0.85, 1.0, 0.9]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.locations.attributes.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attributes.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.locations.attributes.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attributes.normal);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}

export function createPerfumeBottle(gl) {
    return new PerfumeBottle(gl);
}