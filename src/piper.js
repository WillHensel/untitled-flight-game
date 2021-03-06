

async function importAndSetupPiper(scene) {

    let piperBody;

    let piperProp;

    let piperRutter;
    let piperElevator;
    let piperAileronPilot;
    let piperAileronPass;
    let piperPositionLightRight;
    let piperPositionLightLeft;
    let piperPositionLightTail;

    let initialElevatorRotation;
    let initialRutterRotation;
    let initialAileronPassRotation;
    let initialAileronPilotRotation;

    function setupInitialTranslations() {
        piperRutter.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperProp.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperElevator.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperAileronPilot.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperAileronPass.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperPositionLightRight.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperPositionLightLeft.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);
        piperPositionLightTail.translate(new BABYLON.Vector3(1.75, -0.4, 0), 1, BABYLON.Space.WORLD);

        
        piperBody.addRotation(0, Math.PI / 2,  -Math.PI / 15);
        
        piperBody.translate(new BABYLON.Vector3(0, 20, 2), BABYLON.Space.WORLD);

        initialElevatorRotation = piperElevator.rotation.z;
        initialRutterRotation = piperRutter.rotation.z;
        initialAileronPassRotation = piperAileronPass.rotation.z;
        initialAileronPilotRotation = piperAileronPilot.rotation.z;
      
    }

    function setupLights() {
        let positionLightRedWing = new BABYLON.PointLight("PositionLightRedWing", piperPositionLightLeft.position, scene);
        positionLightRedWing.diffuse = new BABYLON.Color3(0.8, 0.011, 0.008);
        positionLightRedWing.specular = new BABYLON.Color3(0.8, 0.011, 0.008);
        positionLightRedWing.intensity = 0.25;

        let positionLightRedTail = new BABYLON.PointLight("PositionLightRedTail", piperPositionLightTail.position, scene);
        positionLightRedTail.diffuse = new BABYLON.Color3(0.8, 0.011, 0.008);
        positionLightRedTail.specular = new BABYLON.Color3(0.8, 0.011, 0.008);
        positionLightRedTail.intensity = 0.25;

        let positionLightGreen = new BABYLON.PointLight("PositionLightGreen", piperPositionLightRight.position, scene);
        positionLightGreen.diffuse = new BABYLON.Color3(0.004, 0.8, 0.0);
        positionLightGreen.specular = new BABYLON.Color3(0.004, 0.8, 0.0);
        positionLightGreen.intensity = 0.25;

        positionLightRedWing.parent = piperPositionLightLeft;
        positionLightGreen.parent = piperPositionLightRight;
        positionLightRedTail.parent = piperPositionLightTail;
    }

    function setupAudio() {
        let engineNoise = new BABYLON.Sound("EngineSound", rootDir + "audio/engine.wav", scene, null, {
            loop: true,
            autoplay: true,
            length: 6,
            offset: 1,
            volume: 0.5
        });
    }

    function setupAnimations() {
        let rotation = 2;
        scene.registerBeforeRender(function() {
            if (rotation > 2) {
                rotation = 0;
            }
            piperProp.rotation = new BABYLON.Vector3(rotation * Math.PI, 0, 0 );
            rotation += 0.2;
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
                            piperBody.addRotation(0, 0, rotationOffset);
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
                case BABYLON.KeyboardEventTypes.KEYUP:
                    switch (kbInfo.event.key) {
                    case "w":
                    case "W":
                    case "s":
                    case "S":
                        piperElevator.rotation.z = initialElevatorRotation;
                        elevatorRotationCounter = 0;
                        break;
                    case "q":
                    case "Q":
                    case "e":
                    case "E":
                        piperRutter.rotation.z = initialRutterRotation;
                        rutterRotationCounter = 0;
                        break;
                    case "a":
                    case "A":
                    case "d":
                    case "D":
                        piperAileronPass.rotation.z = initialAileronPassRotation;
                        piperAileronPilot.rotation.z = initialAileronPilotRotation;
                        aileronRotationCounter = 0;
                        break;
                default:
                    break;
                }
                break;
            }


        });
    }

    function setupCrashParticleEmitter() {
        let crashParticleSystem = new BABYLON.ParticleSystem("CrashParticles", 20, scene);
        crashParticleSystem.particleTexture = new BABYLON.Texture(rootDir + "textures/fire-particle-large.png");
        crashParticleSystem.emitter = piperBody;

        let crashSubSystem = new BABYLON.ParticleSystem("CrashParticlesSub", 2, scene);
        crashSubSystem.particleTexture = new BABYLON.Texture(rootDir + "textures/fire-particle-sub.png");
        let crashSubEmitter = new BABYLON.SubEmitter(crashSubSystem);
        crashSubEmitter.type = BABYLON.SubEmitterType.END;
        crashSubEmitter.inheritDirection = true;
        crashSubEmitter.inheritedVelocityAmount = 10;

        crashParticleSystem.subEmitters = [crashSubEmitter];

        crashParticleSystem.emitRate = 20;
        crashParticleSystem.minEmitBox = new BABYLON.Vector3(-5, 0, -3);
        crashParticleSystem.maxEmitBox = new BABYLON.Vector3(5, 0, 3);

        return crashParticleSystem;
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

    setupInitialTranslations();
    setupControlSurfaceInput();
    setupLights();
    setupAnimations();
    setupAudio();
    piperBody.crashParticleSystem = setupCrashParticleEmitter();


    return piperBody;
}
