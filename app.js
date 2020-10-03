document.addEventListener("DOMContentLoaded", function() {
    let modelInstance = new logicRender();
    let viewInstance = new guiRender();
    new controller();

    controller.setView(viewInstance);
    controller.setModel(modelInstance);
});