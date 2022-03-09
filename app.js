var canvas = null;
var engine = null;

async function createScene() {
    let scene, camera, light, piperBody;

    function setupScene() {
        scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;
    }
    function setupCamera() {
        console.log("At start setupCamera");
        camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 100, -20), scene);
        camera.radius = 20;
        camera.heightOffset = 1;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.5;
        camera.maxCameraSpeed = 100;
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
    }

    function setupLights() {
        light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
        // light.diffuse = new BABYLON.Color3(1, 1, 1);
        // light.specular = new BABYLON.Color3(1, 1, 1);
        light.intensity = 5;
        light.position = new BABYLON.Vector3(0, 100, 10);

        // light2 = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(1, 1, 0), scene);
        // light2.intensity = 0.1;
    }

    async function importAndSetupPiper() {

        let piperProp;

        let piperRutter;
        let piperAileronPilot;
        let piperAileronPass;
        let piperPositionLightRight;
        let piperPositionLightLeft;
        let piperPositionLightTail;

        let cameraAttachment;

        function setupInitialTranslations() {
            piperRutter.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperProp.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperElevator.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperAileronPilot.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperAileronPass.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperPositionLightRight.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperPositionLightLeft.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperPositionLightTail.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
           
            piperBody.addRotation(0, Math.PI / 2, -Math.PI / 15);
            piperBody.translate(new BABYLON.Vector3(0, 50, 2), BABYLON.Space.WORLD);
        }

        function setupLights() {
            let positionLightRedWing = new BABYLON.PointLight("PositionLightRedWing", piperPositionLightLeft.position, scene);
            positionLightRedWing.diffuse = new BABYLON.Color3(0.8, 0.011, 0.008);
            positionLightRedWing.specular = new BABYLON.Color3(0.8, 0.011, 0.008);

            let positionLightRedTail = new BABYLON.PointLight("PositionLightRedTail", piperPositionLightTail.position, scene);
            positionLightRedTail.diffuse = new BABYLON.Color3(0.8, 0.011, 0.008);
            positionLightRedTail.specular = new BABYLON.Color3(0.8, 0.011, 0.008);

            let positionLightGreen = new BABYLON.PointLight("PositionLightGreen", piperPositionLightRight.position, scene);
            positionLightGreen.diffuse = new BABYLON.Color3(0.004, 0.8, 0.0);
            positionLightGreen.specular = new BABYLON.Color3(0.004, 0.8, 0.0);

            positionLightRedWing.parent = piperPositionLightLeft;
            positionLightGreen.parent = piperPositionLightRight;
            positionLightRedTail.parent = piperPositionLightTail;
        }

        function setupAnimations() {
            let rotation = 2;
            scene.registerBeforeRender(function() {
                if (rotation > 2) {
                    rotation = 0;
                }
                piperProp.rotation = new BABYLON.Vector3(rotation * Math.PI, 0, 0);
                rotation += 0.2;

                cameraAttachment.position = piperBody.position;

                piperBody.translate(new BABYLON.Vector3(-1, 0, 0), 1, BABYLON.Space.LOCAL);
            });
       }

        function setupControlSurfaceInput() {
            let rotationOffset = Math.PI / 36;
            let rotationLimit = Math.PI / 3;

            let elevatorRotationCounter = 0;
            let rutterRotationCounter = 0;
            let aileronRotationCounter = 0;

            scene.onKeyboardObservable.add((kbInfo) => {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "w":
                            case "W":
                                if (elevatorRotationCounter > -rotationLimit) {
                                    piperElevator.addRotation(0, 0, -rotationOffset);
                                    elevatorRotationCounter -= rotationOffset;
                                }
                                piperBody.addRotation(0, 0, rotationOffset)
                                break;
                            case "s":
                            case "S":
                                if (elevatorRotationCounter < rotationLimit) {
                                    piperElevator.addRotation(0, 0, rotationOffset);
                                    elevatorRotationCounter += rotationOffset;
                                }
                                piperBody.addRotation(0, 0, -rotationOffset)
                                break;
                            case "q":
                            case "Q":
                                if (rutterRotationCounter < rotationLimit) {
                                    piperRutter.addRotation(0, 0, rotationOffset);
                                    rutterRotationCounter += rotationOffset;
                                }
                                piperBody.addRotation(0, -rotationOffset, 0);
                                break;
                            case "e":
                            case "E":
                                if (rutterRotationCounter > -rotationLimit) {
                                    piperRutter.addRotation(0, 0, -rotationOffset);
                                    rutterRotationCounter -= rotationOffset;
                                }
                                piperBody.addRotation(0, rotationOffset, 0);
                                break;
                            case "a":
                            case "A":
                                if (aileronRotationCounter < rotationLimit) {
                                    piperAileronPilot.addRotation(0, 0, rotationOffset);
                                    piperAileronPass.addRotation(0, 0, -rotationOffset);
                                    aileronRotationCounter += rotationOffset
                                }
                                piperBody.addRotation(-rotationOffset, 0, 0);
                                break;
                            case "d":
                            case "D":
                                if (aileronRotationCounter > -rotationLimit) {
                                    piperAileronPilot.addRotation(0, 0, -rotationOffset);
                                    piperAileronPass.addRotation(0, 0, rotationOffset);
                                    aileronRotationCounter -= rotationOffset
                                }
                                piperBody.addRotation(rotationOffset, 0, 0);
                                break;
                            default:
                                break;
                        }
                        break;
                    // TODO return to origin animations
                    case BABYLON.KeyboardEventTypes.KEYUP:
                        // case "w":
                        // case "W":
                        //     while (elevatorRotationCounter != 0) {
                        //         piperElevator.addRotation(0, 0, -elevatorRotationOffset);
                        //         elevatorRotationCounter -= elevatorRotationOffset;
                        //         elevatorRotationCounter = Math.round(elevatorRotationCounter * 10) / 10;
                        //     }
                        //     console.log(elevatorRotationCounter);
                        //     break;
                        // case "s":
                        // case "S":
                        //     break;
                    default:
                        break;
                }


            });
        }


        let result = await BABYLON.SceneLoader.ImportMeshAsync("", "Piper/", "Piper_J3.babylon", scene);
        let meshes = result.meshes;

        piperBody = meshes[0];
        piperElevator = meshes[1];
        piperProp = meshes[2];
        piperRutter = meshes[3];
        piperAileronPilot = meshes[4];
        piperAileronPass = meshes[5];
        piperPositionLightRight = meshes[6];
        piperPositionLightLeft = meshes[7];
        piperPositionLightTail = meshes[8];

        piperRutter.parent = piperBody;
        piperElevator.parent = piperBody;
        piperProp.parent = piperBody;
        piperAileronPilot.parent = piperBody;
        piperAileronPass.parent = piperBody;
        piperPositionLightRight.parent = piperBody;
        piperPositionLightLeft.parent = piperBody;
        piperPositionLightTail.parent = piperBody;

        cameraAttachment = BABYLON.MeshBuilder.CreateBox("CameraAttachment", {}, 0);
        cameraAttachment.isVisible = false;

        camera.lockedTarget = cameraAttachment;
        camera.rotationOffset = 90;

        piperBody.checkCollisions = true;

        setupInitialTranslations();
        setupControlSurfaceInput();
        setupLights();
        setupAnimations();
    }

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

        let terrainTexture = new BABYLON.Texture('textures/grass.png',scene);
        terrainMaterial.diffuseTexture = terrainTexture;

        terrain.initialLOD = 10;
        terrain.checkCollisions = true;
        terrain.update(true);

    }

    function setupParticles() {
        let emitter = BABYLON.MeshBuilder.CreateBox("Rain emitter", {}, scene);
        emitter.position.x = piperBody.position.x - 100;
        emitter.position.y = piperBody.position.y - 10;
        emitter.parent = piperBody;
        emitter.isVisible = false;
        BABYLON.ParticleHelper.CreateAsync("rain", scene).then((set) => {
            set.systems.forEach((system) => { system.emitter = emitter } )
            set.systems[0].minLifeTime = 5;
            set.systems[0].maxLifeTime = 5;
            delete set.systems[1];
            set.systems.length = 1;
            console.log(set);
            set.start();
        });
    }

    function setupSkybox() {
        let skybox = new BABYLON.MeshBuilder.CreateBox("Skybox", {size: 4096}, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("Skybox material", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/clouds", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        skybox.parent = piperBody;
    }

    function setupGround() {
        let ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("GroundHeightMap", "textures/height-map.png", {width: 2048, height: 40960, subdivisions: 10, maxHeight: 2000, updatable:true});
        ground.position.z += 20480;
    }

    setupScene();
    setupCamera();
    setupLights();
    generateTerrain();
    // setupGround();


    await importAndSetupPiper();
    // setupSkybox();
    setupParticles();



    return scene;
};

async function init() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(
        canvas,
        true,
        { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }
    );

    let scene = await createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

