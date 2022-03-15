
let shadowGenerator;

function setupEnvironment(scene) {
    let directionalLight, skyMaterial

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
        terrain = new BABYLON.DynamicTerrain("Terrain", params, scene);

        let terrainMaterial = new BABYLON.StandardMaterial("TerrainMaterial", scene);
        terrainMaterial.specularColor = BABYLON.Color3.Black();
        terrain.mesh.material = terrainMaterial;
        terrainMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        terrainMaterial.specularColor = new BABYLON.Color3(0.01, 0.02, 0.005);
        terrainMaterial.ambientColor = new BABYLON.Color3(0.8, 1, 0.6);

        let terrainTexture = new BABYLON.Texture('../textures/grass.png',scene);
        terrainMaterial.diffuseTexture = terrainTexture;

        terrain.initialLOD = 10;
        terrain.receiveShadows = true
        terrain.update(true);

    }

    function setupSkybox() {
        skyMaterial = new BABYLON.SkyMaterial("SkyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        let skybox = BABYLON.Mesh.CreateBox("skyBox", 3000.0, scene);
        skybox.material = skyMaterial;
        skybox.addRotation(0, Math.PI / 2, 0);

        scene.registerBeforeRender(function() {
            let dateTimeNow = new Date(timeNow);
            let x = dateTimeNow.getHours() + dateTimeNow.getMinutes() / 60;
            let evening = false;
            if (x > 12) {
                x = -1 * (x - 12);
                evening = true;
            } 
            x = x / 12;
            if (!evening) {
                x = 1 - x;
            }
            // console.log(x);
            skyMaterial.inclination = x;
            skybox.position = piperBody.position;
        });
    }

    function setupLights() {
        let height = 20;
        directionalLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, -1), scene);
        directionalLight.intensity = 7;
        directionalLight.position = new BABYLON.Vector3(0, height, 0);

        shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);

        scene.registerBeforeRender(function() {
            
            let angle = skyMaterial.inclination * Math.PI * -1;
            if (skyMaterial.inclination > 0.55 || skyMaterial.inclination < -0.55) {
                directionalLight.intensity = 0;
            } else {
                directionalLight.intensity = 7;
            }
            directionalLight.direction.z = -height * Math.sin(angle);
            directionalLight.direction.y = -height * Math.cos(angle);
            directionalLight.position.z = piperBody.position.z + height * Math.sin(angle);
            directionalLight.position.y = piperBody.position.y + height * Math.cos(angle);

        });
    }

    function generateClouds() {
        let cloudSpriteManager = new BABYLON.SpriteManager("CloudsManager", "../textures/cloud.png", 2000, {width: 256, height: 256});
        let clouds = [];
        let maxCloudInArea = 100;
        let minCloudSize = 100;
        let maxCloudSize =500;
        let maxCloudDistance = 1300;
        let maxCloudRadius = 1200;
        let minCloudHeight = 175;
        let maxCloudHeight = 1500;

        scene.registerBeforeRender(function () {
            let cloudsToKeep = [];

            let currentTime = new Date(timeNow);
            currentTime = currentTime.getHours() + currentTime.getMinutes() / 60;
            currentTime /= 24;

            let piperPosition = piperBody.position.clone();
            piperPosition.y = 0;

            clouds.forEach((cloud) => {

                let cloudPosition = cloud.position.clone();
                cloudPosition.y = 0;

                let distance = BABYLON.Vector3.Distance(piperPosition, cloudPosition);
                if (distance < maxCloudDistance) {
                    cloudsToKeep.push(cloud);
                    if (cloud.color.a < 1) {
                        cloud.color.a += 0.1;
                    }
    
                } else {
                    if (cloud.color.a > 0) {
                        cloudsToKeep.push(cloud);
                        cloud.color.a -= 0.1;
                    } else {
                        cloud.dispose();                    
                    }
                }

                let currentColor = cloud.color;
                if (currentTime > 0.65 && currentTime < 0.78 && currentColor.r > 0 && currentColor.g > 0 && currentColor.b > 0) {
                    cloud.color.r = 1 - (currentTime - 0.65) / 0.13;
                    cloud.color.g = 1 - (currentTime - 0.65) / 0.13;
                    cloud.color.b = 1 - (currentTime - 0.65) / 0.13;
                } else if(currentTime > 0.22 && currentTime < 0.35 && currentColor.r < 1 && currentColor.g < 1 && currentColor.b < 1) {
                    cloud.color.r = (currentTime - 0.22) / 0.13;
                    cloud.color.g = (currentTime - 0.22) / 0.13;
                    cloud.color.b = (currentTime - 0.22) / 0.13;
                }
            });
            while (cloudsToKeep.length < maxCloudInArea) {
                let pickTheta = Math.random() * 360 * Math.PI / 180; // Left unsimplified for integer to float conversion
                let pickZ = piperPosition.z + maxCloudRadius * Math.cos(pickTheta);
                let pickX = piperPosition.x + maxCloudRadius * Math.sin(pickTheta);
                let pickY = Math.random() * (maxCloudHeight - minCloudHeight) + minCloudHeight;
                let pickWidth = Math.random() * (maxCloudSize - minCloudSize) + minCloudSize;
                let pickHeight = pickWidth;
                let newCloud = new BABYLON.Sprite("Cloud" + (cloudsToKeep.length + 1), cloudSpriteManager);
                newCloud.position = new BABYLON.Vector3(pickX, pickY,pickZ);
                newCloud.width = pickWidth;
                newCloud.height = pickHeight;
                if (currentTime > 0.65) {
                    newCloud.color.r = 1 - (currentTime - 0.65) / 0.13;
                    newCloud.color.g = 1 - (currentTime - 0.65) / 0.13;
                    newCloud.color.b = 1 - (currentTime - 0.65) / 0.13;
                }
                else if(currentTime < 0.35) {
                    newCloud.color.r = (currentTime - 0.22) / 0.13;
                    newCloud.color.g = (currentTime - 0.22) / 0.13;
                    newCloud.color.b = (currentTime - 0.22) / 0.13;
                }

                newCloud.color.a = 0;

                cloudsToKeep.push(newCloud);
            }

            clouds = cloudsToKeep;

        });

    }

    function setTimeOfDay() {
        // https://playground.babylonjs.com/#E6OZX#221
        function setSkyConfig() {
            var keys = [
                { frame: 0, value: from },
                { frame: 100, value: to }
            ];
            
            var animation = new BABYLON.Animation("animation", property, 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animation.setKeys(keys);
            
            scene.stopAnimation(skybox);
            scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 1);
        }

        function setDirectionalLightConfig() {

        }
    }
    generateTerrain();
    setupSkybox();
    setupLights();
    generateClouds();
}