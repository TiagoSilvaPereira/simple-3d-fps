/**
 * Method to execute some code when a mesh intersects another mesh
 */ 
BABYLON.Mesh.prototype.executeOnIntersection = function(intersectionMesh, callbackToExecute, autoCreateManager = false) {
    
    if(!this.actionManager && autoCreateManager) {
        this.actionManager = new BABYLON.ActionManager(
            this.getScene()
        );
    }
    
    this.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: intersectionMesh
            },
            callbackToExecute
        )
    );
}

/**
 * Method to set an ellipsoid (for collision) based on boundingbox size
 * Thanks Wingnut
 */ 
BABYLON.Mesh.prototype.setEllipsoidPerBoundingBox = function(scene) {
    var boundingBoxInfo = this.getBoundingInfo();
    var meshBoundingBox = boundingBoxInfo.boundingBox;
    
    this.ellipsoid = meshBoundingBox.maximumWorld.subtract(meshBoundingBox.minimumWorld).scale(0.5);
}

/**
 * Method to draw the collision ellipsoid of any mesh
 * Thanks Wingnut
 */
BABYLON.Mesh.prototype.drawEllipsoid = function() {
    this.computeWorldMatrix(true);

    var ellipsoidMat = this.getScene().getMaterialByName("__ellipsoidMat__");
    
    if (! ellipsoidMat) { 
        ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", this.getScene());
        ellipsoidMat.wireframe = true;
        ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
        ellipsoidMat.specularColor = BABYLON.Color3.Black();
    }

    var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, this.getScene());
    ellipsoid.scaling = this.ellipsoid.clone();
    ellipsoid.scaling.y *= 2;
    ellipsoid.scaling.x *= 2;
    ellipsoid.scaling.z *= 2;
    ellipsoid.material = ellipsoidMat;
    ellipsoid.parent = this;
    ellipsoid.computeWorldMatrix(true);
}