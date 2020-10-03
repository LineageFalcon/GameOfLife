document.addEventListener("DOMContentLoaded", function(event) {
    let modelInstance = new logicRender();
    let viewInstance = new guiRender(modelInstance);
    let controllerInstance = new controller();


    controller.setView(viewInstance);
    controller.setModel(modelInstance);
});