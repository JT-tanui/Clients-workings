import { mat4 } from 'gl-matrix';

export class Bookshelf {
    constructor(gl) {
        this.gl = gl;
        this.position = [0, 0, -3];
        this.rotation = 0;
        this.scale = [1.5, 2, 0.8];
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;
        const vertices = [];
        const normals = [];
        const indices = [];
        
        this.generateShelfGeometry(vertices, normals, indices);

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

    generateShelfGeometry(vertices, normals, indices) {
        // Shelf dimensions
        const width = 1.0;
        const height = 1.0;
        const depth = 0.4;
        const thickness = 0.05;
        const shelfCount = 3;
        const shelfSpacing = (height - thickness) / (shelfCount + 1);

        // Helper function to add a box
        const addBox = (x, y, z, w, h, d, startIndex) => {
            const points = [
                // Front face
                [-w/2, -h/2, d/2], [w/2, -h/2, d/2], [w/2, h/2, d/2], [-w/2, h/2, d/2],
                // Back face
                [-w/2, -h/2, -d/2], [-w/2, h/2, -d/2], [w/2, h/2, -d/2], [w/2, -h/2, -d/2],
                // Top face
                [-w/2, h/2, -d/2], [-w/2, h/2, d/2], [w/2, h/2, d/2], [w/2, h/2, -d/2],
                // Bottom face
                [-w/2, -h/2, -d/2], [w/2, -h/2, -d/2], [w/2, -h/2, d/2], [-w/2, -h/2, d/2],
                // Right face
                [w/2, -h/2, -d/2], [w/2, h/2, -d/2], [w/2, h/2, d/2], [w/2, -h/2, d/2],
                // Left face
                [-w/2, -h/2, -d/2], [-w/2, -h/2, d/2], [-w/2, h/2, d/2], [-w/2, h/2, -d/2],
            ];

            points.forEach(point => {
                vertices.push(point[0] + x, point[1] + y, point[2] + z);
            });

            // Add normals
            const faceNormals = [
                [0, 0, 1], [0, 0, -1],  // Front, Back
                [0, 1, 0], [0, -1, 0],  // Top, Bottom
                [1, 0, 0], [-1, 0, 0],  // Right, Left
            ];

            faceNormals.forEach(normal => {
                for (let i = 0; i < 4; i++) {
                    normals.push(...normal);
                }
            });

            // Add indices
            for (let i = 0; i < 6; i++) {
                const base = startIndex + i * 4;
                indices.push(
                    base, base + 1, base + 2,
                    base, base + 2, base + 3
                );
            }

            return startIndex + 24; // Return next vertex index
        };

        let vertexIndex = 0;

        // Add back panel
        vertexIndex = addBox(0, 0, -depth/2, width, height, thickness, vertexIndex);

        // Add shelves
        for (let i = 0; i < shelfCount; i++) {
            const shelfY = -height/2 + (i + 1) * shelfSpacing;
            vertexIndex = addBox(0, shelfY, 0, width, thickness, depth, vertexIndex);
        }

        // Add side panels
        vertexIndex = addBox(-width/2, 0, 0, thickness, height, depth, vertexIndex);
        vertexIndex = addBox(width/2, 0, 0, thickness, height, depth, vertexIndex);

        // Add top and bottom panels
        vertexIndex = addBox(0, -height/2, 0, width, thickness, depth, vertexIndex);
        addBox(0, height/2, 0, width, thickness, depth, vertexIndex);
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
        
        // Rich wood material color
        gl.uniform1i(this.locations.uniforms.uUseTexture, 0);
        gl.uniform4fv(this.locations.uniforms.baseColor, [0.4, 0.2, 0.1, 1.0]);

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

export function createBookshelf(gl) {
    return new Bookshelf(gl);
}