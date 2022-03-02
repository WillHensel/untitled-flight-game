var canvas = null;
var engine = null;

function createScene() {
    let scene, camera, light, ground, piperBody;

    function setupScene() {
        scene = new BABYLON.Scene(engine);
    }
    function setupCamera() {
        console.log("At start setupCamera");
        // camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 5, -20), scene);
        // camera.radius = 10;
        camera = new BABYLON.ArcRotateCamera("ArcRotateCam", 0, 0, 20, BABYLON.Vector3(0,0,0), scene);

        camera.attachControl(canvas, true);
        // camera.lockedTarget = piperBody;

    }
    function setupLights() {
        light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1.5;
        light.position = new BABYLON.Vector3(0, 100, 0);

        light2 = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(1, 1, 0), scene);
        light2.intensity = 0.4
    }
    function setupGround() {
        var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
        let whiteMat = new BABYLON.StandardMaterial("whiteMat", scene);
        whiteMat.diffuseColor = new BABYLON.Color3(0,0.3, 0.05);
        whiteMat.diffuseTexture = noiseTexture;
        whiteMat.ambientColor = new BABYLON.Color3(0,0.3, 0.05);

        ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
        ground.material = whiteMat;
    }
    function setupOrientationLines() {
        let xLine = BABYLON.MeshBuilder.CreateLines("xLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(4, 0.01, 0)],
            colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)]
        }, scene);
        let yLine = BABYLON.MeshBuilder.CreateLines("yLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(0, 4.01, 0)],
            colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)]
        }, scene);
        let zLine = BABYLON.MeshBuilder.CreateLines("zLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(0, 0.01, 4)],
            colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)]
        }, scene);
    }

    function importMeshes() {

        let piperProp;
        let piperRutter;
        let piperAileronPilot;
        let piperAileronPass;

        function setupInitialTranslations() {
            piperRutter.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperProp.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperElevator.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperAileronPilot.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
            piperAileronPass.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
           
            piperBody.addRotation(0, Math.PI / 2, -Math.PI / 15);
            piperBody.translate(new BABYLON.Vector3(0, 0.9, 2), BABYLON.Space.WORLD);
        }

        function setupPropAnimation() {
            let rotation = 2;
            scene.registerBeforeRender(function() {
                if (rotation > 2) {
                    rotation = 0;
                }
                piperProp.rotation = new BABYLON.Vector3(rotation * Math.PI, 0, 0);
                rotation += 0.2;
            });
        }

        function setupControlSurfaceInput() {
            let rotationOffset = Math.PI / 36;
            let rotationLimit = Math.PI / 6;

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

                                break;
                            case "s":
                            case "S":
                                if (elevatorRotationCounter < rotationLimit) {
                                    piperElevator.addRotation(0, 0, rotationOffset);
                                    elevatorRotationCounter += rotationOffset;
                                }
                                break;
                            case "q":
                            case "Q":
                                if (rutterRotationCounter < rotationLimit) {
                                    piperRutter.addRotation(0, 0, rotationOffset);
                                    rutterRotationCounter += rotationOffset;
                                }
                                break;
                            case "e":
                            case "E":
                                if (rutterRotationCounter > -rotationLimit) {
                                    piperRutter.addRotation(0, 0, -rotationOffset);
                                    rutterRotationCounter -= rotationOffset;
                                }
                                break;
                            case "a":
                            case "A":
                                if (aileronRotationCounter < rotationLimit) {
                                    piperAileronPilot.addRotation(0, 0, rotationOffset);
                                    piperAileronPass.addRotation(0, 0, -rotationOffset);
                                    aileronRotationCounter += rotationOffset

                                }
                                break;
                            case "d":
                            case "D":
                                if (aileronRotationCounter > -rotationLimit) {
                                    piperAileronPilot.addRotation(0, 0, -rotationOffset);
                                    piperAileronPass.addRotation(0, 0, rotationOffset);
                                    aileronRotationCounter -= rotationOffset

                                }
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
                }
            });
        }

        BABYLON.SceneLoader.ImportMesh("", "Piper/", "Piper_J3.babylon", scene, function (meshes) {
            piperBody = meshes[0];
            piperElevator = meshes[1];
            piperProp = meshes[2];
            piperRutter = meshes[3];
            piperAileronPilot = meshes[4];
            piperAileronPass = meshes[5];

            piperRutter.parent = piperBody;
            piperElevator.parent = piperBody;
            piperProp.parent = piperBody;
            piperAileronPilot.parent = piperBody;
            piperAileronPass.parent = piperBody;


            setupInitialTranslations();
            setupPropAnimation();
            setupControlSurfaceInput();
        });
    }

    function generateTerrain() {
        let mapSubX = 1000;
        let mapSubZ = 1000;
        let seed = 0.1;
        let noiseScale = 0.03;
        let elevationScale = 15.0;
        noise.seed(seed);
        let mapData = new Float32Array(mapSubX * mapSubZ * 3);
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
            }
        }


        let terrainSub = 100;
        let params = {
            mapData: mapData,
            mapSubX: mapSubX,
            mapSubZ: mapSubZ,
            terrainSub: terrainSub
        }
        let terrain = new BABYLON.DynamicTerrain("Terrain", params, scene);

        let terrainMaterial = new BABYLON.StandardMaterial("TerrainMaterial", scene);
        terrainMaterial.diffuseColor = BABYLON.Color3.Green();
        terrainMaterial.wireframe = true;
        terrain.mesh.material = terrainMaterial;

    }

    setupScene();
    importMeshes();
    setupCamera();
    setupLights();
    // setupGround();
    setupOrientationLines();
    generateTerrain();

    return scene;
};

function init() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(
        canvas,
        true,
        { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }
    );

    let scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

