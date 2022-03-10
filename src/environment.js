
function setupEnvironment(scene) {
    function generateTerrain() {
        let mapSubX = 1000;
        let mapSubZ = 1000;
        let seed = 0.3;
        let noiseScale = 0.003;
        let elevationScale = 60.0;
        noise.seed(seed);
        let mapData = new Float32Array(mapSubX * mapSubZ * 3);
        let mapColors = new Float32Array(mapSubX * mapSubZ * 3); 
        for (let i = 0; i < mapSubZ; i++) {
            for (let j = 0; j < mapSubX; j++) {
                let x = (j - mapSubX * 0.5) * 5.0;
                let z = (i - mapSubZ * 0.5) * 2.0;
                let y;
                if (x > -25 && x < 25 && z > -25 && z < 25) {
                    y = 0;
                } else {
                    y = noise.simplex2(x * noiseScale, z * noiseScale);
                    y *= (0.5 + y) * y * elevationScale;
                }

                let xPos = 3 * (i * mapSubX + j);
                mapData[xPos] = x;
                mapData[xPos + 1] = y;
                mapData[xPos + 2] = z;

                if(y < 10) {
                    mapColors[xPos] = 0.8;     
                    mapColors[xPos + 1] = 1; 
                    mapColors[xPos + 2] = 0.6;    
                }
                else if(y < 130) {
                    mapColors[xPos] = 0.7;     
                    mapColors[xPos + 1] = 0.51;
                    mapColors[xPos + 2] = 0.29;    
                } 
                else {
                    mapColors[xPos] = 0.90;     
                    mapColors[xPos + 1] = 1.00; 
                    mapColors[xPos + 2] = 1.00;    
                }

            }
        }


        let terrainSub = 100;
        let params = {
            mapData: mapData,
            mapSubX: mapSubX,
            mapSubZ: mapSubZ,
            mapColors: mapColors,
            terrainSub: terrainSub
        }
        let terrain = new BABYLON.DynamicTerrain("Terrain", params, scene);

        let terrainMaterial = new BABYLON.StandardMaterial("TerrainMaterial", scene);
        terrainMaterial.specularColor = BABYLON.Color3.Black();
        terrain.mesh.material = terrainMaterial;
        terrainMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        terrainMaterial.specularColor = new BABYLON.Color3(0.01, 0.02, 0.005);
        terrainMaterial.ambientColor = new BABYLON.Color3(0.8, 1, 0.6);

        let terrainTexture = new BABYLON.Texture('../textures/grass.png',scene);
        terrainMaterial.diffuseTexture = terrainTexture;

        terrain.initialLOD = 10;
        terrain.mesh.checkCollisions = true;
        terrain.receiveShadows = true
        terrain.update(true);

    }

    function setupSkybox() {
        let skyMaterial = new BABYLON.SkyMaterial("SkyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        skyMaterial.inclination = -0.1;
        // skyMaterial.cameraOffset.y = 0;
        let skybox = BABYLON.Mesh.CreateBox("skyBox", 3000.0, scene);
        skybox.material = skyMaterial;
        skybox.addRotation(0, Math.PI / 2, 0);

        scene.registerBeforeRender(function() {
            skybox.position = piperBody.position;
        });
    }

    function setupLights() {
        let light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, -1), scene);
        // light1.diffuse = new BABYLON.Color3(1, 1, 1);
        // light1.specular = new BABYLON.Color3(1, 1, 1);
        light1.intensity = 7;
        light1.position = new BABYLON.Vector3(0, 100, 10);

        let light2 = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(1, 1, 0), scene);
        light2.intensity = 0.5;

        shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
    }


    generateTerrain();
    setupSkybox();
    setupLights();
}