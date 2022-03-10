

async function importAndSetupPiper(scene) {

    let piperBody;

    let piperProp;

    let piperRutter;
    let piperAileronPilot;
    let piperAileronPass;
    let piperPositionLightRight;
    let piperPositionLightLeft;
    let piperPositionLightTail;

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
        piperBody.translate(new BABYLON.Vector3(0, 20, 2), BABYLON.Space.WORLD);
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

        // shadowGenerator.getShadowMap().renderList.push(piperBody);
    }

    function setupAnimations() {
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

    piperBody.checkCollisions = true;

    setupInitialTranslations();
    setupControlSurfaceInput();
    setupLights();
    setupAnimations();

    return piperBody;
}
