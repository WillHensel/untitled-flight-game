
function setupUI(scene) {
    let advancedTexture;
    function throttleSlider() {}
    function timeSelector() {
        let timeIndicator = new BABYLON.GUI.TextBlock();
        timeIndicator.fontSize = 30;
        timeIndicator.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        timeIndicator.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        timeIndicator.height = "42px";
        timeIndicator.width = "150px";
        timeIndicator.paddingLeft = 20;
        timeIndicator.paddingBottom = 20;
        advancedTexture.addControl(timeIndicator);
        
        scene.registerBeforeRender(function() {
            let time = new Date(timeNow);
            let hours = time.getHours();
            if (hours > 12) {
                hours = hours - 12;
            } else if (hours == 0) {
                hours = 12;
            }
            timeIndicator.text = hours +
            ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) +
            ' ' + (time.getHours() >= 12 ? 'PM' : 'AM');

            if (time.getHours() > 17 || time.getHours() < 6) {
                timeIndicator.color = "white";
            } else {
                timeIndicator.color = "black";
            }
        });
    }
    function compassIndicator() {}

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);


    // await importGui();
    timeSelector();
}